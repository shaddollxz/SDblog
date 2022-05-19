import { viteVConsole } from "vite-plugin-vconsole";
import { resolve } from "path";

export default function (Env: ImportMetaEnv, isBuild: boolean, isDev: boolean) {
    return viteVConsole({
        entry: resolve(__dirname, "../../src/main.ts"),
        enabled: isDev && Env.VITE_DEVMOBILE == "1",
        localEnabled: isDev && Env.VITE_DEVMOBILE == "1",
    });
}
