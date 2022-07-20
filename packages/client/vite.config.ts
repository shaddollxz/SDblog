import { defineConfig, loadEnv } from "vite";
import type { ConfigEnv } from "vite";
import { resolve } from "path";
import getPlugins from "./config/plugins";
import getServer from "./config/server";
import getBuild from "./config/build";
import getCss from "./config/css";

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv) => {
    const envPrefix = ["VITE_", "PUBLIC_"];
    const Env = loadEnv(mode, resolve(__dirname, "../../env"), envPrefix) as ImportMetaEnv;
    const isBuild = command == "build";
    const isDev = mode == "development";

    return defineConfig({
        envPrefix, // 前缀为指定的变量才会加载进env
        envDir: resolve(__dirname, "../../env"), // 环境变量文件夹位置
        plugins: getPlugins(Env, isBuild, isDev),
        build: getBuild(Env, isBuild, isDev),
        server: getServer(Env, isBuild, isDev),
        css: getCss(Env, isBuild, isDev),
        resolve: {
            alias: {
                "@": "/src",
                "@img": "/src/assets/img",
                "@apis": "/src/apis",
                "@views": "/src/views",
                "#": "/src/typings",
            },
        },
    });
};
