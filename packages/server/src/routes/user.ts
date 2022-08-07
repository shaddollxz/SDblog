import { Router } from "express";
import * as User from "../controllers/user";
import { register } from "../middlewares/userValidator";
import { analyzeToken, haveAuthority } from "../middlewares/authorization";
import { AuthorityEnum } from "../typings/enum";

const router = Router();

router.get("/relogin", analyzeToken, User.relogin); // 获取登录用户信息
// router.get("/:userId/userDetail", User.userDetail); // 获取指定用户信息 这个api没有实装
router.post("/login", User.login); // 登录
router.get("/verifycode", User.getVerifycode); // 发送验证码
router.post("/", register, User.register); // 注册
router.put("/", analyzeToken, User.updateUserInfo); // 修改个人信息
router.put("/retrieve", User.retrieve); // 修改密码
router.put("/authority/enable", analyzeToken, haveAuthority(AuthorityEnum.admin), User.enableAuthority);
router.put("/authority/disable", analyzeToken, haveAuthority(AuthorityEnum.admin), User.disableAuthority);

export default router;
