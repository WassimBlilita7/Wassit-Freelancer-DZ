import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json";
import { ApplicationList } from "../components/posts/ApplicationList";
import { getPostById } from "../api/api";
import { PostData } from "../types";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { FaArrowLeft, FaFilter } from "react-icons/fa";
import { EmptyState } from "../components/common/EmptyState";

export const ApplicationsPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const data = await getPostById(postId);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Lottie animationData={loadingAnimation} loop={true} style={{ width: 200 }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-[var(--primary)] mb-4">Offre non trouvée</h1>
        <Button onClick={() => navigate(-1)} className="bg-[var(--primary)] text-white">Retour</Button>
      </div>
    );
  }

  const totalApplications = post.applications.length;
  const pendingApplications = post.applications.filter(app => app.status === "pending").length;
  const acceptedApplications = post.applications.filter(app => app.status === "accepted").length;
  const rejectedApplications = post.applications.filter(app => app.status === "rejected").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-blue-100/40 dark:from-[var(--background)] dark:to-blue-950/40 py-8 px-2 md:px-0">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2 text-[var(--primary)] hover:bg-[var(--primary)]/10"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Retour</span>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-200/60 to-blue-400/30 dark:from-blue-900/40 dark:to-blue-700/20 transition-all hover:scale-[1.03]">
            <CardContent className="p-4 flex flex-col items-center">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Total</h3>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalApplications}</p>
            </CardContent>
          </Card>
          <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-100/60 to-yellow-300/30 dark:from-yellow-900/40 dark:to-yellow-700/20 transition-all hover:scale-[1.03]">
            <CardContent className="p-4 flex flex-col items-center">
              <h3 className="text-sm font-medium text-yellow-700 dark:text-yellow-200">En attente</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">{pendingApplications}</p>
            </CardContent>
          </Card>
          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-100/60 to-green-300/30 dark:from-green-900/40 dark:to-green-700/20 transition-all hover:scale-[1.03]">
            <CardContent className="p-4 flex flex-col items-center">
              <h3 className="text-sm font-medium text-green-700 dark:text-green-200">Acceptées</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">{acceptedApplications}</p>
            </CardContent>
          </Card>
          <Card className="shadow-xl border-0 bg-gradient-to-br from-red-100/60 to-red-300/30 dark:from-red-900/40 dark:to-red-700/20 transition-all hover:scale-[1.03]">
            <CardContent className="p-4 flex flex-col items-center">
              <h3 className="text-sm font-medium text-red-700 dark:text-red-200">Rejetées</h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-300">{rejectedApplications}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--header-text)] drop-shadow-sm">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 bg-[var(--card)]/80 rounded-lg px-3 py-2 shadow border border-[var(--muted)]/20">
            <FaFilter className="text-[var(--muted)]" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] bg-transparent border-0 focus:ring-0">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--card)]">
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="accepted">Acceptées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {post.applications.filter(app => filter === "all" || app.status === filter).length === 0 ? (
            <EmptyState />
          ) : (
            <ApplicationList post={post} onApplicationUpdate={() => setPost({ ...post })} filter={filter} />
          )}
        </motion.div>
      </div>
    </div>
  );
}; 