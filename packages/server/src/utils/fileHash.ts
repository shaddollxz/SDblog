import crypto from "crypto";
import fs from "fs-extra";

/** 获得文件的唯一哈希值 */
export function fileHash(path: string) {
    const stream = fs.createReadStream(path);
    const hash = crypto.createHash("md5");

    return new Promise<string>((resolve, reject) => {
        stream.on("data", (data) => {
            hash.update(data);
        });
        stream.on("end", () => {
            resolve(hash.digest("hex"));
        });
        stream.on("error", (e) => reject(e));
    });
}
