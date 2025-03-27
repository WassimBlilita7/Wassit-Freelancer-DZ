// src/pages/PostDetails.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PostData } from "../types";
import { fetchPostById } from "../utils/postUtils";
import { FaClock, FaMoneyBillWave, FaTags, FaTools, FaUser, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { cva } from "class-variance-authority";

const AvatarSVG = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#E2E8F0" />
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#64748B" />
  </svg>
);

const statusVariants = cva(
  "px-4 py-1 rounded-full text-sm font-medium tracking-wide uppercase border",
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

const PostDetails = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("PostDetails mounted with postId:", postId);
    if (!postId) {
      setError("Aucun ID de post fourni");
      setLoading(false);
      return;
    }
    fetchPostById(postId, setPost, setLoading, setError);
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Lottie animationData={loadingAnimation} loop style={{ width: 100, height: 100 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--text)] bg-[var(--background)]">
        <p>Erreur: {error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--text)] bg-[var(--background)]">
        Post non trouvé
      </div>
    );
  }

  console.log("Rendering post with category:", post.category); // Debug category

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-[var(--background)] py-12"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <Card className="bg-[var(--card)] border-[var(--muted)]/20 shadow-lg">
            <CardHeader className="relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-t-xl" />
              <CardTitle className="text-3xl font-bold text-[var(--header-text)] flex items-center gap-2 pt-4">
                <FaTags className="text-[var(--success)]" /> {post.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-[var(--muted)] mt-2">
                <span className="flex items-center gap-1">
                  <FaUser /> {post.client?.username || "Anonyme"}
                </span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h2 className="text-xl font-semibold text-[var(--text)] flex items-center gap-2">
                  <FaEnvelope className="text-[var(--primary)]" /> Description
                </h2>
                <p className="text-[var(--text)]/80 mt-2">{post.description || "Aucune description disponible"}</p>
              </motion.div>
              <Separator className="my-6 bg-[var(--muted)]/20" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <FaMoneyBillWave className="text-[var(--primary)] text-2xl" />
                  <div>
                    <p className="text-sm text-[var(--muted)]">Budget</p>
                    <p className="text-lg font-medium text-[var(--text)]">{post.budget ? `${post.budget.toLocaleString()} DZD` : "Non spécifié"}</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <FaClock className="text-[var(--primary)] text-2xl" />
                  <div>
                    <p className="text-sm text-[var(--muted)]">Durée</p>
                    <p className="text-lg font-medium text-[var(--text)]">
                      {post.duration === "short-term" ? "Court terme" : post.duration === "long-term" ? "Long terme" : post.duration || "En continu"}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <FaTags className="text-[var(--success)] text-2xl" />
                  <div>
                    <p className="text-sm text-[var(--muted)]">Catégorie</p>
                    <p className="text-lg font-medium text-[var(--text)]">
                      {typeof post.category === "object" && post.category?.name
                        ? post.category.name
                        : typeof post.category === "string"
                        ? post.category // If it’s just an ID or name string
                        : "Non spécifiée"}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3"
                >
                  <FaTools className="text-[var(--muted)] text-2xl" />
                  <div>
                    <p className="text-sm text-[var(--muted)]">Compétences</p>
                    <p className="text-lg font-medium text-[var(--text)]">{post.skillsRequired?.join(", ") || "Aucune"}</p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="md:w-80 flex-shrink-0 sticky top-20 self-start"
        >
          <Card className="bg-[var(--card)] border-[var(--muted)]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[var(--text)]">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <AvatarSVG />
                <div>
                  <p className="font-medium text-[var(--text)]">{post.client?.username || "Anonyme"}</p>
                  <p className="text-sm text-[var(--muted)]">{post.client?.email || "Email non disponible"}</p>
                </div>
              </div>
              <Badge className={statusVariants({ status: post.status })}>{post.status}</Badge>
              <Button className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90">
                Postuler maintenant
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PostDetails;