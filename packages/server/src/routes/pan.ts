import { Router } from "express";
import * as Pan from "../controllers/pan";

const router = Router();

router.get("/folder", Pan.folderList);
router.put("/folder", Pan.createFolder, Pan.folderList);
router.delete("/folder", Pan.removeFolder, Pan.folderList);
router.post("/folder/move");

router.get("/file/:fileId", Pan.fileDetail);
router.post("/file", Pan.uploadFile, Pan.folderList);
router.post("/file/end", Pan.uploadEnd);
router.delete("/file", Pan.removeFile, Pan.folderList);
router.post("/file/move");

export default router;
