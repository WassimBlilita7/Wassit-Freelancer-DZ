import { useState, useEffect } from "react";
import { useFetchPosts } from "../hooks/useFetchPosts";
import { PostCard } from "../components/posts/PostCard";
import { CategoryFilter } from "../components/posts/CategoryFilter";
import { Loader } from "../components/common/Loader";
import { EmptyState } from "../components/common/EmptyState"; // Nouveau
import { fetchCategories } from "../api/api";
import { Category, PostData } from "../types";
import { motion } from "framer-motion";

export const AllPosts = () => {
  const { posts, loading, error, isFreelancer } = useFetchPosts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);

  // Charger les catégories au montage
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };
    loadCategories();
  }, []);

  // Mettre à jour les posts filtrés quand les posts changent
  useEffect(() => {
    setFilteredPosts(posts); // Initialement, afficher tous les posts
  }, [posts]);

  // Filtrer les posts par catégorie
  const handleFilterChange = (categoryId: string | null) => {
    if (!categoryId) {
      setFilteredPosts(posts); // Réinitialiser à tous les posts
    } else {
      const filtered = posts.filter((post) => post.category?._id === categoryId);
      setFilteredPosts(filtered);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center py-8" style={{ color: "var(--error)" }}>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <main className="flex-1 p-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
              Toutes les Offres
            </h1>
            <div className="z-50">
              <CategoryFilter categories={categories} onFilterChange={handleFilterChange} />
            </div>
          </div>
          {filteredPosts.length === 0 ? (
            <EmptyState /> // Remplace le texte simple par le composant EmptyState
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  isFreelancer={isFreelancer}
                  onDelete={() => {
                    setFilteredPosts((prev) => prev.filter((p) => p._id !== post._id));
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};