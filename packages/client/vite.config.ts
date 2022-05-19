import { defineConfig, loadEnv } from "vite";
import type { ConfigEnv } from "vite";
import path from "path";
import getPlugins from "./config/plugins";
import getServer from "./config/server";
import getBuild from "./config/build";

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv) => {
    const Env = loadEnv(mode, path.resolve("./env")) as ImportMetaEnv;
    const isBuild = command == "build";
    const isDev = mode == "development";

    return defineConfig({
        plugins: getPlugins(Env, isBuild, isDev),
        server: getServer(Env, isBuild, isDev),
        envDir: path.resolve("./env"), // 环境变量文件夹位置
        build: getBuild(),
        resolve: {
            alias: {
                "@": "/src",
                "@img": "/src/assets/img",
                "@apis": "/src/apis",
                "@views": "/src/views",
                "#": "/src/typings",
            },
        },
        // 解决sass "@charset" 报错
        css: {
            preprocessorOptions: {
                scss: {
                    // 设置sass全局变量
                    additionalData: "@use '@/style/vars/var' as *; @use '@/style/vars/mixin' as *;",
                },
            },
            postcss: {
                plugins: [
                    {
                        postcssPlugin: "internal:charset-removal",
                        AtRule: {
                            charset: (atRule) => {
                                if (atRule.name === "charset") {
                                    atRule.remove();
                                }
                            },
                        },
                    },
                ],
            },
        },
    });
};
