// utils/emailSender.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ENV_VARS } from "../config/envVars.js";

dotenv.config();

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Fonction pour envoyer un e-mail
export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Freelance Platform" <${ENV_VARS.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("E-mail envoyé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    throw error;
  }
};

