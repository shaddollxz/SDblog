import { createFormData } from "@/utils/createFormData";
import { parallelPromise, ParallelPool } from "@/utils/parallelPromise";
import { isUploadEndApi, uploadPanFileChunkApi, uploadPanFileEndApi, uploadPanFileStartApi } from "@apis";
import type { UploadFileChunkOption, UploadFileEndOption } from "@blog/server";
import Worker from "./sliceFileAndUpload.worker.ts?worker";
import type { MainOnMessage, MainPostMessage } from "./types";

export type { MainOnMessage, MainPostMessage };
export const uploadWorker = new Worker();
export const PostMessage = (data: MainPostMessage, transfer?: Transferable[]) =>
    transfer ? uploadWorker.postMessage(data, transfer) : uploadWorker.postMessage(data);

uploadWorker.addEventListener("message", async ({ data }: { data: MainOnMessage }) => {
    switch (data.step) {
        case "uploadStart":
            {
                const { data: res } = await uploadPanFileStartApi({
                    name: data.fileName,
                    hash: data.hash,
                    folderId: data.folderId,
                    chunks: data.chunks,
                });
                if (res.folderJson) {
                    PostMessage({ step: "uploadEnd", folderJson: res.folderJson, hash: data.hash });
                } else if (res.needChunk) {
                    PostMessage({ step: "uploadChunks", hash: data.hash, needChunks: res.needChunk });
                }
            }
            break;

        case "uploadChunk":
            {
                const { buffers, fileName, folderId, hash } = data;
                try {
                    await uploadChunk({ hash, buffers });
                } catch (notUploaded) {
                    PostMessage({ step: "uploadError", notUploaded: notUploaded as number[] });
                    return;
                }

                const folderJson = await uploadFileEnd({ hash, folderId, name: fileName });
                PostMessage({ step: "uploadEnd", folderJson, hash });

                console.log("上传结束");
            }
            break;
    }
});

async function uploadChunk(
    { hash, buffers }: Omit<UploadFileChunkOption, "file" | "index"> & { buffers: (ArrayBuffer | null)[] },
    resendCount = 0
) {
    // count用来记录重新上传的次数 超过三次就不再重传了
    if (resendCount >= 3) {
        const result: number[] = [];
        buffers.forEach((buffer, index) => buffer && result.push(index));
        (buffers as unknown as null) = null;
        return result;
    }

    const tasks = buffers.map((buffer, index) => {
        if (buffer) {
            const file = new File([buffer], "1"); // 文件必须有个非空的名字 否则后端收不到
            return {
                func: (arg: FormDataT<UploadFileChunkOption>) =>
                    uploadPanFileChunkApi(arg)
                        .then(() => {
                            PostMessage({ step: "uploadOneChunkEnd", hash });
                            buffers[index] = null;
                            return index;
                        })
                        .catch(() => Promise.reject(index)),
                args: [createFormData({ hash, index, file })],
            };
        } else {
            return {
                func: () => Promise.resolve(-1),
                args: [],
            };
        }
    });

    const { rejected } = await parallelPromise(tasks);
    if (rejected.length) {
        return await uploadChunk(
            {
                hash,
                buffers: buffers.map((buffer, index) => (rejected.includes(index) ? buffer : null)),
            },
            resendCount++
        );
    }
}

async function uploadFileEnd(data: UploadFileEndOption): Promise<string> {
    await uploadPanFileEndApi(data);

    return new Promise((resolve) => {
        const interval = window.setInterval(async () => {
            const { data: _data } = await isUploadEndApi({ hash: data.hash });
            if (_data.folderJson) {
                window.clearInterval(interval);
                resolve(_data.folderJson);
            }
        }, 1500);
    });
}
