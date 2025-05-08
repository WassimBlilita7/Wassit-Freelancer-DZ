// src/components/posts/ApplyButton.tsx
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface ApplyButtonProps {
  postId: string;
  isFreelancer: boolean;
}

export const ApplyButton = ({ postId, isFreelancer }: ApplyButtonProps) => {
  const navigate = useNavigate();

  const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!postId) {
      toast.error("ID du post invalide");
      return;
    }
    
    console.log("Navigating to post:", postId); // Debug log
    navigate(`/post/${postId}`);
  };

  if (!isFreelancer) return null;

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={handleApply}
        className="w-full mt-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white apply-button"
      >
        <FaPaperPlane className="mr-2" /> Postuler
      </Button>
    </motion.div>
  );
};