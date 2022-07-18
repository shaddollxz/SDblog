import { Router } from "express";
import * as Pan from "../controllers/pan";

const router = Router();

router.get("/folder", Pan.folderList);
router.put("/folder", Pan.createFolder, Pan.folderList);
router.delete("/folder", Pan.removeFolder, Pan.folderList);
router.post("/folder", Pan.renameFolder, Pan.folderList);
router.post("/folder/move", Pan.moveFile, Pan.folderList);

router.get("/file/:fileId", Pan.fileDetail);
router.post("/file/move", Pan.moveFile);
router.post("/file/rename", Pan.renameFile, Pan.folderList);
router.put("/file", Pan.uploadFile, Pan.folderList);
router.post("/file/start", Pan.uploadStart, Pan.folderList);
router.put("/file/chunk", Pan.uploadChunk);
router.post("/file/end", Pan.uploadEnd, Pan.folderList);
router.delete("/file", Pan.removeFile, Pan.folderList);

export default router;
