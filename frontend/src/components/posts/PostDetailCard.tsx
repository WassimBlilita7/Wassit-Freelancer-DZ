// src/components/post/PostDetailCard.tsx
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaClock, FaTags, FaFolderOpen } from "react-icons/fa";
import { PostData } from "../../types";
import { timeAgo } from "../../utils/formatDate";

interface PostDetailCardProps {
  post: PostData;
}

export const PostDetailCard = ({ post }: PostDetailCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[var(--card)] rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-3xl font-semibold text-[var(--text)] mb-6 flex items-center">
        <FaFolderOpen style={{ color: "var(--primary)" }} className="mr-2" /> Détails de l’offre
      </h2>
      <div className="space-y-6 text-[var(--text)]">
        <p className="text-lg leading-relaxed">{post.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="flex items-center">
            <FaMoneyBillWave style={{ color: "var(--success)" }} className="mr-2" /> {/* Vert */}
            <strong>Budget :</strong> {post.budget.toLocaleString()} DA
          </p>
          <p className="flex items-center">
            <FaClock style={{ color: "var(--secondary)" }} className="mr-2" /> {/* Teal */}
            <strong>Durée :</strong>{" "}
            {post.duration === "short-term"
              ? "Court terme"
              : post.duration === "long-term"
              ? "Long terme"
              : "En continu"}
          </p>
          <p className="flex items-center">
            <FaTags style={{ color: "var(--accent)" }} className="mr-2" /> {/* Jaune */}
            <strong>Compétences :</strong>
            <span className="ml-2 flex flex-wrap gap-2">
              {post.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </span>
          </p>
          <p className="flex items-center">
            <FaFolderOpen style={{ color: "var(--primary)" }} className="mr-2" /> {/* Bleu/Magenta */}
            <strong>Catégorie :</strong> {post.category?.name || "Non spécifiée"}
          </p>
          <p className="flex items-center">
            <FaClock style={{ color: "var(--error)" }} className="mr-2" /> {/* Rose/Rouge */}
            <strong>Publié le :</strong> {timeAgo(post.createdAt)}
          </p>
          <p className="flex items-center">
            <FaClock style={{ color: "var(--error)" }} className="mr-2" /> {/* Rose/Rouge */}
            <strong>Mis à jour :</strong> {timeAgo(post.updatedAt || post.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};