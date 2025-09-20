import multer from "multer";
import Product from "../models/product.model.js";
import { createProductSchema, updateProductSchema } from "../validators/product.validator.js";
import fs from "fs";
import path from "path";

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
export const upload = multer({ storage });

// Controllers

export const createProduct = async (req, res) => {
  try {
    // const parsed = createProductSchema.parse(req.body);
    const parsed = createProductSchema.parse({
  ...req.body,
  price: Number(req.body.price)  // convert string to number
});


    if (req.file) parsed.image = req.file.filename;

    const product = await Product.create(parsed);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // const parsed = updateProductSchema.parse(req.body);
    const parsed = updateProductSchema.parse({
  ...req.body,
  price: req.body.price ? Number(req.body.price) : undefined
});


    if (req.file) parsed.image = req.file.filename;

    const product = await Product.findByIdAndUpdate(req.params.id, parsed, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image file if exists
    if (product.image) {
      const filePath = path.join("uploads", product.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

