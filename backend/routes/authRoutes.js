import express from "express";
import passport from "passport";
import {
  authCheck,
  forgotPassword,
  getProfile,
  getProfileByUsername,
  login,
  logout,
  resetPassword,
  signup,
  updateProfile,
  updateProfilePicture,
  verifyOTP,
} from "../controllers/authController.js";
import { configureGoogleAuth } from "../config/googleAuthConfig.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadProfilePicture } from "../utils/upload.js"; // Correct
import { ENV_VARS } from "../config/envVars.js";

const router = express.Router();

configureGoogleAuth();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protect, authCheck);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const { user } = req.user;
    generateTokenAndSetCookie(user._id, res);
    res.redirect(ENV_VARS.VITE_URL);
  }
);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/profile/picture", protect, uploadProfilePicture.single("profilePicture"), updateProfilePicture);
router.get("/profile/:username", getProfileByUsername);

export default router;