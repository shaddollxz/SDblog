import type { BuildOptions } from "vite";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (Env: ImportMetaEnv, isBuild: boolean, isDev: boolean): BuildOptions {
    const publicPath = Env.PUBLIC_PATH ?? path.resolve(__dirname, "../../../public");
    return {
        outDir: publicPath, // 打包输出路径
        target: "modules", // 打包文件支持的es语法 这里指支持<script type="module">标签的浏览器 具体见https://vitejs.cn/config/#build-target
        emptyOutDir: true, // 打包目录在项目外面 打包时删除所有文件
        assetsInlineLimit: 1024 * 6, // 内联资源的最大大小
        rollupOptions: {
            external: [],
        },
    };
}
