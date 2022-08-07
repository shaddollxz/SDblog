import express from "express";
import * as Blog from "../controllers/blog";
import { analyzeToken, haveAuthority } from "../middlewares/authorization";
import { blogValidator } from "../middlewares/blogValidator";
import { AuthorityEnum } from "../typings/enum";

const router = express.Router();

router.get("/homePage", Blog.homePage); // 获取主页博客列表
router.get("/timeLine", Blog.timeLine); // 获取所有博客的创作时间和标题
router.get("/detail/:blogId", Blog.getDetail); // 博客详情
router.get("/search", Blog.search); // 获取查找结果博客列表
router.post("/", analyzeToken, haveAuthority(AuthorityEnum.blog), blogValidator, Blog.write); // 写博客
router.delete("/:blogId", analyzeToken, haveAuthority(AuthorityEnum.blog), Blog.remove); // 删除博客
router.put("/:blogId", analyzeToken, haveAuthority(AuthorityEnum.blog), blogValidator, Blog.update); // 修改博客
router.put("/like/:blogId", Blog.like); // 点赞
router.put("/unlike/:blogId", Blog.unlike); // 取消点赞

export default router;
