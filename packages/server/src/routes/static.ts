import { Router } from "express";
import { analyzeToken } from "../middlewares/authorization";
import { imageUploader, avatarUploader } from "../middlewares/assetsUploader";
import { uploadAvatar, removeImage, uploadImage } from "../controllers/static";

const router = Router();

router.post("/image", analyzeToken, imageUploader, analyzeToken, uploadImage);
router.delete("/image", analyzeToken, removeImage);
router.post("/avatar", analyzeToken, avatarUploader, analyzeToken, uploadAvatar);

export default router;
