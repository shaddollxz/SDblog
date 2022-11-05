import express from "express";
import * as AK from "../controllers/arKnights";

const router = express.Router();

router.get("/recruit", AK.recruit);

export default router;
