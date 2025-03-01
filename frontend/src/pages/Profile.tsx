/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api/api";
import { ProfileData } from "../types";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Loader } from "../components/common/Loader";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { Label } from "@/components/ui/label";

export const Profile = () => {
  const { theme } = useTheme();
  const [profile, setProfile] = useState<ProfileData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        
        setIsAuthenticated(true);
        const profileResponse = await getProfile();
        setProfile(profileResponse.userData?.profile || {});
      } catch (err) {
        setIsAuthenticated(false);
        toast.error("Vous devez être connecté pour accéder à cette page");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await updateProfile(profile);
      toast.success(response.message || "Profil mis à jour avec succès !");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--background)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl shadow-2xl rounded-xl" style={{ backgroundColor: "var(--card)" }}>
          <CardHeader className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--card)] rounded-t-xl p-6">
            <CardTitle className="text-3xl font-bold">Gérer mon profil</CardTitle>
            <p className="mt-2 text-sm opacity-90">Mettez à jour vos informations personnelles.</p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" style={{ color: "var(--text)" }}>Prénom</Label>
                <input
                  id="firstName"
                  name="firstName"
                  value={profile.firstName || ""}
                  onChange={handleChange}
                  placeholder="Entrez votre prénom"
                  className="w-full p-3 rounded-lg border-2 border-[var(--muted)] focus:border-[var(--primary)]"
                  style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" style={{ color: "var(--text)" }}>Nom</Label>
                <input
                  id="lastName"
                  name="lastName"
                  value={profile.lastName || ""}
                  onChange={handleChange}
                  placeholder="Entrez votre nom"
                  className="w-full p-3 rounded-lg border-2 border-[var(--muted)] focus:border-[var(--primary)]"
                  style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" style={{ color: "var(--text)" }}>Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio || ""}
                  onChange={handleChange}
                  placeholder="Décrivez-vous brièvement"
                  className="w-full p-3 rounded-lg border-2 border-[var(--muted)] focus:border-[var(--primary)] h-24"
                  style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName" style={{ color: "var(--text)" }}>Nom de l'entreprise</Label>
                <input
                  id="companyName"
                  name="companyName"
                  value={profile.companyName || ""}
                  onChange={handleChange}
                  placeholder="Entrez le nom de votre entreprise (facultatif)"
                  className="w-full p-3 rounded-lg border-2 border-[var(--muted)] focus:border-[var(--primary)]"
                  style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webSite" style={{ color: "var(--text)" }}>Site web</Label>
                <input
                  id="webSite"
                  name="webSite"
                  value={profile.webSite || ""}
                  onChange={handleChange}
                  placeholder="Entrez l’URL de votre site web (facultatif)"
                  className="w-full p-3 rounded-lg border-2 border-[var(--muted)] focus:border-[var(--primary)]"
                  style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                  disabled={submitting}
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="w-full py-6 text-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary)]/90 hover:to-[var(--secondary)]/90"
                  style={{ color: "var(--card)" }}
                  disabled={submitting}
                >
                  {submitting ? "Mise à jour en cours..." : "Mettre à jour le profil"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};