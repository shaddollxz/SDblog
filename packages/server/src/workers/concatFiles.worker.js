import fs from "fs-extra";
import path from "path";
import { isMainThread, parentPort } from "worker_threads";
import { concatFiles } from "../utils/fileSlicer";
import { originalFilename } from "../utils/formateFilename";
import { fileHash } from "../utils/fileHash";

if (!isMainThread && parentPort) {
    parentPort.on("message", async (files) => {
        const filename = originalFilename(path.basename(files[0]));
        const target = path.resolve(process.env.PAN_PATH, filename);
        console.log("开始合并文件 " + filename);

        const { rejected } = await concatFiles(files, target, { parallelMax: 6 });
        if (rejected.length) {
            throw rejected;
        } else {
            const size = (await fs.stat(target)).size;
            const hash = await fileHash(target);
            parentPort.postMessage({ hash, size });
            console.log("合并文件结束 " + filename);
            for (const filepath of files) {
                await fs.remove(filepath);
            }
            console.log("临时文件清除完毕 " + filename);
        }
    });
}
