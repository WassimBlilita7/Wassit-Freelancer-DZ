// src/hooks/useHome.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../api/api";
import toast from "react-hot-toast";

export const useHome = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFreelancer, setIsFreelancer] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
      try {
        const authResponse = await checkAuth();
        setIsAuthenticated(true);
        setIsFreelancer(authResponse.userData?.isFreelancer || false);
      } catch (err) {
        setIsAuthenticated(false);
        console.error("Erreur lors de la vérification de l’authentification:", err);
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