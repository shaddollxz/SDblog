import { Router } from "express";
import * as User from "../controllers/user";
import { register } from "../middlewares/userValidator";
import { mustLogin } from "../middlewares/authorization";

const router = Router();

router.get("/:userId/userDetail", mustLogin, User.userDetail); // 获取用户信息
router.post("/login", User.login); // 登录
router.get("/verifycode", User.getVerifycode); // 发送验证码
router.post("/", register, User.register); // 注册
router.put("/", mustLogin, User.updateUserInfo); // 修改个人信息
router.put("/retrieve", User.retrieve); // 修改密码

export default router;
