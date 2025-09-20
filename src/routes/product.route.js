import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  upload
} from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", authenticate, authorize(["admin"]), upload.single("image"), createProduct);
router.put("/:id", authenticate, authorize(["admin"]), upload.single("image"), updateProduct);
router.delete("/:id", authenticate, authorize(["admin"]), deleteProduct);

export default router;
