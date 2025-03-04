// src/hooks/useFetchPosts.ts
import { useState, useEffect } from "react";
import { getAllPosts, fetchCategories, checkAuth } from "../api/api";
import { PostData, Category } from "../types";
import toast from "react-hot-toast";

export const useFetchPosts = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFreelancer, setIsFreelancer] = useState<boolean>(false);
  const [, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Vérifier si l'utilisateur est un freelance
        const authResponse = await checkAuth();
        setIsFreelancer(authResponse.userData?.isFreelancer || false);

        // Récupérer tous les posts
        const fetchedPosts = await getAllPosts();
        console.log("useFetchPosts - Posts fetched:", fetchedPosts);

        // Récupérer les catégories
        const fetchedCategories = await fetchCategories();
        console.log("useFetchPosts - Categories fetched:", fetchedCategories);
        setCategories(fetchedCategories);

        // Ajouter le nom de la catégorie à chaque post
        const postsWithCategoryNames = fetchedPosts.map((post) => {
          const category = fetchedCategories.find((cat) => cat._id === post.category);
          return { ...post, categoryName: category?.name || "Non spécifiée" };
        });

        setPosts(postsWithCategoryNames);
        console.log("useFetchPosts - Posts with category names:", postsWithCategoryNames);
        setError(null);
      } catch (err: any) {
        console.error("useFetchPosts - Error:", err);
        const errorMessage = err.message || "Erreur lors du chargement des offres";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { posts, loading, error, isFreelancer };
};