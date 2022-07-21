import multer from "multer";
import { resolve } from "path";
import { formateFilename } from "../utils/formateFilename";

const privatePanFileEngin = multer.diskStorage({
    destination: resolve(process.env.PAN_PATH, "./private"),

    filename(req, file, cb) {
        cb(null, formateFilename(file.originalname));
    },
});

const chunkFileEngin = multer.diskStorage({
    destination: process.env.TEMP_PATH,
    filename(req, file, cb) {
        console.log(req.body);
        cb(null, formateFilename(file.originalname));
    },
});

export const privatePanFileUploader = multer({ storage: privatePanFileEngin }).array("files");
export const chunkFileUploader = multer({ storage: chunkFileEngin }).single("chunk");
