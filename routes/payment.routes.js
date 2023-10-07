import express from "express";
import {
  initiateOrder,
  verifyOrder,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/orders", initiateOrder);

router.post("/verify", verifyOrder);

export default router;
