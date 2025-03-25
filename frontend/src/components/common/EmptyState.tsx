import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";
import emptyAnimation from "../../assets/lottie/empty.json"; // Chemin vers l'animation

export const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-12"
    >
      {/* Animation Lottie */}
      <div className="w-95 h-96">
        <Player
          autoplay
          loop
          src={emptyAnimation}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Texte stylé */}
      <h3
        className="text-2xl font-medium text-[var(--muted)] mt-4 text-center"
        style={{ color: "var(--muted)" }}
      >
        Aucune offre disponible pour le moment.
      </h3>
    </motion.div>
  );
};