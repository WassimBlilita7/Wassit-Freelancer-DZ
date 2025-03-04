// src/components/posts/ApplyButton.tsx
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";

interface ApplyButtonProps {
  postId: string;
  isFreelancer: boolean;
}

export const ApplyButton = ({ postId, isFreelancer }: ApplyButtonProps) => {
  const handleApply = () => {
    // Logique de candidature simulée (à remplacer par un appel API réel si disponible)
    toast.success(`Candidature envoyée pour l’offre ${postId} !`);
    // Exemple : await applyToPost(postId, { cv: "...", coverLetter: "..." });
  };

  if (!isFreelancer) return null;

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={handleApply}
        className="w-full mt-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white"
      >
        <FaPaperPlane className="mr-2" /> Postuler
      </Button>
    </motion.div>
  );
};