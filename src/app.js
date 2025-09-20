import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import "./config/passport.js"; 


dotenv.config();

const app = express();

connectDB();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET , // change in production
  resave: false,
  saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send(`Welcome to eCommerce App 🚀 
     <form id="registerForm" method="POST" action="/auth/register">
    <h2>Register</h2>
    <label for="regEmail">Email:</label>
    <input type="email" id="regEmail" name="email" required>

    <label for="regPassword">Password:</label>
    <input type="password" id="regPassword" name="password" required>

    <label for="confirmPassword">Confirm Password:</label>
    <input type="password" id="confirmPassword" name="confirmPassword" required>

    <button type="submit">Register</button>
</form>

<form id="loginForm" method="POST" action="/auth/login">
    <h2>Login</h2>
    <label for="loginEmail">Email:</label>
    <input type="email" id="loginEmail" name="email" required>

    <label for="loginPassword">Password:</label>
    <input type="password" id="loginPassword" name="password" required>

    <button type="submit">Login</button>

    <p>Or login with google: <a href="/auth/google">Login with Google</a> </p>
</form> 
     
    `);
});

app.use("/api/auth", authRoutes);

export default app;
