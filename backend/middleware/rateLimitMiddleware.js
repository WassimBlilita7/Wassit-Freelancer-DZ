// backend/middlewares/rateLimitMiddleware.js
import rateLimit from "express-rate-limit";

const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max par IP
  message: {
    success: false,
    message: "Trop de requêtes depuis cette IP. Réessayez dans 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default rateLimitMiddleware;