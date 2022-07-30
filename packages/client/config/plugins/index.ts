import { visualizer } from "rollup-plugin-visualizer";
import type { Plugin, PluginOption } from "vite";
import autoImport from "./autoImport";
import gzip from "./gzip";
import jsx from "./jsx";
import pwa from "./pwa";
import staticPics from "./staticPics";
import svgIcons from "./svgIcons";
import vconsole from "./vconsole";
import vue from "./vue";

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
            plugins.push(gzip);
        }
    }

    return plugins;
}
