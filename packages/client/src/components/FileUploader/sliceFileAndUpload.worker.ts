import SparkMD5 from "spark-md5";
import type { MainOnMessage, MainPostMessage } from "./types";
import { uploadPanFileStartApi, uploadPanFileChunkApi, uploadPanFileApi, uploadPanFileEndApi } from "@apis";
import { parallelPromise } from "@/utils/parallelPromise";

const PostMessage = (arg: MainOnMessage) => postMessage(arg);
const CHUNKSIZE = 1024 ** 2 * 5; // 5MB

onmessage = async ({ data: { files, isSendProgress, path, name } }: { data: MainPostMessage }) => {
    for (let i = 0; i < files.files.length; i++) {
        const file = files.files[i];

        const result = await hasFile(files, i, path, name);
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
                const buffers = result.buffers,
                    needChunk = result.needChunk;
                await parallelPromise(
                    needChunk.map((chunkIndex) => ({
                        func: uploadPanFileChunkApi,
                        args: [{ index: chunkIndex, all: buffers.length, hash: result.hash }],
                    }))
                );
                folderJson = (await uploadPanFileEndApi({ path, name })).data.folderJson;
            }
        } else {
            //* 有储存上传的文件 直接更新页面
            folderJson = result;
        }
        // todo 通过folderJson更新panStore的状态
        PostMessage({ finishOrder: i });
    }
};

function getFileHash(buffers: ArrayBuffer[]) {
    const spark = new SparkMD5.ArrayBuffer();
    for (const buffer of buffers) {
        spark.append(buffer);
    }
    return spark.end();
}

async function hasFile(
    file: MainPostMessage["files"],
    order: number,
    path: MainPostMessage["path"],
    name: string
) {
    const buffer = (await file.read({
        readAs: "readAsArrayBuffer",
        order,
        chunkSize: CHUNKSIZE,
    })) as ArrayBuffer[] | ArrayBuffer;
    let hash: string;
    let data: Awaited<ReturnType<typeof uploadPanFileStartApi>>["data"];
    let buffers: ArrayBuffer[];
    if (Array.isArray(buffer)) {
        hash = getFileHash(buffer as ArrayBuffer[]);
        data = (await uploadPanFileStartApi({ hash, path, chunks: buffer.length, name })).data;
        buffers = buffer;
    } else {
        hash = getFileHash([buffer] as ArrayBuffer[]);
        data = (await uploadPanFileStartApi({ hash, path, chunks: 1, name })).data;
        buffers = [buffer];
    }

    if (data.folderJson) {
        return data.folderJson;
    } else {
        return { needChunk: data.needChunk!, buffers, hash };
    }
}
