import { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { FaCheckCircle, FaListAlt } from "react-icons/fa";
import { Input } from "../components/ui/input";

const ITEMS_PER_PAGE = 9;

const STATUS_FILTERS = [
  { value: "all", label: "Toutes les offres", icon: <FaListAlt className="mr-2" /> },
  { value: "not_completed", label: "Non terminées", icon: <></> },
  { value: "completed", label: "Terminées", icon: <FaCheckCircle className="mr-2 text-green-500" /> },
];

export const AllPosts = () => {
  const { posts, loading, error, isFreelancer,  } = useFetchPosts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [budgetMin, setBudgetMin] = useState<string>("");
  const [budgetMax, setBudgetMax] = useState<string>("");
  const { currentUserId } = useContext(AuthContext);

  const { currentPage, setCurrentPage, pageCount, paginatedItems, handlePageChange } = usePagination(filteredPosts, ITEMS_PER_PAGE);

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

  // Fonction de filtrage combinée (catégorie + statut + budget)
  const filterPosts = (categoryId: string | null, status: string, min: string, max: string) => {
    let result = posts;
    if (categoryId) {
      result = result.filter((post) => post.category?._id === categoryId);
    }
    if (status === "completed") {
      result = result.filter((post) => post.status === "completed");
    } else if (status === "not_completed") {
      result = result.filter((post) => post.status !== "completed");
    }
    // Filtrage budget pour freelancer uniquement
    if (isFreelancer === true) {
      const minVal = min ? parseFloat(min) : null;
      const maxVal = max ? parseFloat(max) : null;
      if (minVal !== null) {
        result = result.filter((post) => post.budget >= minVal);
      }
      if (maxVal !== null) {
        result = result.filter((post) => post.budget <= maxVal);
      }
    }
    setFilteredPosts(result);
    setCurrentPage(0);
  };

  // Gestion du filtre catégorie
  const handleFilterChange = (categoryId: string | null) => {
    filterPosts(categoryId, statusFilter, budgetMin, budgetMax);
  };

  // Gestion du filtre statut
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    filterPosts(selectedCategory, status, budgetMin, budgetMax);
  };

  // Pour garder la catégorie sélectionnée (pour la combiner avec le filtre statut)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    filterPosts(categoryId, statusFilter, budgetMin, budgetMax);
  };

  // Gestion du filtre budget (pour freelancer)
  const handleBudgetChange = (min: string, max: string) => {
    setBudgetMin(min);
    setBudgetMax(max);
    filterPosts(selectedCategory, statusFilter, min, max);
  };

  // Initialisation : tous les posts
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
              {isFreelancer ? "Toutes les Offres" : "Mes Offres"}
            </h1>
            <div className="flex items-center gap-2 z-50">
              <CategoryFilter categories={categories} onFilterChange={handleCategoryChange} />
              {/* Filtre par statut : visible uniquement pour le client */}
              {isFreelancer === false && (
                <div className="flex gap-1 ml-2">
                  {STATUS_FILTERS.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={statusFilter === filter.value ? "default" : "outline"}
                      className={`flex items-center gap-1 text-xs px-3 py-2 ${statusFilter === filter.value ? 'bg-[var(--primary)] text-white' : ''}`}
                      onClick={() => handleStatusFilterChange(filter.value)}
                    >
                      {filter.icon}
                      {filter.label}
                    </Button>
                  ))}
                </div>
              )}
              {/* Filtre budget : visible uniquement pour le freelancer */}
              {isFreelancer === true && (
                <div className="flex items-center gap-2 ml-2">
                  <Input
                    type="number"
                    min={0}
                    placeholder="Budget min"
                    value={budgetMin}
                    onChange={e => handleBudgetChange(e.target.value, budgetMax)}
                    className="w-28 text-xs"
                  />
                  <span className="text-[var(--muted)]">-</span>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Budget max"
                    value={budgetMax}
                    onChange={e => handleBudgetChange(budgetMin, e.target.value)}
                    className="w-28 text-xs"
                  />
                </div>
              )}
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
                    currentUserId={currentUserId}
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