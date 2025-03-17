// middleware/antiDosMiddleware.js
import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

const requestCounts = {};

const antiDosMiddleware = (req, res, next) => {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const threshold = 50; // 50 requêtes max en 1 seconde
  const timeWindow = 1000; // 1 seconde

  // Vérifier si un token valide est présent
  const token = req.cookies["jwt-freelancerDZ"] || req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      jwt.verify(token, ENV_VARS.JWT_SECRET);
      return next(); // Ignorer la vérification anti-DoS pour les utilisateurs authentifiés
    } catch (error) {
      // Si le token est invalide, continuer avec la vérification anti-DoS
    }
  }

  // Logique anti-DoS pour les requêtes non authentifiées
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, lastRequest: now };
  } else {
    const timeDiff = now - requestCounts[ip].lastRequest;
    if (timeDiff < timeWindow) {
      requestCounts[ip].count++;
      if (requestCounts[ip].count > threshold) {
        return res.status(429).json({
          success: false,
          message: "Activité suspecte détectée. Veuillez ralentir.",
        });
      }
    } else {
      requestCounts[ip] = { count: 1, lastRequest: now };
    }
  }

  next();
};

export default antiDosMiddleware;