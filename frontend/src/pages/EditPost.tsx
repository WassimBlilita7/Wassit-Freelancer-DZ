import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { CustomTextField } from "@/components/common/CustomTextField";
import { Button } from "@/components/ui/button";
import { useEditPost } from "@/hooks/useEditPost";
import { toast } from "react-hot-toast";
import { Loader } from "@/components/common/Loader";
import { fetchCategories } from "@/api/api";
import { Category } from "@/types";
import { TagInput } from "@/components/common/TagInput";

const EditPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    loading,
    formData,
    setFormData,
    handleInputChange,
    handleImageChange,
    handleSubmit,
  } = useEditPost(postId || "");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        toast.error("Erreur lors du chargement des catégories");
      }
    };
    loadCategories();
  }, []);

  const handleTagChange = (newTags: string[]) => {
    setFormData({ ...formData, skillsRequired: newTags });
  };

  if (loading) return <Loader />;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundColor: theme === "dark" ? "var(--background)" : "var(--card)",
      }}
    >
      <div
        className="w-full max-w-2xl bg-[var(--card)] p-8 rounded-xl shadow-lg"
        style={{
          border: theme === "dark" ? "1px solid var(--muted)" : "none",
          boxShadow: theme === "light" ? "0 4px 12px rgba(0,0,0,0.1)" : "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <h2
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: theme === "dark" ? "var(--text)" : "var(--header-text)" }}
        >
          Modifier l'offre
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomTextField
            id="title"
            name="title"
            type="text"
            value={formData.title || ""}
            onChange={handleInputChange}
            placeholder="Titre de l’offre"
            icon="user"
          />
          <CustomTextField
            id="description"
            name="description"
            type="text"
            value={formData.description || ""}
            onChange={handleInputChange}
            placeholder="Description"
            icon="user"
          />
          <CustomTextField
            id="budget"
            name="budget"
            type="number"
            value={formData.budget?.toString() || ""}
            onChange={handleInputChange}
            placeholder="Budget (DZD)"
            icon="user"
          />
          <div className="relative">
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
              Compétences requises
            </label>
            <TagInput
              value={formData.skillsRequired || []}
              onChange={handleTagChange}
              placeholder="Ajoutez des compétences (Entrée, virgule ou espace)"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
              Durée
            </label>
            <select
              name="duration"
              value={formData.duration || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[var(--background)] text-[var(--text)] rounded-lg border border-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 transition-all duration-200"
            >
              <option value="1j">1 jour</option>
              <option value="7j">7 jours</option>
              <option value="15j">15 jours</option>
              <option value="1mois">1 mois</option>
              <option value="3mois">3 mois</option>
              <option value="6mois">6 mois</option>
              <option value="+1an">+1 an</option>
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
              Catégorie
            </label>
            <select
              name="category"
              value={formData.category || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[var(--background)] text-[var(--text)] rounded-lg border border-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 transition-all duration-200"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
              Image (optionnel)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 bg-[var(--background)] text-[var(--text)] rounded-lg border border-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 transition-all duration-200"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/all-posts")}
              className="w-32"
              style={{ borderColor: theme === "dark" ? "var(--profile-button-cancel)" : "var(--profile-button-cancel)" }}
            >
              Annuler
            </Button>
            <Button
              variant="default"
              type="submit"
              className="w-32"
              style={{ backgroundColor: theme === "dark" ? "var(--profile-button-save)" : "var(--profile-button-save)" }}
            >
              Sauvegarder
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;