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

    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

   

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Email invalide" });
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
    if(!passwordRegex.test(password)){
      return res.status(400).json({message:"Le mot de passe doit contenir au moins 6 caractères, une lettre majuscule, une lettre minuscule et un chiffre"})
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUserByEmail = await User.findOne({ email : normalizedEmail });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" });
    }
    const existingUserByUsername = await User.findOne({ username : normalizedUsername});
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Un utilisateur avec ce nom d'utilisateur existe déjà" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const otp = generateOTP();
    const otpExpires = Date.now() + 600000; // 10 minutes

    const newUser = new User({
      username : normalizedUsername,
      email : normalizedEmail,
      password: hashedPassword,
      isFreelancer,
      otp,
      otpExpires,
    });

    generateTokenAndSetCookie(newUser._id, res);

    await newUser.save();

    const emailSubject = "Vérification de votre compte";
    const emailText = `Votre code de vérification est : ${otp}\nValable pendant 10 minutes`;
    await sendEmail(normalizedEmail, emailSubject, emailText);

    res.status(201).json({ message: "Utilisateur créé avec succès. Vérifiez votre e-mail pour le code OTP." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    if (!otp || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ message: "L'OTP doit être un code de 6 chiffres" });
    }


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
    const token = generateTokenAndSetCookie(user._id, res);
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
    res.clearCookie("jwt-freelancerDZ"); // Utiliser le même nom de cookie
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export async function authCheck(req, res) {
  try {
    // Le middleware protect a déjà vérifié le token et ajouté req.user
    const user = req.user;
    res.status(200).json({
      message: "Utilisateur authentifié",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isFreelancer: user.isFreelancer,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Veuillez fournir un email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Générer un OTP pour la réinitialisation
    const resetOTP = generateOTP();
    const resetOTPExpires = Date.now() + 600000; // Expire dans 10 minutes

    user.resetOTP = resetOTP;
    user.resetOTPExpires = resetOTPExpires;
    await user.save();

    const emailSubject = "Réinitialisation de votre mot de passe";
    const emailText = `Votre code de réinitialisation est : ${resetOTP}\nValable pendant 10 minutes.\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.`;
    await sendEmail(email, emailSubject, emailText);

    res.status(200).json({ message: "Un code de réinitialisation a été envoyé à votre email." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export async function resetPassword(req, res) {
  try {
    const { email, resetOTP, newPassword } = req.body;

    if (!email || !resetOTP || !newPassword) {
      return res.status(400).json({ message: "Veuillez fournir email, code OTP et nouveau mot de passe" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const validation = validateOTP(resetOTP, user.resetOTP, user.resetOTPExpires);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetOTP = undefined; // Effacer l'OTP après utilisation
    user.resetOTPExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès. Vous pouvez vous connecter." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -otp -otpExpires -resetOTP -resetOTPExpires"
    );
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({
      message: "Profil récupéré avec succès",
      userData: {
        id: user._id,
        username: user.username,
        email: user.email,
        isFreelancer: user.isFreelancer,
        profile: user.profile,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { firstName, lastName, bio, skills, companyName, webSite, github, linkedIn } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Mise à jour des champs du profil
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (bio !== undefined) user.profile.bio = bio;
    if (skills !== undefined) {
      // S'assurer que skills est un tableau et qu'il ne contient pas de valeurs vides
      user.profile.skills = Array.isArray(skills) 
        ? skills.filter(skill => skill && skill.trim() !== "")
        : [];
    }
    if (companyName !== undefined) user.profile.companyName = companyName;
    if (webSite !== undefined) user.profile.webSite = webSite;
    if (github !== undefined) user.profile.github = github;
    if (linkedIn !== undefined) user.profile.linkedIn = linkedIn;

    // Sauvegarder les modifications
    await user.save();

    // Retourner les données mises à jour
    res.status(200).json({
      message: "Profil mis à jour avec succès",
      userData: {
        id: user._id,
        username: user.username,
        email: user.email,
        isFreelancer: user.isFreelancer,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

export async function updateProfilePicture(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Aucune photo fournie" });
    }

    console.log("Fichier reçu :", req.file); // Ajout pour débogage

    user.profile.profilePicture = req.file.path; // URL Cloudinary
    await user.save();

    res.status(200).json({
      message: "Photo de profil mise à jour avec succès",
      userData: {
        id: user._id,
        username: user.username,
        email: user.email,
        isFreelancer: user.isFreelancer,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Erreur dans updateProfilePicture :", error); // Log détaillé
    res.status(500).json({ message: "Erreur lors de l'upload de la photo", error: error.message });
  }
}
export async function getProfileByUsername(req, res) {
  try {
    const { username } = req.params;

    // Trouver l'utilisateur par username (insensible à la casse)
    const user = await User.findOne({ username: username.toLowerCase() })
      .select("-password -otp -otpExpires -resetOTP -resetOTPExpires -notifications") // Exclure les données sensibles
      .populate("profile.skills", "name"); // Peupler les compétences si elles sont des références

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Construire l'objet userData avec l'URL de la photo de profil
    const userData = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      isFreelancer: user.isFreelancer,
      profile: {
        firstName: user.profile?.firstName || "",
        lastName: user.profile?.lastName || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills || [],
        portfolio: user.profile?.portfolio || [],
        companyName: user.profile?.companyName || "",
        webSite: user.profile?.webSite || "",
        offers: user.profile?.offers || [],
        profilePicture: user.profile?.profilePicture || "",
        github: user.profile?.github || "",
        linkedIn: user.profile?.linkedIn || "",
      },
    };

    if (userData.profile.profilePicture && !userData.profile.profilePicture.startsWith("http")) {
      userData.profile.profilePicture = `http://localhost:5000/${userData.profile.profilePicture}`;
    }

    res.status(200).json({
      message: "Profil récupéré avec succès",
      userData,
    });
  } catch (error) {
    console.error("Erreur dans getProfileByUsername:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}