import { Router } from "express";
import * as Pan from "../controllers/pan";
import { chunkFileUploader } from "../middlewares/panFileUploader";

const router = Router();

router.get("/folder", Pan.folderList);
router.put("/folder", Pan.createFolder, Pan.folderList);
router.delete("/folder", Pan.removeFolder, Pan.folderList);
router.post("/folder", Pan.renameFolder, Pan.folderList);
router.post("/folder/move", Pan.moveFolder, Pan.folderList);
router.post("/folder/zip", Pan.zipMulti);
router.get("/folder/zip", Pan.isZipEnd);

router.get("/file/detail/:fileId", Pan.fileDetail);
router.delete("/file", Pan.removeFile, Pan.folderList);
router.post("/file/name", Pan.renameFile);
router.post("/file/desc", Pan.editDesciption);
router.post("/file/move", Pan.moveFile, Pan.folderList);
router.post("/file/start", Pan.uploadStart, Pan.folderList);
router.put("/file/chunk", chunkFileUploader, Pan.uploadChunk);
router.post("/file/end", Pan.uploadEnd);
router.get("/file/end", Pan.isUploadEnd, Pan.folderList);
router.get("/file/download", Pan.downloadFile);

export default router;
