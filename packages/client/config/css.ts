import type { CssOptions } from "vite";

export default function (Env: ImportMetaEnv, isBuild: boolean, isDev: boolean): CssOptions {
    return {
        preprocessorOptions: {
            scss: {
                // 设置sass全局变量
                additionalData: "@use '@/style/vars/var' as *; @use '@/style/vars/mixin' as *;",
            },
        },
        // 解决sass "@charset" 报错
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
    };
}
