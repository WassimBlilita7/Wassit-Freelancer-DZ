// src/components/PostList.tsx
import { useState, useEffect } from "react";
import { PostCard } from "./PostCard";
import { getAllPosts, deletePost } from "../../api/api";
import { PostData } from "@/types";

export const PostList = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Erreur lors de la récupération des posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Erreur lors de la suppression du post:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          isFreelancer={false} // ou true selon l'utilisateur
          onDelete={() => handleDeletePost(post._id)}
        />
      ))}
    </div>
  );
};