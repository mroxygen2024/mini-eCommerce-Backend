import express from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { addToCart, getCart, updateQuantity, removeFromCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.use(authenticate); // all routes require login

router.post("/",addToCart);
router.get("/",getCart);
router.put("/:productId", updateQuantity);
router.delete("/:productId", removeFromCart);

export default router;
