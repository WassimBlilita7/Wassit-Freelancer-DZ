// src/hooks/useFetchProfile.ts
import { useState, useEffect } from "react";
import { getProfileByUsername } from "../api/api";
import { ProfileData } from "../types"; // Import depuis index.ts

interface ProfileResponse {
  id: string;
  username: string;
  email: string;
  isFreelancer: boolean;
  profile: ProfileData;
}

export const useFetchProfile = (username: string) => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfileByUsername(username);
        setProfile(response.userData);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erreur lors de la récupération du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return { profile, loading, error };
};