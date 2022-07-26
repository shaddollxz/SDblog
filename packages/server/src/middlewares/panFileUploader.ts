import multer from "multer";
import { resolve } from "path";
import { formateFilename, filenameSlice } from "../utils/formateFilename";

const chunkFileEngin = multer.diskStorage({
    destination: process.env.TEMP_PATH,

    filename(req, file, cb) {
        cb(
            null,
            formateFilename(req.body.hash + filenameSlice(req.body.name).suffix, {
                chunkIndex: req.body.index,
            })
        );
    },
});

export const chunkFileUploader = multer({ storage: chunkFileEngin }).single("file");
