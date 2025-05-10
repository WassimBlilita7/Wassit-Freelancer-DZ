import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/api";
import { ProfileData } from "../types";
import toast from "react-hot-toast";

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData>({} as ProfileData);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileResponse = await getProfile();
        if (profileResponse.userData) {
          setIsAuthenticated(true);
          setProfile(profileResponse.userData.profile || {} as ProfileData);
          setUsername(profileResponse.userData.username);
          setIsFreelancer(profileResponse.userData.isFreelancer);
        }
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

  return { profile, username, loading, isAuthenticated, isFreelancer };
};