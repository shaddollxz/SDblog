import type { PluginOption } from "vite";
import vue from "./vue";
import pwa from "./pwa";
import autoImport from "./autoImport";
import svgIcons from "./svgIcons";
// import legacy from "./plugins/legacy";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

export default function getPlugins(Env: ImportMetaEnv, isBuild: boolean) {
    const plugins: (PluginOption | PluginOption[])[] = [];
    plugins.push(vue);
    plugins.push(svgIcons);
    plugins.push(pwa); // pwa
    plugins.push(autoImport);
    // plugins.push(legacy);

    if (Env.VITE_INTEST == "true") {
        if (isBuild) {
            plugins.push(visualizer({ open: true, gzipSize: true, brotliSize: true })); // 依赖分析
        }
    } else {
        plugins.push(viteCompression()); // gzip
    }

    return plugins;
}
