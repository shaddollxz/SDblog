import { Router } from "express";
import * as Reply from "../controllers/reply";
import { analyzeToken } from "../middlewares/authorization";

const router = Router();

router.get("/replyList/:replyMainId", Reply.replyList); // 获得评论列表
router.post("/user", analyzeToken, Reply.userWriteReply); // 用户发送评论
router.post("/visitor", Reply.visitorWriteReply); // 游客发送评论
router.put("/:replyId", Reply.like); // 评论点赞
router.delete("/:replyId", analyzeToken, Reply.remove); //删除评论

export default router;
