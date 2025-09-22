import express from "express";
import passport from "passport";
import { register, login } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { verifyEmail, forgotPassword, resetPassword, changePassword, deleteAccount } from "../controllers/auth.controller.js";

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

// Example admin-only route
router.get("/admin", authenticate, authorize(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", authenticate, changePassword);
router.delete("/delete-account", authenticate, deleteAccount);



export default router;
