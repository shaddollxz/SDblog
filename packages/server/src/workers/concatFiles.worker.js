import path from "path";
import { isMainThread, parentPort } from "worker_threads";
import { concatFiles } from "../utils/fileSlicer";
import { filenameMsg, originalFilename } from "../utils/formateFilename";
import fs from "fs-extra";

if (!isMainThread && parentPort) {
    parentPort.on("message", async (_files) => {
        /** @type string[] */
        const files = _files.sort((a, b) => {
            const fileIndexa = +filenameMsg(path.basename(a)).chunkIndex;
            const fileIndexb = +filenameMsg(path.basename(b)).chunkIndex;
            return fileIndexa - fileIndexb;
        });

        const hash = originalFilename(path.basename(_files[0]));
        const target = path.resolve(process.env.PAN_PATH, hash);
        console.log("开始合并文件 " + hash);

        const { rejected } = await concatFiles(files, target, { parallelMax: 6 });
        if (rejected.length) {
            throw rejected;
        } else {
            parentPort.postMessage(target);
            console.log("合并文件结束 " + hash);
            for (const filepath of files) {
                await fs.remove(filepath);
            }
            console.log("临时文件清除完毕 " + hash);
        }
    });
}
