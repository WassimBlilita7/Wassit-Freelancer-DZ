import { useState } from "react";
import { motion } from "framer-motion";
import { PostData } from "../../types";
import { updateApplicationStatus } from "../../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { FaUser, FaCheck, FaTimes, FaEnvelope, FaFilePdf, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface ApplicationListProps {
  post: PostData;
  onApplicationUpdate: () => void;
  filter?: string;
}

export const ApplicationList = ({ post, onApplicationUpdate, filter = "all" }: ApplicationListProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStatusUpdate = async (applicationId: string, status: "accepted" | "rejected") => {
    if (!post._id) return;
    setLoading(applicationId);
    try {
      await updateApplicationStatus(post._id, applicationId, status);
      toast.success(`Candidature ${status === "accepted" ? "acceptée" : "rejetée"} avec succès`);
      onApplicationUpdate();
    } catch {
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setLoading(null);
    }
  };

  const handleDownloadCV = (cvUrl: string, freelancerName: string) => {
    if (!cvUrl) {
      toast.error("CV non disponible");
      return;
    }
    window.open(cvUrl, "_blank");
    toast.success("Le CV s'est ouvert dans un nouvel onglet");
  };

  const handleFreelancerClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const filteredApplications = post.applications.filter(app => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "accepted":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  if (filteredApplications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <FaEnvelope className="w-16 h-16 text-[var(--muted)] mx-auto mb-4" />
          <p className="text-xl text-[var(--muted)]">
            {filter === "all"
              ? "Aucune candidature reçue pour cette offre."
              : "Aucune candidature ne correspond à ce filtre."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredApplications.map((application) => (
        <motion.div
          key={application._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border-2 hover:border-[var(--primary)]/20 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-[var(--primary)]/5 to-[var(--secondary)]/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                    <FaUser className="text-[var(--primary)] text-xl" />
                  </div>
                  <div>
                    <CardTitle 
                      className="text-lg font-semibold text-[var(--text)] cursor-pointer hover:text-[var(--primary)] transition-colors"
                      onClick={() => handleFreelancerClick(typeof application.freelancer === 'object' && application.freelancer !== null && 'username' in application.freelancer ? (application.freelancer as { username: string }).username : "Utilisateur inconnu")}
                    >
                      {typeof application.freelancer === 'object' && application.freelancer !== null && 'username' in application.freelancer
                        ? (application.freelancer as { username: string }).username
                        : "Utilisateur inconnu"}
                    </CardTitle>
                    <p className="text-sm text-[var(--muted)]">
                      Postulé le {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadgeColor(application.status)}>
                    {application.status === "pending"
                      ? "En attente"
                      : application.status === "accepted"
                      ? "Acceptée"
                      : "Rejetée"}
                  </Badge>
                  {(application.status === "accepted" || application.status === "rejected") && (
                    <Badge className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 flex items-center gap-1">
                      <FaLock className="w-3 h-3" />
                      <span>Verrouillé</span>
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-[var(--muted)] mb-2">Lettre de motivation</h3>
                  <p className="text-[var(--text)] line-clamp-3">{application.coverLetter}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[var(--muted)] mb-2">Montant proposé</h3>
                  <p className="text-2xl font-bold text-[var(--primary)]">
                    {application.bidAmount.toLocaleString()} DA
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-[var(--muted)]/20">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleDownloadCV(application.cv, typeof application.freelancer === 'object' && application.freelancer !== null && 'username' in application.freelancer ? (application.freelancer as { username: string }).username : "Utilisateur inconnu")}
                  disabled={downloading === application._id}
                >
                  {downloading === application._id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                      <span>Téléchargement...</span>
                    </>
                  ) : (
                    <>
                      <FaFilePdf className="text-[var(--primary)]" />
                      <span>Télécharger le CV</span>
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-3">
                  {application.status === "pending" ? (
                    <>
                      <Button
                        variant="destructive"
                        className="flex items-center gap-2"
                        onClick={() => handleStatusUpdate(application._id, "rejected")}
                        disabled={loading === application._id}
                      >
                        <FaTimes />
                        <span>Rejeter</span>
                      </Button>
                      <Button
                        className="flex items-center gap-2 bg-[var(--success)] hover:bg-[var(--success)]/90"
                        onClick={() => handleStatusUpdate(application._id, "accepted")}
                        disabled={loading === application._id}
                      >
                        <FaCheck />
                        <span>Accepter</span>
                      </Button>
                    </>
                  ) : (
                    <div className="text-sm text-[var(--muted)] flex items-center gap-2">
                      <FaLock className="w-4 h-4" />
                      <span>Cette candidature ne peut plus être modifiée</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}; 