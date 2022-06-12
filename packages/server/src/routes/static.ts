import { Router } from "express";
import { mustLogin } from "../middlewares/authorization";
import { imageUploader, avatarUploader } from "../middlewares/assetsUploader";
import { uploadAvatar, removeImage, uploadImage } from "../controllers/static";

const router = Router();

router.post("/image", mustLogin, imageUploader, mustLogin, uploadImage);
router.delete("/image", mustLogin, removeImage);
router.post("/avatar", mustLogin, avatarUploader, mustLogin, uploadAvatar);

export default router;
