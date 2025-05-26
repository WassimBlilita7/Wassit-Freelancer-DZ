import { useState, useEffect } from "react";
import { getAllPosts, checkAuth } from "../api/api";
import { PostData } from "../types";
import toast from "react-hot-toast";

export const useFetchPosts = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFreelancer, setIsFreelancer] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const authResponse = await checkAuth();
      let isFreelancerValue = false;
      if (authResponse && typeof authResponse.user === 'object' && typeof authResponse.user.isFreelancer === 'boolean') {
        isFreelancerValue = authResponse.user.isFreelancer;
      } else if (authResponse && typeof authResponse.userData === 'object' && typeof authResponse.userData.isFreelancer === 'boolean') {
        isFreelancerValue = authResponse.userData.isFreelancer;
      }
      setIsFreelancer(isFreelancerValue);

      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
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

  return { posts, loading, error, isFreelancer, addPost, refetch: fetchData };
};