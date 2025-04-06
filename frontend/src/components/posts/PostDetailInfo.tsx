// src/components/post/PostDetailInfo.tsx
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaClock, FaTags, FaFolderOpen } from "react-icons/fa";
import { PostData } from "../../types";
import { timeAgo } from "../../utils/formatDate";

interface PostDetailInfoProps {
  post: PostData;
}

export const PostDetailInfo = ({ post }: PostDetailInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-[var(--card)] rounded-3xl shadow-2xl p-8 border border-[var(--primary)]/30"
    >
      <h2 className="text-4xl font-bold text-[var(--text)] mb-6">À propos du projet</h2>
      <p className="text-lg text-[var(--muted)] leading-relaxed mb-8">{post.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start space-x-4">
          <FaMoneyBillWave style={{ color: "var(--success)" }} className="text-3xl" /> {/* Vert */}
          <div>
            <p className="text-xl font-semibold text-[var(--text)]">Budget</p>
            <p className="text-2xl text-[var(--text)]">{post.budget.toLocaleString()} DA</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <FaClock style={{ color: "var(--secondary)" }} className="text-3xl" /> {/* Teal */}
          <div>
            <p className="text-xl font-semibold text-[var(--text)]">Durée</p>
            <p className="text-2xl text-[var(--text)]">
              {post.duration === "short-term"
                ? "Court terme"
                : post.duration === "long-term"
                ? "Long terme"
                : "En continu"}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-4 md:col-span-2">
          <FaTags style={{ color: "var(--accent)" }} className="text-3xl" /> {/* Jaune */}
          <div>
            <p className="text-xl font-semibold text-[var(--text)]">Compétences</p>
            <div className="flex flex-wrap gap-3 mt-2">
              {post.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[var(--accent)]/20 text-[var(--accent)] px-4 py-2 rounded-full text-sm font-medium shadow-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <FaFolderOpen style={{ color: "var(--primary)" }} className="text-3xl" /> {/* Bleu/Magenta */}
          <div>
            <p className="text-xl font-semibold text-[var(--text)]">Catégorie</p>
            <p className="text-2xl text-[var(--text)]">{post.category?.name || "Non spécifiée"}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <FaClock style={{ color: "var(--error)" }} className="text-3xl" /> {/* Rose/Rouge */}
          <div>
            <p className="text-xl font-semibold text-[var(--text)]">Publié</p>
            <p className="text-2xl text-[var(--text)]">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};