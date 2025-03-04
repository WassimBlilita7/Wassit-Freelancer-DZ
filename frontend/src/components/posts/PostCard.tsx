// src/components/posts/PostCard.tsx
import { PostData } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion } from "framer-motion";
import { FaFolderOpen, FaMoneyBillWave, FaClock, FaUser, FaTag } from "react-icons/fa";
import { ApplyButton } from "./ApplyButton";

interface PostCardProps {
  post: PostData & { categoryName?: string }; // Ajout de categoryName
  isFreelancer: boolean;
}

export const PostCard = ({ post, isFreelancer }: PostCardProps) => {
  const statusStyles = {
    open: "bg-green-500 text-white",
    "in-progress": "bg-yellow-500 text-white",
    completed: "bg-gray-500 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
    >
      <Card className="shadow-md border-none" style={{ backgroundColor: "var(--card)" }}>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center" style={{ color: "var(--text)" }}>
            <FaFolderOpen className="mr-2 text-[var(--primary)]" /> {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm line-clamp-2" style={{ color: "var(--muted)" }}>
            {post.description}
          </p>
          <div className="flex items-center text-sm" style={{ color: "var(--text)" }}>
            <FaMoneyBillWave className="mr-2 text-[var(--secondary)]" /> <strong>Budget :</strong> {post.budget} DZD
          </div>
          <div className="flex items-center text-sm" style={{ color: "var(--text)" }}>
            <FaClock className="mr-2 text-[var(--primary)]" /> <strong>Durée :</strong> {post.duration}
          </div>
          <div className="flex items-center text-sm" style={{ color: "var(--text)" }}>
            <FaUser className="mr-2 text-[var(--secondary)]" /> <strong>Client :</strong> {post.client?.username || "Inconnu"}
          </div>
          <div className="flex items-center text-sm" style={{ color: "var(--text)" }}>
            <FaTag className="mr-2 text-[var(--primary)]" /> <strong>Catégorie :</strong> {post.categoryName || "Non spécifiée"}
          </div>
          <div className="flex items-center text-sm">
            <strong>Statut :</strong>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[post.status]}`}
            >
              {post.status}
            </span>
          </div>
          <ApplyButton postId={post._id} isFreelancer={isFreelancer} />
        </CardContent>
      </Card>
    </motion.div>
  );
};