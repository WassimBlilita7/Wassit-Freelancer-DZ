// src/components/post/PostInfo.tsx
import { PostData } from "../../types";
import { FaClock, FaMoneyBillWave, FaTags, FaTools, FaEnvelope, FaUsers, FaHourglassStart } from "react-icons/fa";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { formatTimeSince } from "../../utils/postUtils";

interface PostInfoProps {
  post: PostData;
}

const PlaceholderImageSVG = () => (
  <svg width="100%" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="var(--muted)" opacity="0.2" />
    <text x="50%" y="50%" fontSize="24" fill="var(--muted)" textAnchor="middle" dominantBaseline="middle">
      Aucune image disponible
    </text>
  </svg>
);

export const PostInfo = ({ post }: PostInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex-1"
    >
      <Card style={{ backgroundColor: "var(--card)", borderColor: "var(--muted)" }} className="shadow-lg border">
        <CardHeader>
          <CardTitle
            className="text-2xl font-semibold flex items-center gap-2"
            style={{ color: "var(--header-text)" }}
          >
            <FaEnvelope style={{ color: "var(--primary)" }} /> Détails du Projet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium" style={{ color: "var(--text)" }}>Description</h3>
            <p className="mt-1" style={{ color: "var(--muted)" }}>{post.description || "Aucune description disponible"}</p>
          </div>
          {/* Picture Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {post.picture ? (
              <img
                src={post.picture}
                alt={post.title}
                className="w-full h-auto rounded-lg shadow-md"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            ) : (
              <PlaceholderImageSVG />
            )}
          </motion.div>
          <Separator style={{ backgroundColor: "var(--muted)" }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
              <FaMoneyBillWave style={{ color: "var(--primary)" }} className="text-2xl" />
              <div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Budget</p>
                <p className="text-lg font-medium" style={{ color: "var(--text)" }}>
                  {post.budget ? `${post.budget.toLocaleString()} DZD` : "Non spécifié"}
                </p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
              <FaClock style={{ color: "var(--secondary)" }} className="text-2xl" />
              <div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Durée</p>
                <p className="text-lg font-medium" style={{ color: "var(--text)" }}>
                  {post.duration === "short-term" ? "Court terme" : post.duration === "long-term" ? "Long terme" : post.duration || "En continu"}
                </p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
              <FaTags style={{ color: "var(--success)" }} className="text-2xl" />
              <div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Catégorie</p>
                <p className="text-lg font-medium" style={{ color: "var(--text)" }}>
                  {typeof post.category === "object" && post.category?.name
                    ? post.category.name
                    : typeof post.category === "string"
                    ? post.category
                    : "Non spécifiée"}
                </p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
              <FaTools style={{ color: "var(--accent)" }} className="text-2xl" />
              <div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Compétences</p>
                <p className="text-lg font-medium" style={{ color: "var(--text)" }}>{post.skillsRequired?.join(", ") || "Aucune"}</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
              <FaUsers style={{ color: "var(--primary)" }} className="text-2xl" />
              <div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Candidatures</p>
                <p className="text-lg font-medium" style={{ color: "var(--text)" }}>{post.applications?.length || 0}</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
              <FaHourglassStart style={{ color: "var(--accent)" }} className="text-2xl" />
              <div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Depuis</p>
                <p className="text-lg font-medium" style={{ color: "var(--text)" }}>{formatTimeSince(post.createdAt)}</p>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};