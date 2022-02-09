import { Router } from "express";
import * as Reply from "../controllers/reply.js";
import { mustLogin } from "../middlewares/authorization.js";

const router = Router();

router.get("/replyList/:replyMainId", Reply.replyList); // 获得评论列表
router.post("/user", mustLogin, Reply.userWriteReply); // 用户发送评论
router.post("/visitor", Reply.visitorWriteReply); // 游客发送评论
router.put("/:replyId", Reply.like); // 评论点赞
router.delete("/:replyId", mustLogin, Reply.remove); //删除评论
router.get("/:userId", mustLogin, Reply.userReplyList); // 用户评论列表

export default router;
