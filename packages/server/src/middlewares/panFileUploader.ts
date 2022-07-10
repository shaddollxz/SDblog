import multer from "multer";
import { resolve } from "path";
import { formateFilename } from "../utils/formateFilename";

const privatePanFileEngin = multer.diskStorage({
    destination: resolve(process.env.PAN_PATH, "./private"),

    filename(req, file, cb) {
        cb(null, formateFilename(file.originalname));
    },
});

const publicPanFileEngin = multer.diskStorage({
    destination: resolve(process.env.PAN_PATH, "./public"),

    filename(req, file, cb) {
        cb(null, formateFilename(file.originalname));
    },
});

export const publicPanFileUploader = multer({ storage: publicPanFileEngin }).array("files");
export const privatePanFileUploader = multer({ storage: privatePanFileEngin }).array("files");
