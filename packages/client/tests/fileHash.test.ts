import { getFileHash } from "../src/utils/getFileHash";
import { fileHash } from "@blog/server/src/utils/fileHash";
import { describe, it, expect } from "vitest";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const url = path.resolve(__dirname, "../../../logo/logo_ori.png");

describe("文件哈希值前后端获取结果对比", async () => {
    it("logo.png", async () => {
        const server = await fileHash(url);
        const client = getFileHash([await getFileArrayBuffer(url)]);

        expect(server).toBe(client);
    });
});

async function getFileArrayBuffer(src: string) {
    const fileBlob = new Blob([await fs.readFile(src)]);
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileBlob);
    return new Promise<ArrayBuffer>((resolve, reject) => {
        reader.addEventListener("load", async (e) => {
            const result = e.target!.result as ArrayBuffer;
            resolve(result);
        });
    });
}
