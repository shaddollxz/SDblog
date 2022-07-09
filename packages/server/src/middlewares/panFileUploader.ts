import multer from "multer";
import { resolve } from "path";
import { panPath } from "../utils/paths";
import { formateFilename } from "../utils/formateFilename";

const privatePanFileEngin = multer.diskStorage({
    destination: resolve(panPath, "./private"),

    filename(req, file, cb) {
        cb(null, formateFilename(file.originalname));
    },
});

const publicPanFileEngin = multer.diskStorage({
    destination: resolve(panPath, "./public"),

    filename(req, file, cb) {
        cb(null, formateFilename(file.originalname));
    },
});

export const publicPanFileUploader = multer({ storage: publicPanFileEngin }).array("files");
export const privatePanFileUploader = multer({ storage: privatePanFileEngin }).array("files");
