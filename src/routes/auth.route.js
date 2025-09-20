import express from "express";
import passport from "passport";
import { register, login } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

// Start Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback after Google login
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.send(`Welcome ${req.user.name} 👋`);
  }
);

// Show profile (session auth)
router.get("/profile", (req, res) => {
  if (!req.user) return res.status(401).send("Not logged in");
  res.json(req.user);
});




router.post("/register", register);
router.post("/login", login);

// Logout
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.send("Error logging out");
    res.send("Logged out ✅");
  });
});

// Example protected route
router.get("/profile", authenticate, (req, res) => {
  res.json({ message: "Your profile", user: req.user });
});

// Example admin-only route
router.get("/admin", authenticate, authorize(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

export default router;



