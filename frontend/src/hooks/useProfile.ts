// src/hooks/useProfile.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/api";
import { ProfileData } from "../types";
import toast from "react-hot-toast";

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        setIsAuthenticated(true);
        const profileResponse = await getProfile();
        console.log("Profile response:", profileResponse); // Debug
        setProfile(profileResponse.userData?.profile || {});
      } catch (err) {
        console.error("Erreur lors de la récupération du profil:", err);
        setIsAuthenticated(false);
        toast.error("Vous devez être connecté pour accéder à cette page");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  return { profile, loading, isAuthenticated, navigate };
};