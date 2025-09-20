import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: parsed.email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const user = await User.create({
      name: parsed.name,
      email: parsed.email,
      password: hashedPassword,
      role: parsed.role,
      avatar: parsed.avatar || ""
    });

    res.status(201).json({ message: "User registered", user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error(err.errors || err.message );
    res.status(400).json({ error: err.errors || err.message });
  }
};

export const login = async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await User.findOne({ email: parsed.email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(parsed.password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};
