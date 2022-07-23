import path from "path";
import { isMainThread, parentPort } from "worker_threads";
import { concatFiles } from "../utils/fileSlicer";
import { filenameMsg, originalFilename } from "../utils/formateFilename";

if (!isMainThread && parentPort) {
    parentPort.on("message", async (_files) => {
        const files = _files.sort((a, b) => {
            const fileIndexa = +filenameMsg(path.basename(a)).chunkIndex;
            const fileIndexb = +filenameMsg(path.basename(b)).chunkIndex;
            return fileIndexa - fileIndexb;
        });

        const target = path.resolve(process.env.PAN_PATH, originalFilename(_files[0]));
        const { rejected } = await concatFiles(files, target, { parallelMax: 6 });
        if (rejected) {
            throw rejected;
        } else {
            parentPort.postMessage(target);
            process.exit();
        }
    });
}
