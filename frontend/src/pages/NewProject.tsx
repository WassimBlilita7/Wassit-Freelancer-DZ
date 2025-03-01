/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/NewProject.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth, createPost, fetchCategories } from "../api/api";
import { PostData } from "../types"; // Importation du type PostData
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { FormField } from "../components/ui/FormField";
import { SkillsInput } from "../components/ui/SkillsInput";
import { Loader } from "../components/common/Loader";
import { Player } from "@lottiefiles/react-lottie-player";
import successAnimation from "../assets/lottie/success.json";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export const NewProject = () => {
  const [formData, setFormData] = useState<PostData>({
    title: "",
    description: "",
    skillsRequired: [],
    budget: 0,
    duration: "" as "short-term" | "long-term" | "ongoing",
    category: "",
  });
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyClientAndFetchCategories = async () => {
      setLoading(true);
      try {
        const authResponse = await checkAuth();
        if (authResponse.userData?.isFreelancer) {
          toast.error("Seuls les clients peuvent publier des offres");
          navigate("/");
        } else {
          setIsClient(true);
          const categoryData = await fetchCategories();
          setCategories(categoryData.map((cat) => cat.name));
        }
      } catch (err) {
        toast.error("Vous devez être connecté pour publier une offre");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    verifyClientAndFetchCategories();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData((prev) => ({ ...prev, skillsRequired: skills }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isClient) return;

    setSubmitting(true);
    try {
      const response = await createPost(formData);
      toast.success(response.message || "Offre publiée avec succès !", {
        icon: <Player autoplay src={successAnimation} style={{ height: "30px", width: "30px" }} />,
      });
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de la publication");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl" style={{ backgroundColor: "var(--card)" }}>
        <CardHeader>
          <CardTitle className="text-3xl font-bold" style={{ color: "var(--text)" }}>
            Publier une Offre
          </CardTitle>
          <p style={{ color: "var(--muted)" }}>
            Remplissez les détails pour créer une nouvelle offre de projet.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              id="title"
              label="Titre"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Entrez le titre de l’offre"
              icon="user"
              required
              disabled={submitting}
            />
            <FormField
              id="description"
              label="Description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre projet"
              icon="email"
              required
              disabled={submitting}
            />
            <SkillsInput
              skills={formData.skillsRequired}
              onChange={handleSkillsChange}
              disabled={submitting}
            />
            <FormField
              id="budget"
              label="Budget (DZD)"
              type="number"
              value={formData.budget.toString()}
              onChange={handleChange}
              placeholder="Entrez votre budget"
              icon="password"
              required
              disabled={submitting}
            />
            <div className="space-y-2">
              <label htmlFor="duration" className="text-lg font-medium" style={{ color: "var(--text)" }}>
                Durée <span style={{ color: "var(--error)" }}>*</span>
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border-2 border-[var(--muted)] focus:border-[var(--primary)]"
                style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
                required
                disabled={submitting}
              >
                <option value="">Sélectionnez une durée</option>
                <option value="short-term">Court terme</option>
                <option value="long-term">Long terme</option>
                <option value="ongoing">En continu</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-lg font-medium" style={{ color: "var(--text)" }}>
                Catégorie <span style={{ color: "var(--error)" }}>*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border-2 border-[var(--muted)] focus:border-[var(--primary)]"
                style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
                required
                disabled={submitting}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                type="submit"
                className="w-full py-6 text-lg"
                style={{ backgroundColor: "var(--primary)", color: "#FFFFFF" }}
                disabled={submitting}
              >
                {submitting ? "Publication en cours..." : "Publier l’offre"}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};