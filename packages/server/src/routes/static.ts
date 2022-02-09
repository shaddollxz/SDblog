import { Router } from "express";
import { mustLogin } from "../middlewares/authorization";
import { image, avatar } from "../middlewares/upload";
import { image as _image, avatar as _avatar, randomPic } from "../controllers/static";

const router = Router();

router.post("/uploadImg", mustLogin, image, _image);
router.post("/uploadAvatar", mustLogin, avatar, _avatar);
router.get("/randomPic", randomPic);

export default router;
