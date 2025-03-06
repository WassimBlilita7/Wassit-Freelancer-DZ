// src/components/PostList.tsx
import { useState, useEffect } from "react";
import { PostCard } from "./../posts/PostCard";
import { getAllPosts, deletePost } from "../../api/api";
import { PostData } from "../../types";
import toast from "react-hot-toast";

export const PostList = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Erreur lors de la récupération des posts:", error);
        toast.error("Échec du chargement des posts");
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await deletePost(postId);
      console.log("PostList - Response:", response);
      toast.success("Projet supprimé avec succès");
      console.log("PostList - Avant rechargement");
      window.location.reload();
      console.log("PostList - Après rechargement (ne devrait pas s’afficher)");
    } catch (error: any) {
      console.error("Erreur lors de la suppression du post:", error.message);
      toast.error("Échec de la suppression du projet");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          isFreelancer={false} // À ajuster selon la logique d’authentification
          onDelete={() => handleDeletePost(post._id)} // onDelete toujours fourni
        />
      ))}
    </div>
  );
};