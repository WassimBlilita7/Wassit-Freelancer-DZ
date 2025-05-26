import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, addReview } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/common/Loader";
import ReviewForm from "../components/review/ReviewForm";
import ReviewSuccess from "../components/review/ReviewSuccess";
import { toast } from "react-hot-toast";
import successAnimation from "../assets/lottie/success.json";

const ReviewPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { currentUserId } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!postId) throw new Error("ID du projet manquant");
        const data = await getPostById(postId);
        setPost(data);
        setLoading(false);
        // Contrôle d'accès : seul le client, projet terminé, pas déjà review
        if (!data.client || String(data.client._id) !== String(currentUserId)) {
          toast.error("Accès refusé : vous n'êtes pas le client de ce projet.");
          navigate("/", { replace: true });
        } else if (data.reviewed) {
          toast.error("Vous avez déjà laissé un avis pour ce projet.");
          navigate(`/post/${postId}`);
        } else if (data.status !== "completed") {
          toast.error("Vous ne pouvez évaluer qu'un projet terminé.");
          navigate(`/post/${postId}`);
        }
      } catch (err: any) {
        setLoading(false);
        toast.error(err.message || "Erreur lors du chargement du projet");
        navigate("/", { replace: true });
      }
    };
    if (currentUserId) fetchData();
  }, [postId, currentUserId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !post.applications) return;
    setSubmitting(true);
    try {
      // Trouver le freelancer accepté
      const acceptedApp = post.applications.find((app: any) => app.status === "accepted");
      if (!acceptedApp) throw new Error("Aucun freelancer accepté pour ce projet");
      await addReview({
        freelancerId: acceptedApp.freelancer,
        postId: post._id,
        rating,
        comment,
      });
      toast.success("Votre avis a bien été envoyé ! Merci pour votre retour.");
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'envoi de l'avis");
    } finally {
      setSubmitting(false);
    }
  };

  let freelancerAvatar = undefined;
  let freelancerName = undefined;
  if (post && post.applications) {
    const acceptedApp = post.applications.find((app: any) => app.status === "accepted");
    if (acceptedApp && acceptedApp.freelancer && typeof acceptedApp.freelancer === "object") {
      freelancerName = acceptedApp.freelancer.username;
      // Priorité à profile.profilePicture, puis profilePicture
      freelancerAvatar = (acceptedApp.freelancer.profile && acceptedApp.freelancer.profile.profilePicture)
        ? acceptedApp.freelancer.profile.profilePicture
        : acceptedApp.freelancer.profilePicture || undefined;
      if (freelancerAvatar && !freelancerAvatar.startsWith("http")) {
        freelancerAvatar = `${import.meta.env.VITE_API_URL?.replace(/\/api.*/, "") || "http://localhost:5000"}/${freelancerAvatar}`;
      }
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-[300px]"><Loader /></div>;
  if (success) return <ReviewSuccess onClose={() => navigate(`/post/${postId}`)} animationData={successAnimation} />;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 animate-fade-in-up">
      <div className="w-full max-w-xl">
        <ReviewForm
          rating={rating}
          comment={comment}
          loading={submitting}
          onRatingChange={setRating}
          onCommentChange={setComment}
          onSubmit={handleSubmit}
          freelancerAvatar={freelancerAvatar}
          freelancerName={freelancerName}
        />
      </div>
    </div>
  );
};

export default ReviewPage; 