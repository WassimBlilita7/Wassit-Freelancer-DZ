import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../api/api";
import toast from "react-hot-toast";

export const useHome = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFreelancer, setIsFreelancer] = useState<boolean | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
      try {
        const authResponse = await checkAuth();
        console.log("Réponse complète de checkAuth:", authResponse);

        // Vérifie si la réponse contient user (et non userData)
        if (!authResponse || !authResponse.user) {
          console.warn("Aucune donnée utilisateur trouvée dans la réponse:", authResponse);
          throw new Error("Aucune donnée utilisateur renvoyée par l’API");
        }

        const userData = authResponse.user; // Changement de userData à user
        console.log("Données utilisateur extraites:", userData);

        setIsAuthenticated(true);

        // Vérifie si isFreelancer est un booléen valide
        if (typeof userData.isFreelancer === "boolean") {
          setIsFreelancer(userData.isFreelancer);
        } else {
          console.warn("isFreelancer invalide ou non défini:", userData.isFreelancer);
          setIsFreelancer(false); // Par défaut à false si non défini
          toast.error("Rôle utilisateur non détecté. Par défaut : client.");
        }
      } catch (err: any) {
        console.error("Erreur lors de la vérification de l’authentification:", err.message || err);
        setIsAuthenticated(false);
        setIsFreelancer(undefined);
        toast.error("Vous devez être connecté pour accéder à cette page");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, [navigate]);

  return { loading, isAuthenticated, isFreelancer, navigate };
};