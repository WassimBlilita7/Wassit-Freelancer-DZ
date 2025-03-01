/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/NewProject.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkAuth, createPost, fetchCategories } from "../api/api";
import { PostData } from "../types";
import { postSchema, PostFormData } from "../schemas/postSchema";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Loader } from "../components/common/Loader";
import { Player } from "@lottiefiles/react-lottie-player";
import successAnimation from "../assets/lottie/success.json";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaHeading, FaFileAlt, FaTools, FaMoneyBillWave, FaClock, FaTags } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import "../theme/styles.css";
import { SkillsInput } from "@/components/ui/SkillsInput";

export const NewProject = () => {
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors, isDirty }, trigger } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      skillsRequired: [],
      budget: 0,
      duration: undefined,
      category: "",
    },
  });

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

  const onSubmit = async (data: PostFormData) => {
    if (!isClient) return;

    setSubmitting(true);
    try {
      const postData: PostData = { ...data };
      const response = await createPost(postData);
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
    <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--background)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-6xl shadow-2xl rounded-xl" style={{ backgroundColor: "var(--card)" }}>
          <CardHeader className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--card)] rounded-t-xl p-6">
            <CardTitle className="text-3xl font-bold flex items-center">
              <FaFileAlt className="mr-3" /> Publier une Offre
            </CardTitle>
            <p className="mt-2 text-sm opacity-90">
              Créez une opportunité unique pour les freelancers talentueux.
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Titre */}
                <div className="space-y-2">
                  <label className="text-base font-medium flex items-center" style={{ color: "var(--text)" }}>
                    <FaHeading className="mr-2" style={{ color: "var(--primary)" }} /> Titre
                    <span className="text-[var(--error)] ml-1">*</span>
                  </label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Entrez le titre de l’offre"
                        className={`w-full p-4 rounded-lg border-2 ${errors.title && isDirty ? "border-[var(--error)]" : "border-[var(--muted)]/50"} focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all`}
                        style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                        disabled={submitting}
                        onChange={(e) => { field.onChange(e); trigger("title"); }}
                      />
                    )}
                  />
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <label className="text-base font-medium flex items-center" style={{ color: "var(--text)" }}>
                    <FaMoneyBillWave className="mr-2" style={{ color: "var(--secondary)" }} /> Budget (DZD)
                    <span className="text-[var(--error)] ml-1">*</span>
                  </label>
                  <Controller
                    name="budget"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        placeholder="Entrez votre budget"
                        className={`w-full p-4 rounded-lg border-2 ${errors.budget && isDirty ? "border-[var(--error)]" : "border-[var(--muted)]/50"} focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/30 transition-all`}
                        style={{ backgroundColor: theme === "dark" ? "#475569" : "#ECFDF5", color: "var(--text)" }}
                        disabled={submitting}
                        onChange={(e) => { field.onChange(parseFloat(e.target.value) || 0); trigger("budget"); }}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-base font-medium flex items-center" style={{ color: "var(--text)" }}>
                  <FaFileAlt className="mr-2" style={{ color: "var(--primary)" }} /> Description
                  <span className="text-[var(--error)] ml-1">*</span>
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      placeholder="Décrivez votre projet en détail"
                      className={`w-full p-4 rounded-lg border-2 ${errors.description && isDirty ? "border-[var(--error)]" : "border-[var(--muted)]/50"} focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all h-40 resize-none`}
                      style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                      disabled={submitting}
                      onChange={(e) => { field.onChange(e); trigger("description"); }}
                    />
                  )}
                />
              </div>

              {/* Compétences */}
              <div className="space-y-2">
                <label className="text-base font-medium flex items-center" style={{ color: "var(--text)" }}>
                  <FaTools className="mr-2" style={{ color: "var(--secondary)" }} /> Compétences requises
                  <span className="text-[var(--error)] ml-1">*</span>
                </label>
                <Controller
                  name="skillsRequired"
                  control={control}
                  render={({ field }) => (
                    <SkillsInput
                      skills={field.value}
                      onChange={(skills) => { field.onChange(skills); trigger("skillsRequired"); }}
                      disabled={submitting}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Durée */}
                <div className="space-y-2">
                  <label className="text-base font-medium flex items-center" style={{ color: "var(--text)" }}>
                    <FaClock className="mr-2" style={{ color: "var(--primary)" }} /> Durée
                    <span className="text-[var(--error)] ml-1">*</span>
                  </label>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full p-4 rounded-lg border-2 ${errors.duration && isDirty ? "border-[var(--error)]" : "border-[var(--muted)]/50"} focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all`}
                        style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                        disabled={submitting}
                        onChange={(e) => { field.onChange(e); trigger("duration"); }}
                      >
                        <option value="">Sélectionnez une durée</option>
                        <option value="short-term">Court terme</option>
                        <option value="long-term">Long terme</option>
                        <option value="ongoing">En continu</option>
                      </select>
                    )}
                  />
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <label className="text-base font-medium flex items-center" style={{ color: "var(--text)" }}>
                    <FaTags className="mr-2" style={{ color: "var(--secondary)" }} /> Catégorie
                    <span className="text-[var(--error)] ml-1">*</span>
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full p-4 rounded-lg border-2 ${errors.category && isDirty ? "border-[var(--error)]" : "border-[var(--muted)]/50"} focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/30 transition-all`}
                        style={{ backgroundColor: theme === "dark" ? "#475569" : "#ECFDF5", color: "var(--text)" }}
                        disabled={submitting}
                        onChange={(e) => { field.onChange(e); trigger("category"); }}
                      >
                        <option value="">Sélectionnez une catégorie</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="w-full py-6 text-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary)]/90 hover:to-[var(--secondary)]/90 transition-all rounded-lg"
                  style={{ color: "var(--card)" }}
                  disabled={submitting}
                >
                  {submitting ? "Publication en cours..." : "Publier l’offre"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};