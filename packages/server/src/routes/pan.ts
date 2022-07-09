import { Router } from "express";
import * as Pan from "../controllers/pan";
import { mustLogin } from "../middlewares/authorization";

const router = Router();

router.get("/folder", mustLogin, Pan.folderList);
router.post("/folder", mustLogin, Pan.createFolder);
router.delete("/folder", mustLogin, Pan.removeFolder);

router.get("file/:fileId", mustLogin, Pan.fileDetail);
router.post("file", mustLogin, Pan.uploadFile);
router.delete("file", mustLogin, Pan.removeFile);

export default router;
