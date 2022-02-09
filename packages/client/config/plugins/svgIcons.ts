import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

export default createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(__dirname, "../../src/assets/svg")],
    // 指定symbolId格式
    symbolId: "icon-[dir]-[name]",
});
