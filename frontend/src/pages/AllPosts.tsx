// src/pages/AllPosts.tsx
import { useFetchPosts } from "../hooks/useFetchPosts";
import { PostCard } from "../components/posts/PostCard";
import { Loader } from "../components/common/Loader";
import { motion } from "framer-motion";

export const AllPosts = () => {
  const { posts, loading, error, isFreelancer } = useFetchPosts();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center py-8" style={{ color: "var(--error)" }}>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <main className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--text)" }}>
            Toutes les Offres
          </h1>
          {posts.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>Aucune offre disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} isFreelancer={isFreelancer} />
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};