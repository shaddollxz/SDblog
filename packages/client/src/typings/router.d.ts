import type { RouteRecordRaw } from "vue-router";

interface Meta {
    title: string;
    needLogin?: boolean;
    needAdmin?: boolean;
    keepAlive?: boolean;
}

declare global {
    export interface RouteItem extends Omit<RouteRecordRaw, "children" | "meta"> {
        children?: RouteItem[];
        meta: Meta;
    }
}

declare module "vue-router" {
    export interface RouteMeta extends Meta {}
}
