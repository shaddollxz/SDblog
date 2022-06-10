import type { PluginOption } from "vite";
import vue from "./vue";
import pwa from "./pwa";
import autoImport from "./autoImport";
import svgIcons from "./svgIcons";
// import legacy from "./plugins/legacy";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import staticPics from "./staticPics";
import vconsole from "./vconsole";

export default function getPlugins(Env: ImportMetaEnv, isBuild: boolean, isDev: boolean) {
    const plugins: (PluginOption | PluginOption[])[] = [];

    //* 生产开发环境都需要配置的插件
    plugins.push(vue);
    plugins.push(svgIcons);
    plugins.push(pwa); // pwa
    plugins.push(autoImport);
    plugins.push(staticPics(Env));
    plugins.push(vconsole(Env, isBuild, isDev));
    // plugins.push(legacy);

    if (isDev) {
        //* 只在开发环境使用
        if (isBuild) {
            plugins.push(visualizer({ open: true, gzipSize: true, brotliSize: true })); // 依赖分析
        }
    } else {
        //* 只在生产环境使用
        if (isBuild) {
            plugins.push(viteCompression()); // gzip
        }
    }

    return plugins;
}
