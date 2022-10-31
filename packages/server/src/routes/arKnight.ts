import express from "express";
import * as AK from "../controllers/arKnight";

const router = express.Router();

router.get("/recruit", AK.recruit);

export default router;
