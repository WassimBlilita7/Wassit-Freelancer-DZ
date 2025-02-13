// controllers/authController.js
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../utils/emailSender.js";
import { generateOTP, validateOTP } from "../utils/otpUtils.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// Inscription avec OTP
export async function signup(req, res) {
  try {
    const { username, email, password, isFreelancer } = req.body;

   

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

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const otp = generateOTP();
    const otpExpires = Date.now() + 600000; // 10 minutes

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isFreelancer,
      otp,
      otpExpires,
    });

    generateTokenAndSetCookie(newUser._id, res);

    await newUser.save();

    const emailSubject = "Vérification de votre compte";
    const emailText = `Votre code de vérification est : ${otp}\nValable pendant 10 minutes`;
    await sendEmail(email, emailSubject, emailText);

    res.status(201).json({ message: "Utilisateur créé avec succès. Vérifiez votre e-mail pour le code OTP." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

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
  try {
    const {email , password} = req.body;
    if(!email || !password){
      return res.status(400).json({message:"Veuillez saisir tous les champs"})
    };

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if(user.isOAuthUser){
      return res.status(400).json({message:"Veuillez vous connecter avec Google"})
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "Veuillez vérifier votre compte en cliquant sur le lien envoyé à votre adresse e-mail" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET , {expiresIn: "24h"});
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      isFreelancer: user.isFreelancer,
    };

     res.status(200).json({ token, userData });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    
  }
}

// Déconnexion
export async function logout(req, res) {
  try {
    res.clearCookie("jwt-FreelanceerDZ");
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    
  }
}