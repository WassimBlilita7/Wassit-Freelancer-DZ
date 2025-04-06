// src/components/post/PostDetailHeader.tsx
import { motion } from "framer-motion";

interface PostDetailHeaderProps {
  title: string;
}

export const PostDetailHeader = ({ title }: PostDetailHeaderProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mb-12 text-center"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] tracking-tight">
        {title}
      </h1>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, delay: 0.5 }}
        className="h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] mx-auto mt-4 rounded-full max-w-md"
      />
    </motion.div>
  );
};