// src/pages/CategoryPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCategoryById } from "@/api/api";
import { Category } from "@/types";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>(); // Changé categorySlug en categoryId
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
        <p style={{ color: "var(--text)" }}>Chargement...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
            {error || "Catégorie non trouvée"}
          </h2>
          <Link to="/" className="text-[var(--secondary)] hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: "var(--background)" }}>
      <div className="container mx-auto px-4">
        <Link to="/" className="text-[var(--secondary)] hover:underline mb-6 inline-block">
          ← Retour à l'accueil
        </Link>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
          {category.name}
        </h1>
      </div>
    </div>
  );
};

export default CategoryPage;