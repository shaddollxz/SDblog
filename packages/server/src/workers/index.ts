import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
import type { Folder, PanPath } from "../typings/interface/pan";
import { filenameMsg } from "../utils/formateFilename";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_PATH = process.env.TEMP_PATH;

const concatFilesWorker = new Worker(path.resolve(__dirname, "./concatFiles.worker.js"));
export function useConcatTempFilesWorker(filenames: string[], hash: string) {
    return new Promise<{ hash: string; size: number }>((resolve, reject) => {
        const paths = filenames
            .map((name) => path.resolve(TEMP_PATH, name))
            .sort((a, b) => {
                const fileIndexa = +filenameMsg<TempChunkFileMsg>(path.basename(a)).chunkIndex;
                const fileIndexb = +filenameMsg<TempChunkFileMsg>(path.basename(b)).chunkIndex;
                return fileIndexa - fileIndexb;
            });
        concatFilesWorker.postMessage({ files: paths, hash });
        concatFilesWorker.on("error", (e) => {
            reject(e);
        });
        concatFilesWorker.on("message", (data: { hash: string; size: number; oriHash: string }) => {
            if (data.oriHash == hash) {
                resolve({ hash: data.hash, size: data.size });
            }
        });
    });
}

interface ZipOptions {
    files?: { hash: string; name: string }[];
    folder?: Folder;
    folderPaths?: PanPath[];
}
const zipWorker = new Worker(path.resolve(__dirname, "./zip.worker.js"));
export function useZipWorker(options: ZipOptions) {
    return new Promise<{ hash: string }>((resolve, reject) => {
        zipWorker.postMessage(options);
        zipWorker.once("error", (e) => {
            reject(e);
        });
        zipWorker.once("message", (data: { hash: string }) => {
            resolve(data);
        });
    });
}
