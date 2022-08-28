import SparkMD5 from "spark-md5";
import type { MainOnMessage, MainPostMessage } from "./types";

const PostMessage = (arg: MainOnMessage, buffers?: ArrayBuffer[]) => postMessage(arg, { transfer: buffers });

const files = new Map<
    string,
    {
        folderId: string;
        fileName: string;
        chunks: number;
        uploadedChunks: number;
        chunkBuffer: ArrayBuffer[] | null;
    }
>();

self.addEventListener("message", ({ data }: { data: MainPostMessage }) => {
    switch (data.step) {
        case "splitBuffer": {
            const { fileBuffers, fileNames, folderId } = data;
            for (let i = 0; i < fileBuffers.length; i++) {
                PostMessage({ step: "beginAnalyzeFile", name: fileNames[i] });
                const chunkBuffer = splitBuffer(fileBuffers[i]);
                const chunks = chunkBuffer.length;
                const hash = getFileHash(chunkBuffer);
                files.has(hash) ||
                    files.set(hash, {
                        folderId,
                        fileName: fileNames[i],
                        chunks,
                        uploadedChunks: 0,
                        chunkBuffer,
                    });
                PostMessage({
                    step: "uploadStart",
                    hash,
                    fileName: fileNames[i],
                    folderId,
                    chunks,
                });
                PostMessage({
                    step: "analyzeFileEnd",
                    name: fileNames[i],
                    chunks,
                });
            }
            break;
        }

        case "uploadChunks": {
            const { needChunks, hash } = data;
            const file = files.get(hash);
            if (file) {
                if (file.chunkBuffer) {
                    PostMessage(
                        {
                            step: "uploadChunk",
                            folderId: file.folderId,
                            fileName: file.fileName,
                            hash,
                            buffers:
                                needChunks.length == 0
                                    ? []
                                    : file.chunkBuffer!.map((buffer, index) =>
                                          needChunks.includes(index) ? buffer : null
                                      ),
                        },
                        file.chunkBuffer!
                    );
                    file.chunkBuffer = null;
                    PostMessage({ step: "beginUploadFile", name: file.fileName });
                } else {
                    PostMessage({ step: "error", msg: "解析遇到错误 请刷新页面重试" });
                }
            } else {
                PostMessage({
                    step: "error",
                    msg: "文件缓存未找到",
                });
            }
            break;
        }

        case "uploadOneChunkEnd": {
            const { hash } = data;
            const file = files.get(hash);
            if (file) {
                file.uploadedChunks++;
                PostMessage({
                    step: "progress",
                    already: file.uploadedChunks,
                    name: file.fileName,
                    chunks: file.chunks,
                });
            }
            break;
        }

        case "waitUploadEnd": {
            PostMessage({ step: "waitUploadEnd", name: data.name });
            break;
        }

        case "uploadEnd": {
            const { hash, folderJson } = data;
            const file = files.get(hash);
            if (file) {
                files.delete(hash);
                PostMessage({ step: "end", folderJson, name: file.fileName });
            }
            break;
        }

        case "uploadError": {
            PostMessage({ step: "error", msg: "文件上传失败" });
            break;
        }
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
