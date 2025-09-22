import express from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { placeOrder, getAllOrders, getMyOrders, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

// 🔑 All order routes require login
router.use(authenticate);

router.post("/", placeOrder);          // Place new order
router.get("/my", getMyOrders);        // Get user’s own orders
router.get("/", getAllOrders);         // Admin: Get all orders
router.put("/:id", updateOrderStatus); // Admin: Update status

export default router;
