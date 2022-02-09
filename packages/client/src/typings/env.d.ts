/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

//todo 配置环境变量
interface ImportMetaEnv {
    readonly VITE_INTEST?: "true" | "false";
    readonly VITE_LOCAL?: "true" | "false";
}
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
