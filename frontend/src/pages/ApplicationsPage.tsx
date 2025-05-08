import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getPostById } from "../api/api";
import { PostData } from "../types";
import { ApplicationList } from "../components/posts/ApplicationList";
import { PostDetailHeader } from "../components/posts/PostDetailHeader";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json";

const ApplicationsPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    if (!postId) return;
    try {
      const data = await getPostById(postId);
      setPost(data);
    } catch (err) {
      console.error("Erreur lors du chargement de l'offre:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Lottie animationData={loadingAnimation} style={{ width: 200, height: 200 }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <p className="text-2xl font-extrabold text-[var(--text)] tracking-wider">
          Offre introuvable
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-[var(--background)] py-16"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <PostDetailHeader title={post.title} />
        <div className="mt-8">
          <ApplicationList post={post} onApplicationUpdate={fetchPost} />
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationsPage; 