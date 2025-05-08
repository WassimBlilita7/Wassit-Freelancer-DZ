import { useState } from "react";
import { PostData } from "../../types";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaUserCircle } from "react-icons/fa";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { updateApplicationStatus } from "../../api/api";
import toast from "react-hot-toast";

interface ApplicationListProps {
  post: PostData;
  onApplicationUpdate: () => void;
}

export const ApplicationList = ({ post, onApplicationUpdate }: ApplicationListProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusUpdate = async (applicationId: string, status: "accepted" | "rejected") => {
    setLoading(applicationId);
    try {
      await updateApplicationStatus(post._id, applicationId, status);
      toast.success(`Application ${status === "accepted" ? "acceptée" : "rejetée"} avec succès`);
      onApplicationUpdate();
    } catch {
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setLoading(null);
    }
  };

  if (!post.applications || post.applications.length === 0) {
    return (
      <Card className="bg-[var(--card)] border border-[var(--muted)]">
        <CardContent className="p-6">
          <p className="text-center text-[var(--muted)]">Aucune candidature pour le moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--card)] border border-[var(--muted)]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[var(--header-text)]">
          Candidatures ({post.applications.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {post.applications.map((application) => (
          <motion.div
            key={application._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg border border-[var(--muted)]/20 bg-[var(--background)]/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {typeof application.freelancer === 'object' && application.freelancer !== null && 'profilePicture' in application.freelancer ? (
                  <img
                    src={(application.freelancer as { profilePicture?: string }).profilePicture}
                    alt={
                      (application.freelancer as { username?: string }).username || 'Freelancer'
                    }
                    className="w-10 h-10 rounded-full object-cover border border-[var(--muted)] shadow"
                    onError={(e) => {
                      e.currentTarget.src = "/default-profile.png";
                    }}
                  />
                ) : (
                  <FaUserCircle className="w-10 h-10 text-[var(--muted)]" />
                )}
                <div>
                  <h3 className="font-medium text-[var(--text)]">
                    {typeof application.freelancer === 'object' && application.freelancer !== null && 'username' in application.freelancer
                      ? (application.freelancer as { username?: string }).username
                      : "Utilisateur inconnu"}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    Montant proposé: {application.bidAmount.toLocaleString()} DZD
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {application.status === "pending" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[var(--success)] border-[var(--success)] hover:bg-[var(--success)]/10"
                      onClick={() => handleStatusUpdate(application._id, "accepted")}
                      disabled={loading === application._id}
                    >
                      <FaCheck className="mr-2" />
                      Accepter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[var(--error)] border-[var(--error)] hover:bg-[var(--error)]/10"
                      onClick={() => handleStatusUpdate(application._id, "rejected")}
                      disabled={loading === application._id}
                    >
                      <FaTimes className="mr-2" />
                      Rejeter
                    </Button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      application.status === "accepted"
                        ? "bg-[var(--success)]/10 text-[var(--success)]"
                        : "bg-[var(--error)]/10 text-[var(--error)]"
                    }`}
                  >
                    {application.status === "accepted" ? "Acceptée" : "Rejetée"}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-[var(--text)] mb-2">Lettre de motivation</h4>
              <p className="text-sm text-[var(--muted)]">{application.coverLetter}</p>
            </div>
            {application.cv && (
              <div className="mt-4">
                <a
                  href={application.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  Voir le CV
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}; 