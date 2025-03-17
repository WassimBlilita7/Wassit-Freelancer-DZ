// backend/middlewares/antiDosMiddleware.js
const requestCounts = {};

const antiDosMiddleware = (req, res, next) => {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const threshold = 50; // 50 requêtes max en 1 seconde
  const timeWindow = 1000; // 1 seconde

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