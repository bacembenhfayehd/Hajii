import express from "express";
import { getOrders } from "../controllers/order-controller.js";

const router = express.Router();

router.get("/orders",getOrders);

export default router;
