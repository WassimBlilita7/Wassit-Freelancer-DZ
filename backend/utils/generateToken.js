// utils/generateTokenAndSetCookie.js
import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });

  res.cookie("jwt-freelancerDZ", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 jours en ms
    httpOnly: true, // Protège contre les attaques XSS
    sameSite: "lax", // Protège contre les attaques CSRF
    secure: true, // true en production avec HTTPS, false pour HTTP local/VPS sans SSL
  });

  return token;
};
