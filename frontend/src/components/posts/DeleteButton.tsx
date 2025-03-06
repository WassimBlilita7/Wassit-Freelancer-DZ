// src/components/posts/DeleteButton.tsx
import { useState } from "react";
import { deletePost } from "../../api/api";
import { motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface DeleteButtonProps {
  postId: string;
  onDelete: () => void;
}

export const DeleteButton = ({ postId, onDelete }: DeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deletePost(postId); // Attendre la réponse
      if (response && response.message) { // Vérifier que la suppression a réussi
        toast.success("Projet supprimé avec succès");
        onDelete(); // Appeler onDelete uniquement en cas de succès
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du post:", error);
      toast.error("Vous n'êtes pas autorisé à supprimer ce post");
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