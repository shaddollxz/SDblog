import { Router } from "express";
import { analyzeToken } from "../middlewares/authorization";
import { imageUploader, avatarUploader } from "../middlewares/assetsUploader";
import { uploadAvatar, removeImage, uploadImage } from "../controllers/static";

const router = Router();

router.post("/image", imageUploader, uploadImage);
router.delete("/image", analyzeToken, removeImage);
router.post("/avatar", analyzeToken, avatarUploader, uploadAvatar);

export default router;
