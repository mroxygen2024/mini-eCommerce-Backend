import Cart from "../models/cart.model.js";
import { addProductSchema, updateQuantitySchema } from "../validators/cart.validator.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = addProductSchema.parse({
      ...req.body,
      quantity: Number(req.body.quantity) || 1
    });

    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ message: "Invalid productId" });

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        products: [{ productId, quantity }]
      });
    } else {
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("products.productId");
    res.json(cart || { products: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { quantity } = updateQuantitySchema.parse({ quantity: Number(req.body.quantity) });
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex === -1) return res.status(404).json({ message: "Product not in cart" });

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
