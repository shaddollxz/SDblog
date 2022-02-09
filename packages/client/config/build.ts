import path from "path";
import type { BuildOptions } from "vite";

const outDir = path.join(__dirname, "../../server/public"); // 打包输出路径

export default function (): BuildOptions {
    return {
        outDir, // 打包输出路径
        target: "modules", // 打包文件支持的es语法 这里指支持<script type="module">标签的浏览器 具体见https://vitejs.cn/config/#build-target
        emptyOutDir: true, // 打包目录在项目外面 打包时删除所有文件
        assetsInlineLimit: 1024 * 6, // 内联资源的最大大小
        // rollupOptions: {
        //     external: ["virtual:pwa-register"],
        // },
    };
}
