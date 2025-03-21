// src/pages/CategoryPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCategoryById } from "@/api/api";
import { Category } from "@/types";
import { WavyHeader } from "@/components/category/WavyHeader";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { CategorySummary } from "@/components/category/CategorySummary";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategory = async () => {
      if (!categoryId) {
        setError("Aucune catégorie spécifiée");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCategoryById(categoryId);
        setCategory(data);
      } catch (err) {
        console.error("Erreur lors du chargement de la catégorie:", err);
        setError("Impossible de charger la catégorie");
      } finally {
        setLoading(false);
      }
    };
    loadCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <p className="text-lg" style={{ color: "var(--text)" }}>Chargement...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <div className="text-center bg-[var(--card)] p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
            {error || "Catégorie non trouvée"}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <WavyHeader />
      <CategoryHeader category={category} />
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <CategorySummary category={category} />
      </div>
    </div>
  );
};

export default CategoryPage;