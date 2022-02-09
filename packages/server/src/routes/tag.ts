import { Router } from "express";
import { getAll, create } from "../controllers/tag";
import { mustLogin } from "../middlewares/authorization";

const router = Router();

router.get("/", getAll); // 获取所有标签
router.post("/", mustLogin, create); // 添加新标签

export default router;
