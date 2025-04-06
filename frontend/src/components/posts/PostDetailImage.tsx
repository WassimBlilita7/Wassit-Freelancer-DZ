// src/components/post/PostDetailImage.tsx
import { motion } from "framer-motion";
import { FaImage } from "react-icons/fa";

interface PostDetailImageProps {
  picture: string;
  title: string;
}

export const PostDetailImage = ({ picture, title }: PostDetailImageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-[var(--card)] rounded-3xl shadow-2xl p-8 border border-[var(--primary)]/30"
    >
      <h2 className="text-4xl font-bold text-[var(--text)] mb-6 flex items-center">
        <FaImage className="text-[var(--secondary)] mr-3" /> Visuel du projet
      </h2>
      <motion.img
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        src={picture}
        alt={title}
        className="w-full h-auto max-h-[600px] object-cover rounded-2xl shadow-lg"
      />
    </motion.div>
  );
};