import { Router } from "express";
import { detail } from "../controllers/shaddollxz";

const router = Router();

router.get("/", detail);

export default router;
