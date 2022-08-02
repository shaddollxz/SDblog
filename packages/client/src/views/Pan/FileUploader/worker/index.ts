import Worker from "./sliceFileAndUpload.worker.ts?worker";
import type { MainOnMessage, MainPostMessage } from "./types";
export type { MainOnMessage, MainPostMessage };

export const uploadWorker = new Worker();

import { createFormData } from "@/utils/createFormData";
import { parallelPromise } from "@/utils/parallelPromise";
import { uploadPanFileChunkApi, uploadPanFileEndApi, uploadPanFileStartApi, isUploadEndApi } from "@apis";
import type { UploadFileChunkOption, UploadFileEndOption, PanListRes } from "@blog/server";

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
    count = 0
) {
    if (count >= 3) {
        const result: number[] = [];
        buffers.forEach((buffer, index) => buffer && result.push(index));
        return result;
    }

    const { rejected } = await parallelPromise(
        buffers.map((buffer, index) => {
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
        })
    );
    if (rejected.length) {
        return await uploadChunk(
            {
                hash,
                buffers: buffers.map((buffer, index) => (rejected.includes(index) ? buffer : null)),
            },
            count++
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
