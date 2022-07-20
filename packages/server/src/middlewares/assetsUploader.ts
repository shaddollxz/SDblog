import multer from "multer";
import { resolve } from "path";
import { formateFilename } from "../utils/formateFilename";

const imageEngin = multer.diskStorage({
    destination: resolve(process.env.PUBLIC_STATIC_PATH, "./image"),

    filename: async (req, file, cb) => {
        cb(null, formateFilename(file.originalname, { T: Date.now() }));
    },
});

const avatarEngin = multer.diskStorage({
    destination: resolve(process.env.PUBLIC_STATIC_PATH, "./avatar"),

    filename: async (req, file, cb) => {
        cb(null, formateFilename(file.originalname, { T: Date.now() }));
    },
});

export const imageUploader = multer({ storage: imageEngin }).single("image");
export const avatarUploader = multer({ storage: avatarEngin }).single("avatar");
