import { Router } from "express";
import { getAll, create } from "../controllers/tag";
import { analyzeToken, haveAuthority } from "../middlewares/authorization";
import { AuthorityEnum } from "../typings/enum";

const router = Router();

router.get("/", getAll); // 获取所有标签
router.post("/", analyzeToken, haveAuthority(AuthorityEnum.blog), create); // 添加新标签

export default router;
