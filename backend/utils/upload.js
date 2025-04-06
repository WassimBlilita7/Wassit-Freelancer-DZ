import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Stockage pour les "posts" (compatible avec ton code original)
const postsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "posts",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// Stockage pour les photos de profil
const profilePictureStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "DZFreelancer/profile_pictures",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [
      { width: 200, height: 200, crop: "fill", gravity: "face" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  },
});

// Middleware pour les "posts" (ton export original)
export const upload = multer({
  storage: postsStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error("Seuls les fichiers JPEG, JPG et PNG sont autorisés"));
  },
});

// Middleware pour les photos de profil
export const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log("Fichier reçu dans uploadProfilePicture :", file); // Log pour débogage
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error("Seuls les fichiers JPEG, JPG et PNG sont autorisés"));
  },
});