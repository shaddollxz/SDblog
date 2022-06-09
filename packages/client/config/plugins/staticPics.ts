import type { Plugin } from "vite";
import fs from "fs-extra";
import { resolve } from "path";
import { staticPath } from "@blog/scripts";

interface Option {
    dts: string;
}

function staticPics<T extends string>(dirs: readonly T[], options: Option): Plugin {
    const virtualModuleId = "virtual:staticPics";
    const resolvedVirtualModuleId = "\0" + virtualModuleId;

    let cache: Record<T, string[]>; // 因为文件夹内文件只会在更新时变化，只需要读取一次

    return {
        name: "staticPics",

        resolveId(id) {
            if (id == virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },

        async load(id) {
            if (id == resolvedVirtualModuleId) {
                if (!cache) {
                    // @ts-ignore
                    cache = {};
                    for (const dirname of dirs) {
                        cache[dirname] = (await fs.readdir(resolve(staticPath, `./${dirname}`))).map(
                            (filename) => `/assets/${dirname}/${filename}`
                        );
                    }
                }

                return "export default" + JSON.stringify(cache);
            }
        },

        async buildStart() {
            await fs.remove(options.dts);
            await fs.writeFile(options.dts, dts(dirs));
        },
    };
}

function dts(dirs: readonly string[]) {
    return `// 由staticPics插件生成
declare module "virtual:staticPics" {
    const staticPics: {
        ${dirs
            .map((name, index) => name + ":string[];" + (index == dirs.length - 1 ? "" : "\r        "))
            .join("")}
    };
    export default staticPics;
}
`;
}

const dirs = ["headPic"];
export default staticPics(dirs, { dts: resolve(__dirname, "../../src/typings/staticPics.d.ts") });
