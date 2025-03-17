// middleware/rateLimitMiddleware.js
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max par IP
  message: {
    success: false,
    message: "Trop de requêtes depuis cette IP. Réessayez dans 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Vérifier si un token valide est présent dans les cookies ou les headers
    const token = req.cookies["jwt-freelancerDZ"] || req.headers.authorization?.split(" ")[1];
    if (token) {
      try {
        jwt.verify(token, ENV_VARS.JWT_SECRET);
        return true; // Ignorer la limitation pour les utilisateurs authentifiés
      } catch (error) {
        return false; // Appliquer la limitation si le token est invalide
      }
    }
    return false; // Appliquer la limitation si pas de token
  },
});

export default rateLimitMiddleware;