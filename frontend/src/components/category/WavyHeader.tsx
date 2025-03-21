// src/components/category/WavyHeader.tsx
import { motion } from "framer-motion";

export const WavyHeader = () => {
  return (
    <div className="w-full overflow-hidden relative">
      <motion.svg
        viewBox="0 0 1440 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "180px" }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Dégradé moderne */}
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "var(--primary)", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "var(--secondary)", stopOpacity: 0.8 }} />
          </linearGradient>
        </defs>

        {/* Vague principale avec courbes modernes */}
        <path
          d="M0 120C200 60 400 180 720 120C1040 60 1240 180 1440 120V180H0V180Z"
          fill="url(#waveGradient)"
        />
        {/* Vague secondaire pour profondeur */}
        <path
          d="M0 140C240 80 480 160 720 140C960 80 1200 160 1440 140V180H0V180Z"
          fill="var(--primary)"
          opacity="0.3"
        />
        {/* Petite vague pour détail */}
        <path
          d="M0 160C180 140 360 170 720 160C1080 140 1260 170 1440 160V180H0V180Z"
          stroke="var(--secondary)"
          strokeWidth="2"
          opacity="0.5"
        />
      </motion.svg>
    </div>
  );
};