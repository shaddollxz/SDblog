import Worker from "./sliceFileAndUpload.worker.ts?worker";
export * from "./types";

export const uploadWorker = new Worker();
