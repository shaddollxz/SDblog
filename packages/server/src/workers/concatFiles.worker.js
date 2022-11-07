import fs from "fs-extra";
import path from "path";
import { isMainThread, parentPort } from "worker_threads";
import { concatFiles } from "../utils/fileSlicer";
import { originalFilename } from "../utils/formateFilename";
import { fileHash } from "../utils/fileHash";
import { parallelPool } from "../utils/parallelPromise";
import { panFileRealPath } from "../utils/assetsPath";

if (!isMainThread && parentPort) {
    parentPort.on("message", async ({ files, hash }) => {
        const filename = originalFilename(path.basename(files[0]));
        const target = path.resolve(panFileRealPath, filename);
        console.log("开始合并文件 " + filename);
        const key = await concatFiles(files, target, { parallelMax: 6 });

        parallelPool.onFinish(key, async ({ rejected }) => {
            if (rejected.length) {
                throw rejected;
            } else {
                const size = (await fs.stat(target)).size;
                const resultHash = await fileHash(target);
                parentPort.postMessage({ hash: resultHash, size, oriHash: hash });
                console.log("合并文件结束 " + filename);
                for (const filepath of files) {
                    await fs.remove(filepath);
                }
                console.log("临时文件清除完毕 " + filename);
                // 如果文件和前端解析的哈希值不同 说明传输时损坏 删了他
                if (resultHash != hash) {
                    await fs.remove(target);
                }
            }
        });
    });
}
