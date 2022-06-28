import type { Plugin } from "vite";
import fs from "fs-extra";
import { resolve } from "path";

const dirs = ["headPic"];
export default (Env: ImportMetaEnv) =>
    staticPics(Env.PUBLIC_STATIC_PATH, dirs, {
        dts: resolve(__dirname, "../../src/typings/staticPics.d.ts"),
    });

// 插件实现👇

interface Option {
    dts: string;
}

function staticPics(staticPath: string, dirs: string[], options: Option): Plugin {
    const virtualModuleId = "virtual:staticPics";
    const resolvedVirtualModuleId = "\0" + virtualModuleId;

    let cache: Record<string, string[]>; // 因为文件夹内文件只会在更新时变化，只需要读取一次

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
                    cache = {};
                    for (const dirname of dirs) {
                        const path = resolve(staticPath, `./static/${dirname}`);
                        try {
                            cache[dirname] = (await fs.readdir(path)).map(
                                (filename) => `/assets/${dirname}/${filename}`
                            );
                        } catch {
                            cache[dirname] = [];
                        }
                    }
                }

                return "export default" + JSON.stringify(cache);
            }
        },

        async buildStart() {
            await fs.remove(options.dts);
            await fs.writeFile(options.dts, generateDTS(dirs));
        },
    };
}

function generateDTS(dirs: readonly string[]) {
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
