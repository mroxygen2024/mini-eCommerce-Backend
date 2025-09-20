import express from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { placeOrder, getAllOrders, getMyOrders, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

router.use(authenticate);

// User routes
router.post("/", placeOrder);
router.get("/my", getMyOrders);

// Admin routes
router.get("/", authorize(["admin"]), getAllOrders);
router.put("/:id", authorize(["admin"]), updateOrderStatus);

export default router;
