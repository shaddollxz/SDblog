import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import inlineCss from "inline-css";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { PUBLIC_WEBSITE, PUBLIC_ADMIN_NAME } = process.env;

export type MailType = "verifycode";

const defaultMelData = {
    website: PUBLIC_WEBSITE,
    thisYear: new Date().getFullYear(),
    adminName: PUBLIC_ADMIN_NAME,
};

export async function getMailHTML(type: MailType, transform: { randomCode: string; endTime: string }) {
    const mailData = {
        ...transform,
        ...defaultMelData,
    };

    let content = await fs.readFile(path.resolve(__dirname, `./mails/${type}.html`), "utf8");
    for (let key in mailData) {
        content = content.replaceAll(new RegExp(`<data>{${key}}<\/data>`, "g"), transform[key]);
    }
    content = await inlineCss(content, {
        url: path.resolve(__dirname, "./mails"),
        removeHtmlSelectors: true,
    });
    return content;
}
