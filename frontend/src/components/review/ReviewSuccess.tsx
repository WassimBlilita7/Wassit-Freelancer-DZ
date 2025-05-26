/* eslint-disable @typescript-eslint/no-require-imports */
import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";

interface ReviewSuccessProps {
  onClose?: () => void;
  animationData?: any;
}

const ReviewSuccess: React.FC<ReviewSuccessProps> = ({ onClose, animationData }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-10 animate-fade-in-up backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border border-white/30 dark:border-zinc-700/40 rounded-3xl shadow-2xl relative overflow-hidden max-w-lg mx-auto">
      {/* Gradient blob */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-br from-green-400/40 to-yellow-300/40 rounded-full blur-2xl opacity-60 pointer-events-none" />
      <Player
        autoplay
        loop={false}
        src={animationData || require("../../assets/lottie/pay.json")}
        style={{ height: 180, width: 180 }}
        speed={1.2}
      />
      <h2 className="text-3xl font-extrabold text-green-600 mt-6 mb-2 drop-shadow-lg text-center">Merci pour votre avis !</h2>
      <p className="text-zinc-700 dark:text-zinc-200 text-center mb-4 text-lg">Votre retour aide la communauté à choisir les meilleurs talents.<br/>Vous faites la différence !</p>
      {onClose && (
        <button
          className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:ring-4 focus:ring-primary/30 active:scale-95"
          onClick={onClose}
        >
          Retour au projet
        </button>
      )}
    </div>
  );
};

export default ReviewSuccess; 