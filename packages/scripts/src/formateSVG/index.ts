import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//! 需要保持为彩色的svg的文件夹名或文件名 文件名加上后缀
const colorful = ["about"];

const targetDir = path.resolve(__dirname, "../../../client/src/assets/svg");

// #region 具体内容
async function readFile(filepath: string, isColorful = false) {
    try {
        const content = await fs.readFile(filepath, "utf-8");
        const afterFormate = formate(content, isColorful);
        await fs.writeFile(filepath, afterFormate);
    } catch (e) {
        // 进入这里说明它是文件夹
        const files = await fs.readdir(filepath);
        for (const file of files) {
            await readFile(path.resolve(filepath, file), isColorful || colorful.includes(file));
        }
    }
}

const regexp_darkreader_style = /\s(\S*)?darkreader[^=]*?\"/g;
const regexp_darkreader_out = /\s\S*?darkreader\S*?=\".*?\"/g;
const regexp_attr_class = /\sclass=\".*?\"/g;
const regexp_attr_fill = /\sfill=\".*?\"/g;
const regexp_attr_style = /\sstyle=\".*?\"/g;
const regexp_tag_style = /\<style\stype=\"text\/css\"><\/style>/g;
function formate(input: string, isColorful = false): string {
    const output = input
        .replace(regexp_darkreader_out, "")
        .replace(regexp_darkreader_style, "")
        .replace(regexp_tag_style, "")
        .replace(regexp_attr_class, "");

    return isColorful ? output : output.replace(regexp_attr_fill, "").replace(regexp_attr_style, "");
}
// #endregion

const svgs = await fs.readdir(targetDir);
for (const svg of svgs) {
    await readFile(path.resolve(targetDir, svg), colorful.includes(svg));
}
