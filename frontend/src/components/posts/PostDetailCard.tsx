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
            <FaMoneyBillWave style={{ color: "var(--success)" }} className="mr-2" />
            <strong>Budget :</strong> {post.budget.toLocaleString()} DA
          </p>
          <p className="flex items-center">
            <FaClock style={{ color: "var(--secondary)" }} className="mr-2" />
            <strong>Durée :</strong>{" "}
            {post.duration === "1j"
              ? "1 jour"
              : post.duration === "7j"
              ? "7 jours"
              : post.duration === "15j"
              ? "15 jours"
              : post.duration === "1mois"
              ? "1 mois"
              : post.duration === "3mois"
              ? "3 mois"
              : post.duration === "6mois"
              ? "6 mois"
              : "+1 an"}
          </p>
          <p className="flex items-center">
            <FaTags style={{ color: "var(--accent)" }} className="mr-2" />
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
            <FaFolderOpen style={{ color: "var(--primary)" }} className="mr-2" />
            <strong>Catégorie :</strong> {post.category?.name || "Non spécifiée"}
          </p>
          <p className="flex items-center">
            <FaClock style={{ color: "var(--error)" }} className="mr-2" />
            <strong>Publié le :</strong> {timeAgo(post.createdAt)}
          </p>
          <p className="flex items-center">
            <FaClock style={{ color: "var(--error)" }} className="mr-2" />
            <strong>Mis à jour :</strong> {timeAgo(post.updatedAt || post.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};