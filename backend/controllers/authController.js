// controllers/authController.js
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../utils/emailSender.js";
import { generateOTP, validateOTP } from "../utils/otpUtils.js";

// Inscription avec OTP
export async function signup(req, res) {
  try {
    const { username, email, password, isFreelancer } = req.body;

    // Validation des champs
    // if (!username || !email || !password || !isFreelancer) {
    //   return res.status(400).json({ message: "Tous les champs sont requis" });
    // }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" });
    }
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Un utilisateur avec ce nom d'utilisateur existe déjà" });
    }

    // Hasher le mot de passe
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Générer un OTP
    const otp = generateOTP();
    const otpExpires = Date.now() + 600000; // 10 minutes

    // Créer un nouvel utilisateur
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isFreelancer,
      otp,
      otpExpires,
    });

    await newUser.save();

    // Envoyer l'OTP par e-mail
    const emailSubject = "Vérification de votre compte";
    const emailText = `Votre code de vérification est : ${otp}\nValable pendant 10 minutes`;
    await sendEmail(email, emailSubject, emailText);

    res.status(201).json({ message: "Utilisateur créé avec succès. Vérifiez votre e-mail pour le code OTP." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

// Vérification de l'OTP
export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Valider l'OTP
    const validation = validateOTP(otp, user.otp, user.otpExpires);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    // Marquer l'utilisateur comme vérifié
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Vérification réussie. Votre compte est maintenant activé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

// Connexion
export async function login(req, res) {
  res.send("login");
}

// Déconnexion
export async function logout(req, res) {
  res.send("logout");
}