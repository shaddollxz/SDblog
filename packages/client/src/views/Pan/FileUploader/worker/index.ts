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

const parallelPool = new ParallelPool({ max: 4, parallelTaskCount: 2 });

uploadWorker.addEventListener("message", async ({ data }: { data: MainOnMessage }) => {
    switch (data.step) {
        case "uploadStart": {
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
            break;
        }

        case "uploadChunk": {
            const { buffers, fileName, folderId, hash } = data;
            parallelPool.onFinish(hash, async ({ rejected }) => {
                if (rejected.length) {
                    return PostMessage({ step: "uploadError", notUploaded: rejected });
                }
                PostMessage({ step: "waitUploadEnd", name: fileName });
                await uploadPanFileEndApi({ hash, folderId, name: fileName });
                const folderJson = await isConcatFileEnd(hash);
                PostMessage({ step: "uploadEnd", folderJson, hash });
            });
            uploadChunk({ hash, buffers });
            break;
        }
    }
});

function uploadChunk({
    hash,
    buffers,
}: Omit<UploadFileChunkOption, "file" | "index"> & { buffers: (ArrayBuffer | null)[] }) {
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

    parallelPool.push(hash, tasks);
    parallelPool.end(hash);
}

async function isConcatFileEnd(hash: string) {
    return new Promise<string>((resolve) => {
        const interval = window.setInterval(async () => {
            try {
                const {
                    data: { folderJson },
                } = await isUploadEndApi({ hash: hash });
                if (folderJson) {
                    window.clearInterval(interval);
                    resolve(folderJson);
                }
            } catch {
                window.clearInterval(interval);
            }
        }, 1500);
    });
}
