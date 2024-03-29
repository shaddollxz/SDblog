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

    readonly PUBLIC_WEBSITE: string;
    readonly PUBLIC_ADMIN_NAME: string;
    readonly PUBLIC_BEIAN: string;

    readonly PUBLIC_DIST_PATH: string;
    readonly PUBLIC_STATIC_PATH: string;
    readonly PUBLIC_STATIC_PREFIX: string;
    readonly PUBLIC_ASSETS_PATH: string;
    readonly PUBLIC_TEMP_DAY: NumberString;
    readonly PUBLIC_UPLOAD_CHUNKSIZE: NumberString;
}
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
