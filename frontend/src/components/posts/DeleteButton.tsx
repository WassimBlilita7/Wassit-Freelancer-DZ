import { useState } from "react";
import { deletePost } from "../../api/api";
import { motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface DeleteButtonProps {
  postId: string;
  onDelete?: () => void;
}

export const DeleteButton = ({ postId, onDelete }: DeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;

    setIsDeleting(true);
    try {
      await deletePost(postId);
      toast.success("Projet supprimé avec succès");
      if (onDelete) onDelete(); // Met à jour l’état dans PostList.tsx
    } catch (error: any) {
      console.error("Erreur lors de la suppression du post:", error.message);
      toast.error("Vous n’êtes pas autorisé à supprimer ce projet");
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
      {isDeleting ? (
        <span className="animate-spin w-5 h-5">⏳</span>
      ) : (
        <TrashIcon className="w-5 h-5" />
      )}
    </motion.button>
  );
};