import multer from "multer";
import { resolve } from "path";

function formatFilename(filename: string) {
    const arr = filename.split(".");
    return `${arr.shift()}-T${Date.now()}.${arr.join(".")}`;
}
export function originalFilename(filename: string, isSuffix = true) {
    return isSuffix ? filename.replace(/-T\d+?\./, ".") : filename.replace(/-T\d+.*/, "");
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
