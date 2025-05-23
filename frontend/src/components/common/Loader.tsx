// src/components/common/Loader.tsx
import { motion } from "framer-motion";

export const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)]/50 backdrop-blur-sm z-50">
      <div className="relative">
        {/* Cercle extérieur */}
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-[var(--primary)]/20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Cercle intérieur */}
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-[var(--primary)] border-r-transparent border-b-transparent border-l-transparent"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Point central */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-[var(--primary)]"
          style={{ transform: "translate(-50%, -50%)" }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};