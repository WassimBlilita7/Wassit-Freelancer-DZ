import { useState, useEffect } from "react";
import { useFetchPosts } from "../hooks/useFetchPosts";
import { usePagination } from "../hooks/usePagination";
import { PostCard } from "../components/posts/PostCard";
import { CategoryFilter } from "../components/posts/CategoryFilter";
import { Loader } from "../components/common/Loader";
import { EmptyState } from "../components/common/EmptyState";
import { fetchCategories } from "../api/api";
import { Category, PostData } from "../types";
import { motion } from "framer-motion";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 9;

export const AllPosts = () => {
  const { posts, loading, error, isFreelancer } = useFetchPosts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);

  // Hook de pagination
  const { currentPage, setCurrentPage, pageCount, paginatedItems, handlePageChange } = usePagination(filteredPosts, ITEMS_PER_PAGE);

  // Charger les catégories
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

  // Mettre à jour les posts filtrés
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  // Filtrer les posts par catégorie
  const handleFilterChange = (categoryId: string | null) => {
    if (!categoryId) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) => post.category?._id === categoryId);
      setFilteredPosts(filtered);
    }
    setCurrentPage(0); // Réinitialiser à la première page lors du filtrage
  };

  // Supprimer un post après suppression
  const handlePostDelete = (postId: string) => {
    setFilteredPosts((prev) => prev.filter((p) => p._id !== postId));
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
          className="flex flex-col min-h-[calc(100vh-4rem)]"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
              {isFreelancer ? "Toutes les Offres" : "Mes Offres"}
            </h1>
            <div className="z-50">
              <CategoryFilter categories={categories} onFilterChange={handleFilterChange} />
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedItems.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    isFreelancer={isFreelancer}
                    onDelete={() => handlePostDelete(post._id)}
                  />
                ))}
              </div>

              {pageCount > 1 && (
                <div className="mt-auto">
                  <ReactPaginate
                    previousLabel={"← Précédent"}
                    nextLabel={"Suivant →"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={"react-paginate"}
                    activeClassName={"active"}
                    disabledClassName={"disabled"}
                    forcePage={currentPage}
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};