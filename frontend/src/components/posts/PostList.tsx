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
      if (response && response.message) { 
        setPosts(posts.filter(post => post._id !== postId));
        toast.success("Projet supprimé avec succès"); 
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du post:", error);
      toast.error("Échec de la suppression du projet"); 
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          isFreelancer={false} 
          onDelete={() => handleDeletePost(post._id)}
        />
      ))}
    </div>
  );
};