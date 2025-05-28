import { useFreelancerStats } from "../../hooks/useClientStats";
import { getFreelancerReviews } from "../../api/api";
import { useEffect, useState } from "react";
import { FaStar, FaProjectDiagram, FaUsers, FaSmile, FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const FreelancerStats = ({ username, profile, id }: { username: string; profile: any; id: string }) => {
  const { stats, loading, error } = useFreelancerStats(username);
  const [reviews, setReviews] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getFreelancerReviews(id).then(setReviews);
    }
  }, [id]);

  if (loading) {
    return <div className="text-center p-4">Chargement des statistiques...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }
  if (!stats) {
    return <div className="text-center p-4">Aucune statistique disponible</div>;
  }
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl shadow-lg p-6 flex flex-col items-center border-2 border-[var(--primary)]/30">
          <FaProjectDiagram className="h-8 w-8 text-white mb-2" />
          <div className="text-2xl font-bold text-white">{stats.completedProjects}</div>
          <div className="text-xs text-white/80">Projets complétés</div>
        </div>
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl shadow-lg p-6 flex flex-col items-center border-2 border-[var(--accent)]/30">
          <FaSmile className="h-8 w-8 text-white mb-2" />
          <div className="text-2xl font-bold text-white">{stats.satisfactionRate}/5</div>
          <div className="flex mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`h-4 w-4 ${star <= Math.round(stats.satisfactionRate) ? "text-yellow-300" : "text-white/40"}`}
              />
            ))}
          </div>
          <div className="text-xs text-white/80">Taux de satisfaction</div>
        </div>
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl shadow-lg p-6 flex flex-col items-center border-2 border-[var(--secondary)]/30">
          <FaUsers className="h-8 w-8 text-white mb-2" />
          <div className="text-2xl font-bold text-white">{stats.totalClients}</div>
          <div className="text-xs text-white/80">Clients différents</div>
        </div>
      </div>
      <div className="bg-[var(--card)]/80 dark:bg-[var(--background)]/80 rounded-xl shadow-lg p-6 border-l-4 border-[var(--primary)]">
        <div className="flex items-center gap-2 mb-4">
          <FaCommentDots className="text-[var(--primary)]" />
          <span className="font-semibold text-[var(--primary)]">Avis des clients ({reviews.length})</span>
        </div>
        {reviews.length === 0 ? (
          <div className="text-[var(--muted)]">Aucun avis pour ce freelancer.</div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {reviews.map((review, idx) => (
              <li key={idx} className="py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-[var(--primary)]/80 text-white font-bold text-sm">
                    <FaStar className="text-yellow-300 mr-1" />{review.rating}/5
                  </span>
                  {review.client?.username && (
                    <button
                      type="button"
                      className="text-xs text-[var(--primary)] ml-2 font-semibold hover:underline hover:text-[var(--secondary)] transition-colors cursor-pointer"
                      onClick={() => navigate(`/profile/${review.client.username}`)}
                    >
                      par {review.client.username}
                    </button>
                  )}
                  {!review.client?.username && (
                    <span className="text-xs text-[var(--muted)] ml-2">par Client</span>
                  )}
                  {review.post?.title && review.post?._id && (
                    <button
                      type="button"
                      className="text-xs text-[var(--primary)] ml-2 font-semibold hover:underline hover:text-[var(--secondary)] transition-colors cursor-pointer"
                      onClick={() => navigate(`/post/${review.post._id}`)}
                    >
                      Projet : {review.post.title}
                    </button>
                  )}
                </div>
                <div className="bg-[var(--background)]/80 dark:bg-[var(--card)]/80 rounded-lg px-4 py-2 text-[var(--text)] italic shadow-sm">
                  {review.comment}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}; 