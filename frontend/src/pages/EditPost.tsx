/* eslint-disable react-hooks/exhaustive-deps */
// Inside EditPost.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { CustomTextField } from "@/components/common/CustomTextField";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "@/components/posts/CategoryFilter";
import { useEditPost } from "../hooks/useEditPost";
import { Loader } from "@/components/common/Loader";
import { getPostById, fetchCategories } from "@/api/api";
import {  Category } from "@/types";

const EditPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setSelectedCategory] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]); // Store skills as an array

  const {
    loading,
    formData,
    setFormData,
    handleInputChange,
    handleImageChange,
    handleSubmit,
  } = useEditPost(postId || "");

  useEffect(() => {
    const loadData = async () => {
      if (postId) {
        const postData = await getPostById(postId);
        setFormData({
          title: postData.title,
          description: postData.description,
          budget: postData.budget,
          duration: postData.duration,
          skillsRequired: postData.skillsRequired,
          category: postData.category?._id || undefined,
          picture: undefined,
        });
        setSelectedCategory(postData.category?._id || null);
        setSkills(postData.skillsRequired || []); // Initialize skills array from post data
      }
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    };
    loadData();
  }, [postId]);

  const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      setSkills((prevSkills) => [...prevSkills, e.currentTarget.value.trim()]);
      e.currentTarget.value = ""; // Clear input after adding
    }
  };

  const handleSkillRemove = (index: number) => {
    setSkills((prevSkills) => prevSkills.filter((_, i) => i !== index));
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
            value={formData.budget ? formData.budget.toString() : ""}
            onChange={handleInputChange}
            placeholder="Budget (DZD)"
            icon="user"
          />
          
          {/* Modified skills input */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
              Compétences requises
            </label>
            <input
              type="text"
              placeholder="Appuyez sur 'Entrée' pour ajouter une compétence"
              onKeyDown={handleSkillAdd}
              className="w-full px-4 py-3 bg-[var(--background)] text-[var(--text)] rounded-lg border border-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 transition-all duration-200"
            />
            <div className="mt-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 rounded-full py-1 px-4 mr-2 mb-2 inline-block"
                >
                  {skill} 
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(index)}
                    className="ml-2 text-red-500"
                  >
                    X
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
              Durée
            </label>
            <select
              name="duration"
              value={formData.duration}
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
            <CategoryFilter
              categories={categories}
              onFilterChange={(categoryId) => {
                setFormData({ ...formData, category: categoryId || undefined });
                setSelectedCategory(categoryId);
              }}
            />
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
