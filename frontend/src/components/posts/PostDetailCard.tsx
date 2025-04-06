// src/components/post/PostDetailCard.tsx
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaClock, FaTags, FaFolderOpen } from "react-icons/fa";
import { PostData } from "../../types";
import { formatDate } from "../../utils/formatDate";

interface PostDetailCardProps {
  post: PostData;
}

export const PostDetailCard = ({ post }: PostDetailCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-3xl font-semibold text-text mb-6 flex items-center">
        <FaFolderOpen className="text-primary mr-2" /> Détails de l’offre
      </h2>
      <div className="space-y-6 text-text">
        <p className="text-lg leading-relaxed">{post.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="flex items-center">
            <FaMoneyBillWave className="text-primary mr-2" />
            <strong>Budget :</strong> {post.budget.toLocaleString()} DA
          </p>
          <p className="flex items-center">
            <FaClock className="text-primary mr-2" />
            <strong>Durée :</strong>{" "}
            {post.duration === "short-term"
              ? "Court terme"
              : post.duration === "long-term"
              ? "Long terme"
              : "En continu"}
          </p>
          <p className="flex items-center">
            <FaTags className="text-primary mr-2" />
            <strong>Compétences :</strong>
            <span className="ml-2 flex flex-wrap gap-2">
              {post.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </span>
          </p>
          <p className="flex items-center">
            <FaFolderOpen className="text-primary mr-2" />
            <strong>Catégorie :</strong> {post.category?.name || "Non spécifiée"}
          </p>
          <p className="flex items-center">
            <FaClock className="text-primary mr-2" />
            <strong>Publié le :</strong> {formatDate(post.createdAt)}
          </p>
          <p className="flex items-center">
            <FaClock className="text-primary mr-2" />
            <strong>Mis à jour :</strong> {formatDate(post.updatedAt || post.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};