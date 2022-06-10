/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

//todo 配置环境变量
interface ImportMetaEnv {
    readonly VITE_PROXY_LOCAL: "0" | "1";
    readonly VITE_DEVMOBILE: "0" | "1";

    readonly PUBLIC_DIST_PATH: string;
    readonly PUBLIC_STATIC_PATH: string;
}
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
