import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllPosts } from "../api/api";
import { PostData } from "../types";
import { WavyHeader } from "../components/category/WavyHeader";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUsers, FaArrowRight } from "react-icons/fa";

const MyApplicationsPage = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, profile } = useProfile();
  const isFreelancer = profile?.isFreelancer || false;
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas connecté ou est un freelancer
    if (!isAuthenticated || isFreelancer) {
      navigate('/');
      return;
    }

    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        // Filtrer uniquement les posts qui ont des applications
        const postsWithApplications = data.filter(post => post.applications && post.applications.length > 0);
        setPosts(postsWithApplications);
      } catch (err) {
        console.error("Erreur lors du chargement des posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isAuthenticated, isFreelancer, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Lottie animationData={loadingAnimation} style={{ width: 200, height: 200 }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <WavyHeader />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-6 py-12"
      >
        <h1 className="text-4xl font-bold text-[var(--header-text)] mb-8 text-center">
          Mes Candidatures Reçues
        </h1>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-[var(--muted)]">
              Vous n'avez pas encore reçu de candidatures pour vos offres.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[var(--text)] line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FaUsers className="text-[var(--primary)]" />
                          <span className="text-[var(--muted)]">
                            {post.applications.length} candidature{post.applications.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <Button
                          onClick={() => navigate(`/post/${post._id}/applications`)}
                          className="flex items-center space-x-2"
                        >
                          <span>Voir les candidatures</span>
                          <FaArrowRight />
                        </Button>
                      </div>
                      <p className="text-sm text-[var(--muted)] line-clamp-2">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--primary)] font-medium">
                          {post.budget.toLocaleString()} DA
                        </span>
                        <span className="text-[var(--muted)]">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyApplicationsPage; 