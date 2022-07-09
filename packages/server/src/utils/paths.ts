import { resolve } from "path";

export const distPath = resolve(process.env.PUBLIC_DIST_PATH, "./dist");
export const staticPath = resolve(process.env.PUBLIC_STATIC_PATH, "./static");
export const panPath = process.env.PUBLIC_PAN_PATH;
