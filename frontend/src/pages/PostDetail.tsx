// src/pages/PostDetails.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PostData } from "../types";
import { fetchPostById } from "../utils/postUtils";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json";
import { PostHero } from "../components/posts/PostHero";
import { PostInfo } from "../components/posts/PostInfo";
import { PostSidebar } from "../components/posts/PostSidebar";
import { motion } from "framer-motion";

const PostDetails = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setError("Aucun ID de post fourni");
      setLoading(false);
      return;
    }
    fetchPostById(postId, setPost, setLoading, setError);
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <Lottie animationData={loadingAnimation} loop style={{ width: 120, height: 120 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)", color: "var(--text)" }}>
        <p>Erreur: {error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)", color: "var(--text)" }}>
        Post non trouvé
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen py-8"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="container mx-auto px-4">
        <PostHero post={post} />
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <PostInfo post={post} />
          <PostSidebar post={post} />
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetails;