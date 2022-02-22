import type { Plugin } from "vite";
import fs from "fs-extra";
import path from "path";

function headPics(path: fs.PathLike): Plugin {
    const virtualModuleId = "virtual:headPics";
    const resolvedVirtualModuleId = "\0" + virtualModuleId;

    let cache: string[]; // 因为文件夹内文件不会动态变化，只需要读取一次

    return {
        name: "headPics",

        resolveId(id) {
            if (id == virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },

        async load(id) {
            if (id == resolvedVirtualModuleId) {
                if (!cache) {
                    cache = await fs.readdir(path);
                }
                return "export default " + JSON.stringify(cache);
            }
        },
    };
}

export default headPics(path.resolve(__dirname, "../../../server/static/headPic"));
