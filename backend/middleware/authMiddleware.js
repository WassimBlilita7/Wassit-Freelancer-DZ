// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { ENV_VARS } from "../config/envVars.js";

export const protect = async (req, res, next) => {
  try {
    // Récupérer le token depuis les cookies ou l'en-tête Authorization
    const token = req.cookies["jwt-freelancerDZ"] || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Non autorisé - Token manquant" });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

    // Trouver l'utilisateur dans la base de données
    const user = await User.findById(decoded.userId).select("-password"); // Utiliser `decoded.userId`

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Ajouter l'utilisateur à l'objet `req`
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Non autorisé - Token invalide" });
  }
};