import type { Plugin } from "vite";
import fs from "fs-extra";
import { resolve } from "path";

const dirs: Dirs = ["headPic", { importName: "noahEmoji", realDir: "emojis/noah" }];
export default (Env: ImportMetaEnv) =>
    staticPics(Env.PUBLIC_STATIC_PATH + Env.PUBLIC_ASSETS_PATH, dirs, {
        dts: resolve(__dirname, "../../src/typings/global/staticPics.d.ts"),
        staticPrefix: Env.PUBLIC_STATIC_PREFIX + Env.PUBLIC_ASSETS_PATH,
    });

// 插件实现👇

type Dirs = (string | { importName: string; realDir: string })[];
interface Option {
    dts: string;
    staticPrefix: string;
}

function staticPics(staticPath: string, dirs: Dirs, options: Option): Plugin {
    const virtualModuleId = "virtual:staticPics";
    const resolvedVirtualModuleId = "\0" + virtualModuleId;

    let cache: Record<string, string[]>; // 因为文件夹内文件只会在更新时变化，只需要读取一次
    const importNames = dirs.map((item) => (typeof item == "string" ? item : item.importName));
    const realDirs = dirs.map((item) => (typeof item == "string" ? item : item.realDir));

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
                    for (let i = 0; i < realDirs.length; i++) {
                        const path = resolve(staticPath, realDirs[i]);
                        const importName = importNames[i];
                        try {
                            cache[importName] = (await fs.readdir(path)).map(
                                (filename) => `${options.staticPrefix}/${realDirs[i]}/${filename}`
                            );
                        } catch {
                            cache[importName] = [];
                        }
                    }
                }

                return "export default" + JSON.stringify(cache);
            }
        },

        async buildStart() {
            await fs.remove(options.dts);
            await fs.writeFile(options.dts, generateDTS(importNames));
        },
    };
}

function generateDTS(importNames: string[]) {
    return `// 由staticPics插件生成
declare module "virtual:staticPics" {
    const staticPics: {
        ${importNames
            .map((name, index) => name + ": string[];" + (index == dirs.length - 1 ? "" : "\n        "))
            .join("")}
    };
    export default staticPics;
}
`;
}
