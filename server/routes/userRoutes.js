import express from "express";
import { getMyorders } from "../controllers/user-controller.js";

const router = express.Router();

router.get("/users",getMyorders);

export default router;
