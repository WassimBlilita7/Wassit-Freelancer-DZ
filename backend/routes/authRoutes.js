// routes/authRoutes.js
import express from "express";
import passport from "passport";
import { authCheck, forgotPassword, getProfile, getProfileByUsername, login, logout, resetPassword, signup, updateProfile, verifyOTP } from "../controllers/authController.js";
import { configureGoogleAuth } from "../config/googleAuthConfig.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

configureGoogleAuth();

router.post("/signup", signup);

router.post("/verify-otp", verifyOTP);

router.post("/login", login);

router.post("/logout", logout);

router.get("/check" , protect , authCheck);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session:false,failureRedirect: "/login" }),
  (req, res) => {
    const { user, token } = req.user;

    generateTokenAndSetCookie(user._id, res);

    // Rediriger l'utilisateur vers une page de profil ou une autre route
    res.redirect("http://localhost:3000/");
  }
);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/profile/:username", getProfileByUsername);

export default router;