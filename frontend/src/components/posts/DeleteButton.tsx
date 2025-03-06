// src/components/posts/DeleteButton.tsx
import { useState } from "react";
import { deletePost } from "../../api/api";
import { motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface DeleteButtonProps {
  postId: string;
  onDelete?: () => void; // Rendu optionnel avec "?"
}

export const DeleteButton = ({ postId, onDelete }: DeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deletePost(postId);
      console.log("DeleteButton - Response:", response);
      toast.success("Projet supprimé avec succès");
      console.log("DeleteButton - Avant rechargement");
      if (onDelete) onDelete(); // Vérifie si onDelete existe avant de l’appeler
      window.location.reload(); // Actualiser la page
      console.log("DeleteButton - Après rechargement (ne devrait pas s’afficher)");
    } catch (error: any) {
      console.error("Erreur lors de la suppression du post:", error.message);
      toast.error("Vous n'êtes pas autorisé à supprimer ce projet");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
    >
      <TrashIcon className="w-5 h-5" />
    </motion.button>
  );
};