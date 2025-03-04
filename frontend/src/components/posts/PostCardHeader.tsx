// src/components/posts/PostCardHeader.tsx
import { PostData } from "../../types";
import { CardTitle } from "../ui/card";
import { FaFolderOpen } from "react-icons/fa";
import { motion } from "framer-motion";

interface PostCardHeaderProps {
  post: PostData & { categoryName?: string };
}

export const PostCardHeader = ({ post }: PostCardHeaderProps) => {
  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-blue-100 dark:from-teal-900 dark:to-indigo-900 rounded-t-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CardTitle className="text-xl font-semibold flex items-center" style={{ color: "var(--text)" }}>
        <FaFolderOpen className="mr-2 text-teal-500 dark:text-teal-300" /> {post.title}
      </CardTitle>
      <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
        {new Date(post.createdAt).toLocaleDateString()}
      </span>
    </motion.div>
  );
};