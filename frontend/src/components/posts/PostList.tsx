import { useState, useEffect } from "react";
import { PostData, Category } from "../../types";
import { PostCard } from "./PostCard";
import { CategoryFilter } from "./CategoryFilter";
import { getAllPosts, fetchCategories } from "../../api/api";
import { motion } from "framer-motion";

const PostList = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les posts depuis l’API
  const loadPosts = async () => {
    try {
      const postsData = await getAllPosts();
      setPosts(postsData);
      setFilteredPosts(postsData); // Afficher tous les posts initialement
    } catch (error) {
      console.error("Erreur lors du chargement des posts:", error);
    }
  };

  // Charger les catégories depuis l’API
  const loadCategories = async () => {
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([loadPosts(), loadCategories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filtrer les posts par catégorie
  const handleFilterChange = (categoryId: string | null) => {
    if (!categoryId) {
      setFilteredPosts(posts); // Réinitialiser à tous les posts
    } else {
      const filtered = posts.filter((post) => post.category?._id === categoryId);
      setFilteredPosts(filtered);
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-t-[var(--primary)] border-[var(--muted)] rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* En-tête avec filtre */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--header-text)]">
          Toutes les offres
        </h1>
        <CategoryFilter categories={categories} onFilterChange={handleFilterChange} />
      </div>

      {/* Grille des posts */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              isFreelancer={false} // À ajuster selon votre logique d’authentification
              onDelete={() => {
                setFilteredPosts((prev) => prev.filter((p) => p._id !== post._id));
                setPosts((prev) => prev.filter((p) => p._id !== post._id));
              }}
            />
          ))
        ) : (
          <p className="text-[var(--text)]/80 col-span-full text-center py-10">
            Aucune offre trouvée pour cette catégorie.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default PostList;