import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

export const placeOrder = async (req, res) => {
  try {
    // 1️⃣ Get user's cart with populated products
    const cart = await Cart.findOne({ userId: req.user.id }).populate("products.productId");

    if (!cart || !cart.products.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2️⃣ Filter out invalid products (deleted ones)
    const validProducts = cart.products.filter(item => item.productId);
    if (!validProducts.length) {
      return res.status(400).json({ error: "No valid products in cart" });
    }

    // 3️⃣ Calculate total price
    let totalPrice = 0;
    validProducts.forEach(item => {
      totalPrice += item.quantity * item.productId.price;
    });

    // 4️⃣ Create order using cart products
    const order = await Order.create({
      userId: req.user.id,
      products: validProducts.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      totalPrice,
      status: "pending"
    });

    // 5️⃣ Clear the cart
    cart.products = [];
    await cart.save();

    res.status(201).json(order);

  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};



export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId").populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
