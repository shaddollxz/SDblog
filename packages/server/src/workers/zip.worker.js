import path from "path";
import { zipFilesAndFolders } from "../utils/zip";
import { isMainThread, parentPort } from "worker_threads";

if (!isMainThread && parentPort) {
    parentPort.on("message", async (data) => {
        const { hash } = await zipFilesAndFolders(data);
        parentPort.postMessage({ hash });
    });
}
