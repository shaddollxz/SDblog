import multer from "multer";
import { resolve } from "path";
import { staticPath } from "../utils/paths";
import { formateFilename } from "../utils/formateFilename";

const imageEngin = multer.diskStorage({
    destination: resolve(staticPath, "./image"),

    filename(req, file, cb) {
        cb(null, formateFilename(file.originalname));
    },
});

const avatarEngin = multer.diskStorage({
    destination: resolve(staticPath, "./avatar"),

    filename(req, file, cb) {
        cb(null, formateFilename(file.originalname));
    },
});

export const imageUploader = multer({ storage: imageEngin }).single("image");
export const avatarUploader = multer({ storage: avatarEngin }).single("avatar");
