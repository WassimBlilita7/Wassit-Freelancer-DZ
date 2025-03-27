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
    console.log("Raw API Response:", fetchedPost); // Debug raw data
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