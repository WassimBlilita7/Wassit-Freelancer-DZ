// src/components/post/PostDetailApplications.tsx
import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa";
import { PostData } from "../../types";

interface PostDetailApplicationsProps {
  applications: PostData["applications"];
}

export const PostDetailApplications = ({ applications }: PostDetailApplicationsProps) => {
  if (!applications || applications.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="bg-[var(--card)] rounded-3xl shadow-2xl p-8 border border-[var(--primary)]/30"
    >
      <h2 className="text-4xl font-bold text-[var(--text)] mb-6 flex items-center">
        <FaUsers className="text-[var(--accent)] mr-3" /> Candidatures ({applications.length})
      </h2>
      <ul className="space-y-6">
        {applications.map((app) => (
          <motion.li
            key={app._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--background)]/50 p-4 rounded-xl shadow-md"
          >
            <p className="text-lg text-[var(--text)]">
              <strong className="text-[var(--accent)]">Montant :</strong> {app.bidAmount.toLocaleString()} DA
            </p>
            <p className="text-md text-[var(--muted)]">
              Statut :{" "}
              <span
                className={`font-bold ${
                  app.status === "accepted"
                    ? "text-[var(--success)]"
                    : app.status === "rejected"
                    ? "text-[var(--error)]"
                    : "text-[var(--accent)]"
                }`}
              >
                {app.status === "accepted" ? "Acceptée" : app.status === "rejected" ? "Rejetée" : "En attente"}
              </span>
            </p>
            <p className="text-sm text-[var(--muted)]">
              Postulé le : {new Date(app.appliedAt).toLocaleDateString()}
            </p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};