import { extname, join, dirname } from "path";
import fs from "fs-extra";

export default async function formatMadia(file) {
    // 上传之后文件的名称
    const filename = file.filename + extname(file.originalname);
    // 重命名
    await fs.rename(file.path, join(dirname(file.path), filename));
    // 将重命名后的名字返回
    return filename;
}
