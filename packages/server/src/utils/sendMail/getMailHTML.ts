import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import inlineCss from "inline-css";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type MailType = "verifycode";

export async function getMailHTML(type: MailType, transform: { randomCode: string; endTime: string }) {
    let content = await fs.readFile(path.resolve(__dirname, `./mails/${type}.html`), "utf8");
    for (let key in transform) {
        content = content.replaceAll(new RegExp(`<data>{${key}}<\/data>`, "g"), transform[key]);
    }
    content = await inlineCss(content, {
        url: path.resolve(__dirname, "./mails"),
        removeHtmlSelectors: true,
    });
    return content;
}
