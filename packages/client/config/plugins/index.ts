import type { PluginOption, Plugin } from "vite";
import vue from "./vue";
import jsx from "./jsx";
import pwa from "./pwa";
import autoImport from "./autoImport";
import svgIcons from "./svgIcons";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import staticPics from "./staticPics";
import vconsole from "./vconsole";

export default function getPlugins(Env: ImportMetaEnv, isBuild: boolean, isDev: boolean) {
    const plugins: PluginOption[] = [];

    //* 生产开发环境都需要配置的插件
    plugins.push(vue);
    plugins.push(jsx);
    plugins.push(svgIcons);
    plugins.push(pwa); // pwa
    plugins.push(autoImport);
    plugins.push(staticPics(Env));

    if (isDev) {
        //* 只在开发环境使用
        plugins.push(vconsole(Env, isBuild, isDev) as Plugin);
        if (isBuild) {
            plugins.push(visualizer({ open: true, gzipSize: true, brotliSize: false })); // 依赖分析
        }
    } else {
        //* 只在生产环境使用
        if (isBuild) {
            plugins.push(viteCompression()); // gzip
        }
    }

    return plugins;
}
