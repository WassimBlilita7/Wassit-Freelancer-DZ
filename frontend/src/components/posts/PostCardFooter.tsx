// src/components/posts/PostCardFooter.tsx
import { PostData } from "../../types";
import { ApplyButton } from "./ApplyButton";
import { DeleteButton } from "./DeleteButton";
import { motion } from "framer-motion";

interface PostCardFooterProps {
  post: PostData & { categoryName?: string };
  isFreelancer: boolean;
  onDelete: () => void; 
}

export const PostCardFooter = ({ post, isFreelancer, onDelete }: PostCardFooterProps) => {
  const statusStyles: Record<"open" | "in-progress" | "completed", string> = {
    open: "bg-green-500/10 text-green-600 border-green-500",
    "in-progress": "bg-yellow-500/10 text-yellow-600 border-yellow-500",
    completed: "bg-gray-500/10 text-gray-600 border-gray-500",
  };

  return (
    <motion.div
      className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[post.status]}`}
      >
        {post.status}
      </span>
      <div className="flex items-center space-x-2">
        <ApplyButton postId={post._id} isFreelancer={isFreelancer} />
        {!isFreelancer && <DeleteButton postId={post._id} onDelete={onDelete} />}
      </div>
    </motion.div>
  );
};