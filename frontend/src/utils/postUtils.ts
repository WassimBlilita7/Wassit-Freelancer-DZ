// src/utils/postUtils.ts
import { deletePost } from "../api/api";
import toast from "react-hot-toast";

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