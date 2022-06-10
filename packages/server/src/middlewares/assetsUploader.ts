import multer from "multer";
import { resolve } from "path";

function formatFilename(filename: string) {
    const arr = filename.split(".");
    return `${arr.shift()}-${Date.now()}.${arr.join(".")}`;
}

const imageEngin = multer.diskStorage({
    destination: resolve(process.env.PUBLIC_STATIC_PATH, "./image"),

    filename(req, file, cb) {
        cb(null, formatFilename(file.originalname));
    },
});

const avatarEngin = multer.diskStorage({
    destination: resolve(process.env.PUBLIC_STATIC_PATH, "./avatar"),

    filename(req, file, cb) {
        cb(null, formatFilename(file.originalname));
    },
});

export const imageUploader = multer({ storage: imageEngin }).single("image");
export const avatarUploader = multer({ storage: avatarEngin }).single("avatar");
