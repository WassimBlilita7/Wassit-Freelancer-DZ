import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllPosts } from "../api/api";
import { PostData } from "../types";
import { WavyHeader } from "../components/category/WavyHeader";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUsers, FaArrowRight, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const MyApplicationsPage = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { isAuthenticated, profile } = useProfile();
  const isFreelancer = profile?.isFreelancer || false;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || isFreelancer) {
      navigate('/');
      return;
    }

    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        const postsWithApplications = data.filter(post => post.applications && post.applications.length > 0);
        setPosts(postsWithApplications);
        setFilteredPosts(postsWithApplications);
      } catch (err) {
        console.error("Erreur lors du chargement des posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isAuthenticated, isFreelancer, navigate]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.applications.some(app => app.status === filter)
      );
      setFilteredPosts(filtered);
    }
  }, [filter, posts]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Lottie animationData={loadingAnimation} style={{ width: 200, height: 200 }} />
      </div>
    );
  }

  const totalApplications = posts.reduce((acc, post) => acc + post.applications.length, 0);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <WavyHeader />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-[var(--header-text)] text-center md:text-left">
            Mes Candidatures Reçues
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaUsers className="text-[var(--primary)]" />
              <span className="text-lg font-semibold">{totalApplications} candidatures</span>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="accepted">Acceptées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <Lottie
                  animationData={loadingAnimation}
                  style={{ width: 200, height: 200 }}
                  className="mx-auto"
                />
                <p className="text-xl text-[var(--muted)] mt-4">
                  {filter === "all"
                    ? "Vous n'avez pas encore reçu de candidatures pour vos offres."
                    : "Aucune candidature ne correspond à ce filtre."}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-[var(--primary)]/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-[var(--text)] line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set(post.applications.map(app => app.status))).map(status => (
                            <Badge
                              key={status}
                              className={`${getStatusBadgeColor(status)}`}
                            >
                              {status === "pending" ? "En attente" :
                               status === "accepted" ? "Acceptée" :
                               status === "rejected" ? "Rejetée" : status}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FaUsers className="text-[var(--primary)]" />
                            <span className="text-[var(--muted)]">
                              {post.applications.length} candidature{post.applications.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          <Button
                            onClick={() => navigate(`/post/${post._id}/applications`)}
                            className="flex items-center space-x-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                          >
                            <span>Voir les candidatures</span>
                            <FaArrowRight />
                          </Button>
                        </div>
                        <p className="text-sm text-[var(--muted)] line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <FaMoneyBillWave className="text-[var(--primary)]" />
                            <span className="text-[var(--primary)] font-medium">
                              {post.budget.toLocaleString()} DA
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-[var(--muted)]" />
                            <span className="text-[var(--muted)]">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MyApplicationsPage; 