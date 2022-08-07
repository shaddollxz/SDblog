import { Router } from "express";
import * as Essay from "../controllers/essay";
import { analyzeToken } from "../middlewares/authorization";

const router = Router();

router.get("/essayList", Essay.essayList); // 获取列表
router.post("/", analyzeToken, Essay.write, Essay.essayList); // 写新随笔
router.delete("/", analyzeToken, Essay.remove, Essay.essayList); // 删除随笔
router.put("/like", Essay.like); // 点赞

export default router;
