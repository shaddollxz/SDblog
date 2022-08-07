import Fontmin from "fontmin";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 使用了星岩字体的字
const keyWords = [
    ":",
    "：",
    "退出登录",
    "id",
    "email",
    "评论",
    "目录",
    "标签",
    "时间轴",
    "首页",
    "留言",
    "施工中",
    "关于",
    "个人信息",
    "修改头像",
    "评论列表",
    "小工具",
    "卡手率计算器",
    "写博客",
    "网盘",
];

const targetDir = path.resolve(__dirname, "../../../packages/client/src/assets/font");

const chuyuan = new Fontmin()
    .src(path.resolve(__dirname, "./font/chuyuan.ttf"))
    .dest(targetDir)
    .use(Fontmin.ttf2woff2({ clone: false }));

const xingyan = new Fontmin()
    .src(path.resolve(__dirname, "./font/xingyan.ttf"))
    .dest(targetDir)
    .use(
        Fontmin.glyph({
            text: [...new Set(keyWords.join("").split(""))].join(""),
            hinting: false,
        })
    )
    .use(Fontmin.ttf2woff2({ clone: false }));

await fs.ensureDir(targetDir);
await fs.emptyDir(targetDir);

await fs.copy(path.resolve(__dirname, "./font/index.css"), path.resolve(targetDir, "./index.css"));

chuyuan.run((err, files) => {
    if (err) console.log(err);
});

xingyan.run((err, files) => {
    if (err) console.log(err);
});
