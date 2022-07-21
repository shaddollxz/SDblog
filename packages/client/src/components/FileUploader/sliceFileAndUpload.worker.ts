import SparkMD5 from "spark-md5";
import type { MainOnMessage, MainPostMessage } from "./types";
import { uploadPanFileStartApi, uploadPanFileChunkApi, uploadPanFileApi, uploadPanFileEndApi } from "@apis";
import { parallelPromise } from "@/utils/parallelPromise";
import type { UploadFileChunkOption, UploadFileStartRes } from "@blog/server";

const PostMessage = (arg: MainOnMessage) => postMessage(arg);
const CHUNKSIZE = +import.meta.env.PUBLIC_UPLOAD_CHUNKSIZE;

onmessage = async ({ data: { files, folderId, name, isSendProgress } }: { data: MainPostMessage }) => {
    for (let i = 0; i < files.files.length; i++) {
        const file = files.files[i];
        const result = await hasFile(files, i, folderId, name);
        let folderJson: string;
        if (typeof result != "string") {
            //* 没有储存过上传的文件 上传
            if (file.size < CHUNKSIZE) {
                // 小文件直接上传
                const form = new FormData();
                form.append("file", file);
                folderJson = (await uploadPanFileApi(form)).data.folderJson;
            } else {
                // 大文件切片上传
                const { buffers, hash, needChunk } = result;
                const { rejected } = await parallelPromise(
                    needChunk.map((chunkIndex) => ({
                        func: async (data: UploadFileChunkOption) =>
                            await uploadPanFileChunkApi(data).catch(() => {
                                throw chunkIndex;
                            }),
                        args: [
                            { index: chunkIndex, all: buffers.length, hash: result.hash, name: file.name },
                        ],
                    }))
                );
                if (rejected.length) {
                    //todo 有上传失败的切片 重新上传
                }
                folderJson = (await uploadPanFileEndApi({ name, hash, folderId })).data.folderJson;
            }
        } else {
            //* 有储存上传的文件 直接更新页面
            folderJson = result;
        }
        // todo 通过folderJson更新panStore的状态
        PostMessage({ finishOrder: i, folderJson, finish: true } as MainOnMessage);
    }
};

function getFileHash(buffers: ArrayBuffer[]) {
    const spark = new SparkMD5.ArrayBuffer();
    for (const buffer of buffers) {
        spark.append(buffer);
    }
    return spark.end();
}

async function hasFile(file: MainPostMessage["files"], order: number, folderId: string, name: string) {
    const buffer = (await file.read(order, { chunkSize: CHUNKSIZE })) as ArrayBuffer[] | ArrayBuffer;
    let hash: string;
    let data: Awaited<UploadFileStartRes>;
    let buffers: ArrayBuffer[];
    if (Array.isArray(buffer)) {
        hash = getFileHash(buffer as ArrayBuffer[]);
        data = (await uploadPanFileStartApi({ hash, chunks: buffer.length, name, folderId })).data;
        buffers = buffer;
    } else {
        hash = getFileHash([buffer] as ArrayBuffer[]);
        data = (await uploadPanFileStartApi({ hash, chunks: 1, name, folderId })).data;
        buffers = [buffer];
    }

    if (data.folderJson) {
        return data.folderJson;
    } else {
        return { needChunk: data.needChunk!, buffers, hash };
    }
}
