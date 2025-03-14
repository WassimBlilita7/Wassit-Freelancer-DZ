// src/components/posts/PostCard.tsx
import { useState } from "react";
import { PostData } from "../../types";
import { FaTrash, FaEdit, FaClock, FaMoneyBillWave, FaTags, FaTools } from "react-icons/fa";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { deletePost } from "../../api/api";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cva } from "class-variance-authority";

// Variantes pour le statut avec Tailwind
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
    defaultVariants: {
      status: "open",
    },
  }
);

interface PostCardProps {
  post: PostData;
  isFreelancer: boolean;
  onEdit?: (post: PostData) => void;
  onDelete?: (postId: string) => void;
}

export const PostCard = ({ post, isFreelancer, onEdit, onDelete }: PostCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;

    setIsDeleting(true);
    try {
      await deletePost(post._id);
      toast.success("Offre supprimée avec succès !");
      if (onDelete) onDelete(post._id);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-[var(--card)] rounded-xl shadow-md p-6 border border-[var(--muted)]/20 hover:shadow-lg transition-all duration-300 max-w-md w-full"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--text)] line-clamp-1">
          {post.title}
        </h2>
        {!isFreelancer && (
          <div className="flex space-x-2">
            {onEdit && (
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(post)}
                      className="text-[var(--primary)] hover:text-[var(--primary)]/80"
                      disabled={isDeleting}
                    >
                      <FaEdit className="w-4 h-4" />
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-gray-800 text-white text-xs rounded-md px-2 py-1 shadow-lg"
                      style={{ backgroundColor: "var(--background)" }}
                      sideOffset={5}
                    >
                      Modifier
                      <Tooltip.Arrow className="fill-gray-800" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="text-[var(--error)] hover:text-[var(--error)]/80"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="animate-spin text-sm">⏳</span>
                    ) : (
                      <FaTrash className="w-4 h-4" style={{ color: "var(--error-dark, var(--error))" }} />
                    )}
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-800 text-white text-xs rounded-md px-2 py-1 shadow-lg"
                    style={{ backgroundColor: "var(--background)" }}
                    sideOffset={5}
                  >
                    Supprimer
                    <Tooltip.Arrow className="fill-gray-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-[var(--text)]/80 text-sm mb-4 line-clamp-2">
        {post.description}
      </p>

      {/* Détails avec couleurs d'icônes */}
      <div className="space-y-3 text-sm text-[var(--text)]/70">
        <div className="flex items-center">
          <FaMoneyBillWave className="mr-2 w-4 h-4" style={{ color: "var(--secondary)" }} />
          <span>{post.budget.toLocaleString()} DZD</span>
        </div>
        <div className="flex items-center">
          <FaClock className="mr-2 w-4 h-4" style={{ color: "var(--primary)" }} />
          <span>
            {post.duration === "short-term" ? "Court terme" : post.duration === "long-term" ? "Long terme" : "En continu"}
          </span>
        </div>
        <div className="flex items-center">
          <FaTags className="mr-2 w-4 h-4" style={{ color: "var(--success)" }} />
          <span>{post.category?.name || "Non spécifiée"}</span>
        </div>
        <div className="flex items-center">
          <FaTools className="mr-2 w-4 h-4" style={{ color: "var(--muted)" }} />
          <span className="line-clamp-1">{post.skillsRequired.join(", ") || "Aucune"}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <span className={statusVariants({ status: post.status })}>
          {post.status === "open" ? "Ouverte" : post.status === "in-progress" ? "En cours" : "Terminée"}
        </span>
        <span className="text-xs text-[var(--muted)]">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};