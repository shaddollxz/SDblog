import { Router } from "express";
import { analyzeToken, haveAuthority } from "../middlewares/authorization";
import { AuthorityEnum } from "../typings/enum";

const router = Router();

import StaticRouter from "./static";
import BlogRouter from "./blog";
import EssayRouter from "./essay";
import PanRouter from "./pan";
import ReplyRouter from "./reply";
import ShaddollxzRouter from "./shaddollxz";
import TagRouter from "./tag";
import UserRouter from "./user";

router.use("/", StaticRouter);
router.use("/blog", BlogRouter);
router.use("/essay", EssayRouter);
router.use("/pan", analyzeToken, haveAuthority(AuthorityEnum.pan_private), PanRouter);
router.use("/reply", ReplyRouter);
router.use("/shaddollxz", ShaddollxzRouter);
router.use("/tag", TagRouter);
router.use("/user", UserRouter);

export default router;
