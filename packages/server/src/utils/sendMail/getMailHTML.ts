import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (transform: Record<string, string | number>) {
    let content = await fs.readFile(path.resolve(__dirname, "./mail.html"), "utf8");

    for (let key in transform) {
        content = content.replace(new RegExp(`(?<=\>\{)${key}(?=\}\<)`, "g"), transform[key]);
    }

    return content;
}
