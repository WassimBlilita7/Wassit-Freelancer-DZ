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
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const authResponse = await checkAuth();
      setIsFreelancer(authResponse.userData?.isFreelancer || false);

      const fetchedPosts = await getAllPosts();

      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);

      const postsWithCategories: PostData[] = fetchedPosts.map((post: any) => {
        const categoryId = post.category; // ID de la catégorie retourné par l'API
        const category = fetchedCategories.find((cat) => cat._id === categoryId);
        if (!category) {
          console.warn(`Category not found for ID: ${categoryId}, post:`, post);
          return { ...post, category: undefined };
        }
        return { ...post, category };
      });

      setPosts(postsWithCategories);
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

  useEffect(() => {
    fetchData();
  }, []);

  // Fonction pour ajouter un post manuellement
  const addPost = (newPost: PostData) => {
    setPosts((prevPosts) => {
      const updatedPosts = [newPost, ...prevPosts.filter((p) => p._id !== newPost._id)];
      return updatedPosts;
    });
  };

  return { posts, loading, error, isFreelancer, categories, addPost, refetch: fetchData };
};