import type { ServerOptions } from "vite";
import os from "os";

let host = "localhost"; // 默认值
try {
    const ifaces = os.networkInterfaces()!;
    for (let dev in ifaces) {
        ifaces[dev]!.forEach((details, _alias) => {
            // 寻找IPv4协议族，并且地址不是本地地址或者回环地址的地址即可。
            if (details.family === "IPv4" && details.address !== "127.0.0.1" && !details.internal) {
                host = details.address;
            }
        });
    }
} catch {
    host = "localhost";
}

export default function (Env: ImportMetaEnv, isBuild: boolean, isDev: boolean): ServerOptions {
    let proxySetting: { target: string; rewriteto: string };

    if (Env.VITE_PROXY_LOCAL == "1") {
        proxySetting = { target: "http://localhost:3000", rewriteto: "" };
    } else {
        proxySetting = { target: Env.PUBLIC_WEBSITE, rewriteto: "/api" }; // 配置代理
    }

    return {
        open: false, // dev时是否自动打开浏览器
        host,
        port: 8000, // 开发服务器的端口
        proxy: {
            "/api": {
                target: proxySetting.target,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, proxySetting.rewriteto),
            },
        },
    };
}
