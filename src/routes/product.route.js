import express from "express";
import { createProduct, listProducts } from "../controllers/product.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createProduct);
router.get("/", listProducts);

export default router;
