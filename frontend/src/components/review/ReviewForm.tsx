import React, { useState } from "react";
import StarRating from "../common/StarRating";
import { Button } from "../ui/button";
import { FaUserCircle } from "react-icons/fa";

interface ReviewFormProps {
  rating: number;
  comment: string;
  loading: boolean;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  freelancerAvatar?: string;
  freelancerName?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ rating, comment, loading, onRatingChange, onCommentChange, onSubmit, freelancerAvatar, freelancerName }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <form
      onSubmit={onSubmit}
      className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-white/30 dark:border-zinc-700/40 rounded-3xl shadow-2xl p-8 max-w-xl mx-auto animate-fade-in-up relative overflow-hidden"
      style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
    >
      {/* Gradient background blob */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full blur-2xl opacity-60 pointer-events-none" />
      {/* Header avec avatar */}
      <div className="flex flex-col items-center mb-6 z-10">
        <div className="relative group mb-2">
          {freelancerAvatar && !imgError ? (
            <img
              src={freelancerAvatar}
              alt={freelancerName || "Freelancer"}
              className="w-32 h-32 rounded-full border-4 border-[var(--profile-header-start)] object-cover shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:shadow-2xl animate-fade-in"
              style={{ background: "#f3f4f6" }}
              onError={() => setImgError(true)}
            />
          ) : (
            <FaUserCircle className="w-32 h-32 text-[var(--muted)] bg-zinc-100 rounded-full border-4 border-[var(--profile-header-start)] shadow-xl animate-fade-in" />
          )}
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-3 py-1 text-xs font-bold text-primary shadow-md border border-primary/30 animate-fade-in">
            {freelancerName ? freelancerName.charAt(0).toUpperCase() : "F"}
          </div>
        </div>
        <h2 className="text-2xl font-extrabold mb-1 text-center text-zinc-900 dark:text-zinc-100 drop-shadow-lg">
          {freelancerName ? `Évaluer ${freelancerName}` : "Laissez un avis sur votre expérience"}
        </h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Votre retour est précieux !</span>
      </div>
      {/* Étoiles animées */}
      <div className="flex flex-col items-center mb-6 z-10">
        <StarRating rating={rating} onRatingChange={onRatingChange} editable size={56} />
        <span className="mt-2 text-lg text-yellow-500 font-semibold animate-pulse">{rating} / 5</span>
      </div>
      {/* Textarea stylisé */}
      <textarea
        className="w-full min-h-[110px] rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 mb-6 focus:outline-none focus:ring-4 focus:ring-primary/40 transition-all resize-none bg-gradient-to-br from-white/80 to-zinc-100/80 dark:from-zinc-900/80 dark:to-zinc-800/80 text-zinc-900 dark:text-zinc-100 shadow-inner placeholder-zinc-400 dark:placeholder-zinc-500"
        placeholder="Partagez votre expérience... (max 500 caractères)"
        value={comment}
        onChange={e => onCommentChange(e.target.value)}
        maxLength={500}
        required
      />
      {/* Bouton premium */}
      <Button
        type="submit"
        className="w-full py-3 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:ring-4 focus:ring-primary/30 active:scale-95"
        disabled={loading}
      >
        <span className="inline-flex items-center gap-2">
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
          ) : (
            <svg className="h-5 w-5 text-white animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          )}
          {loading ? "Envoi..." : "Envoyer mon avis"}
        </span>
      </Button>
    </form>
  );
};

export default ReviewForm; 