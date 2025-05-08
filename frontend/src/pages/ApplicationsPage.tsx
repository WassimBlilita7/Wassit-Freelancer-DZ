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
        <h1 className="text-2xl font-bold text-[var(--text)] mb-4">Offre non trouvée</h1>
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </div>
    );
  }

  const totalApplications = post.applications.length;
  const pendingApplications = post.applications.filter(app => app.status === "pending").length;
  const acceptedApplications = post.applications.filter(app => app.status === "accepted").length;
  const rejectedApplications = post.applications.filter(app => app.status === "rejected").length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Retour</span>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-[var(--primary)]/5 to-[var(--secondary)]/5">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-[var(--muted)]">Total des candidatures</h3>
              <p className="text-2xl font-bold text-[var(--text)]">{totalApplications}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500/5 to-yellow-600/5">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-[var(--muted)]">En attente</h3>
              <p className="text-2xl font-bold text-yellow-500">{pendingApplications}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500/5 to-green-600/5">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-[var(--muted)]">Acceptées</h3>
              <p className="text-2xl font-bold text-green-500">{acceptedApplications}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-500/5 to-red-600/5">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-[var(--muted)]">Rejetées</h3>
              <p className="text-2xl font-bold text-red-500">{rejectedApplications}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[var(--text)]">{post.title}</h1>
          <div className="flex items-center gap-2">
            <FaFilter className="text-[var(--muted)]" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les candidatures</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="accepted">Acceptées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ApplicationList post={post} onApplicationUpdate={() => setPost({ ...post })} filter={filter} />
      </motion.div>
    </div>
  );
}; 