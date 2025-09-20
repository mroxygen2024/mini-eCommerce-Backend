import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { createOrderSchema, updateOrderSchema } from "../validators/order.validator.js";
import mongoose from "mongoose";

// Place order from cart
export const placeOrder = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.products.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const products = cart.products.map(p => ({
      productId: p.productId,
      quantity: p.quantity
    }));

    // Calculate totalPrice
    let totalPrice = 0;
    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });
      totalPrice += product.price * item.quantity;
    }

    const order = await Order.create({
      userId: req.user.id,
      products,
      totalPrice
    });

    // Clear user's cart
    cart.products = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email").populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get logged-in user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = updateOrderSchema.parse(req.body);
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};
