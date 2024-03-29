import multer from "multer";
import { resolve } from "path";
import { assetsRealPath } from "../utils/assetsPath";

const imageEngin = multer.diskStorage({
    destination: resolve(assetsRealPath, "./image"),

    filename(req, file, cb) {
        cb(null, file.originalname);
    },
});

const avatarEngin = multer.diskStorage({
    destination: resolve(assetsRealPath, "./avatar"),

    filename(req, file, cb) {
        // 文件名从前端格式化为 hash+后缀 这里有问题
        // 剩下对文件完整性的验证在下一个中间件进行
        cb(null, file.originalname);
    },
});

export const imageUploader = multer({ storage: imageEngin }).single("image");
export const avatarUploader = multer({ storage: avatarEngin }).single("avatar");
