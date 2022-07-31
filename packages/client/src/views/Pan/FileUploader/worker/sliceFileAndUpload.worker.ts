import SparkMD5 from "spark-md5";
import type { MainOnMessage, MainPostMessage } from "./types";

const PostMessage = (arg: MainOnMessage, buffers?: ArrayBuffer[]) => postMessage(arg, { transfer: buffers });

const chunkSize = import.meta.env.PUBLIC_UPLOAD_CHUNKSIZE;
const files = new Map<
    string,
    {
        folderId: string;
        fileName: string;
        allchunks: number;
        uploadedChunks: number;
        chunkBuffer: ArrayBuffer[];
    }
>();

self.addEventListener("message", ({ data }: { data: MainPostMessage }) => {
    switch (data.step) {
        case "splitBuffer":
            {
                const { fileBuffers, fileNames, folderId } = data;
                for (let i = 0; i < fileBuffers.length; i++) {
                    const chunkBuffer = splitBuffer(fileBuffers[i]);
                    const hash = getFileHash(chunkBuffer);
                    console.log(hash);
                    files.has(hash) ||
                        files.set(hash, {
                            folderId,
                            fileName: fileNames[i],
                            allchunks: chunkBuffer.length,
                            uploadedChunks: 0,
                            chunkBuffer,
                        });
                    PostMessage({
                        step: "uploadStart",
                        hash,
                        fileName: fileNames[i],
                        folderId,
                        chunks: chunkBuffer.length,
                    });
                    console.log("文件解析完毕");
                }
            }
            break;

        case "uploadChunks":
            {
                const { needChunks, hash } = data;
                const file = files.get(hash);
                if (file) {
                    PostMessage(
                        {
                            step: "uploadChunk",
                            folderId: file.folderId,
                            fileName: file.fileName,
                            hash,
                            buffers: file.chunkBuffer.map((buffer, index) =>
                                needChunks.includes(index) ? buffer : null
                            ),
                        },
                        file.chunkBuffer
                    );
                    console.log("开始上传文件");
                } else {
                    PostMessage({
                        step: "error",
                        msg: "文件缓存未找到",
                    });
                }
            }
            break;

        case "uploadOneChunkEnd":
            {
                const { hash } = data;
                const file = files.get(hash);
                if (file) {
                    file.uploadedChunks++;
                    PostMessage({ step: "progress", all: file.allchunks, already: file.uploadedChunks });
                }
            }
            break;

        case "uploadEnd":
            {
                const { hash, folderJson } = data;
                files.delete(hash);
                PostMessage({ step: "end", folderJson });
                console.log("文件上传完毕");
            }
            break;

        case "uploadError":
            {
                PostMessage({ step: "error", msg: "文件上传失败" });
            }
            break;
    }
});

/** 获得文件的唯一hash */
function getFileHash(buffers: ArrayBuffer[]) {
    const spark = new SparkMD5.ArrayBuffer();
    for (const buffer of buffers) {
        spark.append(buffer);
    }
    return spark.end();
}

/** 给buffer切片 */
function splitBuffer(buffer: ArrayBuffer) {
    const chunkSize = +import.meta.env.PUBLIC_UPLOAD_CHUNKSIZE;
    const fileBufferChunks: ArrayBuffer[] = [];
    let curChunkIndex = 0;
    while (curChunkIndex < buffer.byteLength) {
        const chunk = buffer.slice(curChunkIndex, curChunkIndex + chunkSize);
        fileBufferChunks.push(chunk);
        curChunkIndex += chunkSize;
    }
    return fileBufferChunks;
}
