// src/pages/PostDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json"; // À ajouter
import notFoundAnimation from "../assets/lottie/empty.json"; // À ajouter
import { getPostById } from "../api/api";
import { PostData } from "../types";
import { useHome } from "../hooks/useHome";
import { PostDetailHeader } from "../components/posts/PostDetailHeader";
import { PostDetailInfo } from "../components/posts/PostDetailInfo";
import { PostDetailImage } from "../components/posts/PostDetailImage";
import { ApplyToPostForm } from "../components/posts/ApplyToPostForm";
import { Helmet } from 'react-helmet-async';

const PostDetails = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFreelancer } = useHome();

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const data = await getPostById(postId);
        setPost(data);
      } catch (err) {
        console.error("Erreur lors du chargement de l'offre:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Lottie animationData={loadingAnimation} style={{ width: 200, height: 200 }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <Lottie animationData={notFoundAnimation} style={{ width: 300, height: 300 }} />
        <p className="text-2xl font-extrabold text-[var(--text)] tracking-wider">Offre introuvable</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post ? `${post.title} | Projet | Wassit Freelance DZ` : 'Projet | Wassit Freelance DZ'}</title>
        <meta name="description" content={post ? post.description : 'Détail du projet sur Wassit Freelance DZ.'} />
        <meta property="og:title" content={post ? `${post.title} | Projet | Wassit Freelance DZ` : 'Projet | Wassit Freelance DZ'} />
        <meta property="og:description" content={post ? post.description : 'Détail du projet sur Wassit Freelance DZ.'} />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen bg-[var(--background)] py-16"
      >
        <div className="container mx-auto max-w-6xl px-6">
          <PostDetailHeader title={post.title} />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-4 space-y-8">
              <PostDetailInfo post={post} />
              {post.picture && <PostDetailImage picture={post.picture} title={post.title} />}
            </div>
            <div className="lg:col-span-1">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="sticky top-6"
              >
                <ApplyToPostForm postId={postId!} isFreelancer={isFreelancer || false} />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PostDetails;