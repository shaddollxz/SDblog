import fs from "fs-extra";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** 获得文件的唯一哈希值 */
export default function fileHash(path: string) {
    const stream = fs.createReadStream(path);
    const hash = crypto.createHash("md5");

    return new Promise((resolve, reject) => {
        stream.on("data", (data) => {
            hash.update(data);
        });
        stream.on("end", () => {
            resolve(hash.digest("hex"));
        });
        stream.on("error", (e) => reject(e));
    });
}
