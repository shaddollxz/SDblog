import multer from "multer";
import { formateFilename } from "../utils/formateFilename";
import { tempFileRealPath } from "../utils/assetsPath";

const chunkFileEngin = multer.diskStorage({
    destination: tempFileRealPath,

    filename(req, file, cb) {
        const fileName = formateFilename<TempChunkFileMsg>(req.body.hash, {
            chunkIndex: req.body.index,
        });
        req.body.fileName = fileName;
        cb(null, fileName);
    },
});

export const chunkFileUploader = multer({ storage: chunkFileEngin }).single("file");
