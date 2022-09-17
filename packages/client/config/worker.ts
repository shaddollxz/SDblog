import type { ResolveWorkerOptions } from "vite";

export default function (Env: ImportMetaEnv, isBuild: boolean, isDev: boolean): ResolveWorkerOptions {
    return {
        format: "iife",
        plugins: [], // vite.config.ts中的插件不会配置到worker中 在这里配置worker用的插件
        rollupOptions: {
            output: {
                chunkFileNames: "assets/[hash].js",
            },
        },
    };
}
