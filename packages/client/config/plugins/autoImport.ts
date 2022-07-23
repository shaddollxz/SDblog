import autoImport from "unplugin-auto-import/vite";
import path from "path";

export default autoImport({
    imports: ["vue", "vue-router"],
    // 保证ts不报错会生成一个全局类型声明 这里自定义它的位置
    dts: path.resolve(__dirname, "../../src/typings/global/autoImport.d.ts"),
});
