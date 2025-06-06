/* eslint-disable no-empty-pattern */
import { useState } from "react";
import { PostData } from "../../types";
import {
  FaTrash,
  FaEdit,
  FaClock,
  FaMoneyBillWave,
  FaTags,
  FaTools,
  FaUser,
  FaUsers,
  FaCheck,
} from "react-icons/fa";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { handleDeletePost, handleEditPost } from "../../utils/postUtils";

const statusVariants = cva(
  "px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase border flex items-center gap-2",
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

interface PostCardProps {
  post: PostData;
  isFreelancer: boolean;
  currentUserId: string | null;
  onEdit?: (post: PostData) => void;
  onDelete?: (postId: string) => void;
}

export const PostCard = ({ post, isFreelancer, currentUserId, onDelete }: PostCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Masquer les offres terminées pour les freelancers
  if (isFreelancer && post.status === 'completed') {
    return null;
  }

  // Déterminer si le projet est terminé
  const isCompleted = post.status === 'completed';

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Rendre la card incliquable si terminée (pour le client)
    if (isCompleted && !isFreelancer) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.tagName === "BUTTON" || target.closest(".apply-button")) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (post._id) {
      navigate(`/post/${post._id}`);
    } else {
      console.error("Post ID is undefined:", post);
    }
  };

  const isPostOwner = !isFreelancer && currentUserId && post.client && currentUserId === post.client._id.toString();
  console.log("Debug - PostCard:", {
    currentUserId: currentUserId,
    postClientId: post.client?._id,
    isPostOwner: isPostOwner,
    postId: post._id,
    isFreelancer: isFreelancer,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: isCompleted && !isFreelancer ? 0 : -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-[var(--card)] rounded-xl shadow-lg overflow-hidden border border-[var(--muted)]/20 hover:shadow-xl transition-all duration-300 w-full max-w-md relative ${isCompleted && !isFreelancer ? 'opacity-80 cursor-not-allowed pointer-events-auto' : 'cursor-pointer'}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={isCompleted && !isFreelancer ? { filter: 'grayscale(0.15)' } : {}}
    >
      {/* Image du projet */}
      <div className="relative h-48 w-full overflow-hidden">
        {post.picture ? (
          <img
            src={post.picture}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 flex items-center justify-center">
            <FaTags className="w-12 h-12 text-[var(--primary)]/40" />
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Badge className={statusVariants({ status: post.status })}>
            {post.status === "open" ? (
              <>
                <FaClock className="w-3 h-3" />
                Ouverte
              </>
            ) : post.status === "in-progress" ? (
              <>
                <FaTools className="w-3 h-3" />
                En cours
              </>
            ) : (
              <>
                <FaCheck className="w-3 h-3 text-green-600" />
                Terminée
              </>
            )}
          </Badge>
          {/* Icône ✅ bien visible pour projet terminé */}
          {isCompleted && !isFreelancer && (
            <span title="Projet terminé" className="text-green-600 text-2xl ml-2">✅</span>
          )}
        </div>
      </div>

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--header-text)] line-clamp-2">
              {post.title}
            </h2>
            <div className="flex items-center mt-1 text-sm text-[var(--muted)]">
              <FaUser className="mr-1" />
              <span>Par {post.client?.username || "Anonyme"}</span>
            </div>
          </div>
          {/* Masquer les icônes d'édition/suppression si terminé */}
          {isPostOwner && !isCompleted && (
            <div className="flex space-x-1">
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPost(post._id, navigate);
                      }}
                      className="text-[var(--muted)] hover:text-[var(--primary)]"
                      disabled={isDeleting}
                    >
                      <FaEdit className="w-4 h-4" />
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content side="top">
                    <div className="bg-[var(--background)] text-[var(--text)] text-xs px-2 py-1 rounded">
                      Modifier
                      <Tooltip.Arrow className="fill-[var(--background)]" />
                    </div>
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post._id, onDelete, setIsDeleting);
                      }}
                      className="text-[var(--muted)] hover:text-[var(--error)]"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <FaTrash className="w-4 h-4" style={{ color: "var(--error)" }} />
                      )}
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content side="top">
                    <div className="bg-[var(--background)] text-[var(--text)] text-xs px-2 py-1 rounded">
                      Supprimer
                      <Tooltip.Arrow className="fill-[var(--background)]" />
                    </div>
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          )}
        </div>
        <div className="mb-6">
          <p className="text-[var(--text)]/80 line-clamp-3">{post.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
              <FaMoneyBillWave className="text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Budget</p>
              <p className="font-medium text-[var(--text)]">{post.budget.toLocaleString()} DZD</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-3">
              <FaClock className="text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Durée</p>
              <p className="font-medium text-[var(--text)]">
                {post.duration === "1j"
                  ? "1 jour"
                  : post.duration === "7j"
                  ? "7 jours"
                  : post.duration === "15j"
                  ? "15 jours"
                  : post.duration === "1mois"
                  ? "1 mois"
                  : post.duration === "3mois"
                  ? "3 mois"
                  : post.duration === "6mois"
                  ? "6 mois"
                  : "+1 an"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 mr-3">
              <FaTags className="text-[var(--success)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Catégorie</p>
              <p className="font-medium text-[var(--text)]">{post.category?.name || "Non spécifiée"}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 mr-3">
              <FaTools className="text-[var(--muted)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Compétences</p>
              <p className="font-medium text-[var(--text)] line-clamp-1">{post.skillsRequired.join(", ") || "Aucune"}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-[var(--muted)]/20">
          <div className="flex items-center gap-3 w-full">
            <Badge variant="outline" className="text-xs">
              {new Date(post.createdAt).toLocaleDateString()}
            </Badge>
            {/* Masquer le bouton "voir les candidatures" si terminé */}
            {isPostOwner && !isCompleted && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/post/${post._id}/applications`);
                }}
                className="flex items-center gap-1 font-medium text-xs bg-[var(--primary)] hover:bg-[var(--primary)]/90 px-3 py-1.5 rounded-md ml-auto"
                style={{ minHeight: '32px', lineHeight: '1.1' }}
              >
                <FaUsers className="w-4 h-4" />
                <span className="hidden sm:inline">Voir les candidatures</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};