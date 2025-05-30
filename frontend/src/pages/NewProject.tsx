/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/NewProject.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkAuth, createPost, fetchCategories } from "../api/api";
import { PostData, Category } from "../types";
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
import { useFetchPosts } from "../hooks/useFetchPosts";
import "../theme/styles.css";
import { SkillsInput } from "@/components/ui/SkillsInput";
import { ImageUpload } from "../components/ui/ImageUpload";

export const NewProject = () => {
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const { addPost } = useFetchPosts();

  const { control, handleSubmit, formState: { errors, isDirty }, trigger, watch } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      skillsRequired: [],
      budget: 0,
      duration: undefined,
      category: "",
      picture: undefined,
    },
  });

  const skillsRequired = watch("skillsRequired");

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
          setCategories(categoryData);
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
      const selectedCategory = categories.find((cat) => cat.name === data.category);
      if (!selectedCategory) throw new Error("Catégorie invalide");

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("skillsRequired", JSON.stringify(data.skillsRequired));
      formData.append("budget", data.budget.toString());
      formData.append("duration", data.duration);
      formData.append("category", selectedCategory._id);
      if (data.picture) formData.append("picture", data.picture);

      const response = await createPost(formData);
      console.log("createPost response:", response);

      const createdPost: PostData = {
        _id: response.post._id,
        title: response.post.title,
        description: response.post.description,
        skillsRequired: response.post.skillsRequired,
        budget: response.post.budget,
        duration: response.post.duration,
        createdAt: response.post.createdAt || new Date().toISOString(),
        category: selectedCategory,
        client: response.post.client || null,
        status: response.post.status || "open",
        applications: response.post.applications || [],
        picture: response.post.picture || undefined,
      };

      addPost(createdPost);

      toast.success(response.message || "Offre publiée avec succès !", {
        icon: <Player autoplay src={successAnimation} style={{ height: "30px", width: "30px" }} />,
      });
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      console.error("Error in onSubmit:", err);
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

              {/* Image Upload */}
              <Controller
                name="picture"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    onChange={(file) => field.onChange(file)}
                    disabled={submitting}
                  />
                )}
              />

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
                <div className="mt-2">
                  <p className="text-base" style={{ color: "var(--text)" }}>
                    {skillsRequired.length > 0
                      ? skillsRequired.join(", ")
                      : "Aucune compétence sélectionnée"}
                  </p>
                </div>
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
                        <option value="1j">1 jour</option>
                        <option value="7j">7 jours</option>
                        <option value="15j">15 jours</option>
                        <option value="1mois">1 mois</option>
                        <option value="3mois">3 mois</option>
                        <option value="6mois">6 mois</option>
                        <option value="+1an">+1 an</option>
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
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
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