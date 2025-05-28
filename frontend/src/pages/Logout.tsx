/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/Logout.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser, checkAuth } from "../api/api";
import { Loader } from "../components/common/Loader";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import logoutAnimation from "../assets/lottie/logoutAnimation.json"; // Assurez-vous que ce fichier existe
import { Helmet } from 'react-helmet-async';

export const Logout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false); // État pour suivre la déconnexion
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      setLoading(true);
      try {
        await checkAuth();
        const response = await logoutUser();
        setIsLoggedOut(true); // Déconnexion réussie
        toast.success(response.message || "Déconnexion réussie !", { id: "logout" });
        setTimeout(() => navigate("/login"), 3000); // Redirection après 3s
      } catch (err: any) {
        setIsLoggedOut(false); // Échec de la déconnexion
        toast.error("Aucun compte connecté à déconnecter", { id: "logout" });
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };
    handleLogout();
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Déconnexion | Wassit Freelance DZ</title>
        <meta name="description" content="Déconnectez-vous de votre compte Wassit Freelance DZ." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader />
            <p className="text-lg mt-4" style={{ color: "var(--text)" }}>
              Déconnexion en cours...
            </p>
          </div>
        ) : isLoggedOut ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full h-screen flex flex-col items-center justify-center relative"
          >
            {/* Animation Lottie en plein écran */}
            <Lottie
              animationData={logoutAnimation}
              loop={false} // Une seule lecture
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                objectFit: "cover",
                zIndex: 1,
              }}
            />
            {/* Texte en gras */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-center z-10"
              style={{ color: "var(--text)" }}
            >
              Vous avez été déconnecté !
            </motion.h1>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center"
          >
            <p className="text-lg" style={{ color: "var(--text)" }}>
              Aucun compte à déconnecter. Redirection en cours...
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
};