// src/utils/postUtils.ts
import { getPostById as apiGetPostById, deletePost } from "../api/api";
import toast from "react-hot-toast";
import { PostData } from "../types";

export const fetchPostById = async (
  postId: string,
  setPost: (post: PostData | null) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) => {
  setLoading(true);
  try {
    const fetchedPost = await apiGetPostById(postId);
    console.log("Raw API Response:", fetchedPost);
    if (!fetchedPost) {
      throw new Error("Post non trouvé dans la réponse de l'API");
    }
    setPost(fetchedPost);
    setError(null);
  } catch (err: any) {
    console.error("Erreur lors du chargement du post:", err);
    toast.error("Erreur lors du chargement du post");
    setError(err.message || "Une erreur est survenue");
    setPost(null);
  } finally {
    setLoading(false);
  }
};

export const handleDeletePost = async (
  postId: string,
  onDelete?: (postId: string) => void,
  setIsDeleting?: (value: boolean) => void
) => {
  if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;

  setIsDeleting?.(true);
  try {
    await deletePost(postId);
    toast.success("Offre supprimée avec succès !");
    onDelete?.(postId);
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Erreur lors de la suppression");
  } finally {
    setIsDeleting?.(false);
  }
};

export const formatTimeSince = (createdAt: string): string => {
  const now = new Date();
  const posted = new Date(createdAt);
  const diffMs = now.getTime() - posted.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) return `${diffDays} jour${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} heure${diffHours > 1 ? "s" : ""} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  return "Il y a quelques instants";
};