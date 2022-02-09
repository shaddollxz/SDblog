import { Router } from "express";
import * as Essay from "../controllers/essay";
import { mustLogin } from "../middlewares/authorization";

const router = Router();

router.get("/essayList", Essay.essayList); // 获取列表
router.post("/", mustLogin, Essay.write, Essay.essayList); // 写新随笔
router.delete("/", mustLogin, Essay.remove, Essay.essayList); // 删除随笔
router.put("/like", Essay.like); // 点赞

export default router;
