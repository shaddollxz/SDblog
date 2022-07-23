import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concatFilesWorker = new Worker(path.resolve(__dirname, "./concatFiles.worker.js"));
export function useConcatFilesWorker(files: string[]) {
    return new Promise<string>((resolve, reject) => {
        concatFilesWorker.postMessage(files);
        concatFilesWorker.once("error", (e) => {
            reject(e);
        });
        concatFilesWorker.once("message", (path: string) => {
            resolve(path);
        });
    });
}
