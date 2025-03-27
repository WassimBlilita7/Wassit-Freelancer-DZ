// src/pages/PostDetails.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PostData } from "../types";
import { getPostById } from "../api/api";
import { FaClock, FaMoneyBillWave, FaTags, FaTools, FaUser } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "../components/ui/badge";
import toast from "react-hot-toast";
import { cva } from "class-variance-authority"; // Ensure this is correct

const PostDetails = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(postId!);
        setPost(fetchedPost);
      } catch (err) {
        console.error("Erreur lors du chargement du post:", err);
        toast.error("Erreur lors du chargement du post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-t-[var(--primary)] border-[var(--muted)] rounded-full"
        />
      </div>
    );
  }

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--text)]">Post non trouvé</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[var(--background)] py-12"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 border border-[var(--muted)]/20">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-[var(--header-text)]">{post.title}</h1>
            <Badge className={statusVariants({ status: post.status })}>
              {post.status === "open" ? "Ouverte" : post.status === "in-progress" ? "En cours" : "Terminée"}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-[var(--muted)] mb-6">
            <FaUser className="mr-2" />
            <span>Par {post.client?.username || "Anonyme"}</span>
            <span className="ml-4">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Description</h2>
            <p className="text-[var(--text)]/80">{post.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-[var(--primary)] mr-3" />
              <div>
                <p className="text-sm text-[var(--muted)]">Budget</p>
                <p className="text-lg font-medium text-[var(--text)]">{post.budget.toLocaleString()} DZD</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaClock className="text-[var(--primary)] mr-3" />
              <div>
                <p className="text-sm text-[var(--muted)]">Durée</p>
                <p className="text-lg font-medium text-[var(--text)]">
                  {post.duration === "short-term" ? "Court terme" : post.duration === "long-term" ? "Long terme" : "En continu"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaTags className="text-[var(--success)] mr-3" />
              <div>
                <p className="text-sm text-[var(--muted)]">Catégorie</p>
                <p className="text-lg font-medium text-[var(--text)]">{post.category?.name || "Non spécifiée"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaTools className="text-[var(--muted)] mr-3" />
              <div>
                <p className="text-sm text-[var(--muted)]">Compétences Requises</p>
                <p className="text-lg font-medium text-[var(--text)]">{post.skillsRequired.join(", ") || "Aucune"}</p>
              </div>
            </div>
          </div>
          <Button className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90">
            Postuler à cette offre
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const statusVariants = cva(
  "px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase border",
  {
    variants: {
      status: {
        open: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
        "in-progress": "bg-[var(--secondary)]/10 text-[var(--secondary)] border-[var(--secondary)]/20",
        completed: "bg-[var(--muted)]/10 text-[var(--muted)] border-[var(--muted)]/20",
      },
    },
    defaultVariants: { status: "open" },
  }
);

export default PostDetails;