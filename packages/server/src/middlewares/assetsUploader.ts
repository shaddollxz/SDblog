import multer from "multer";
import { resolve } from "path";
import { staticPath } from "../utils/paths";

function formatFilename(filename: string) {
    const arr = filename.split(".");
    return `${arr.shift()}-T${Date.now()}.${arr.join(".")}`;
}
export function originalFilename(filename: string, isSuffix = true) {
    return isSuffix ? filename.replace(/-T\d+?\./, ".") : filename.replace(/-T\d+.*/, "");
}

const imageEngin = multer.diskStorage({
    destination: resolve(staticPath, "./image"),

    filename(req, file, cb) {
        cb(null, formatFilename(file.originalname));
    },
});

const avatarEngin = multer.diskStorage({
    destination: resolve(staticPath, "./avatar"),

    filename(req, file, cb) {
        cb(null, formatFilename(file.originalname));
    },
});

export const imageUploader = multer({ storage: imageEngin }).single("image");
export const avatarUploader = multer({ storage: avatarEngin }).single("avatar");
