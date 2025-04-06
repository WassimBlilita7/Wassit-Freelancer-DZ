// src/components/home/CallToActionSection.tsx
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "../ui/button";

// Importation des SVG locaux depuis assets/home/
import ctaLightSvg from "../../assets/home/cta-light.svg"; // Ajuste selon ton arborescence
import ctaDarkSvg from "../../assets/home/cta-dark.svg";

export const CallToActionSection = () => {
  const { theme } = useTheme();

  return (
    <section className="py-16 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-2xl p-8">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="md:w-1/2 space-y-6"
      >
        <h2 className="text-4xl font-bold" style={{ color: "var(--text)" }}>
        Faites de vos idées une réalité éclatante !
        </h2>
        <p className="text-lg" style={{ color: "var(--muted)" }}>
        Vos projets méritent les meilleurs : rejoignez une communauté vibrante et passez à l’action maintenant !
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="py-3 px-6 text-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90"
            style={{ color: "var(--card)" }}
          >
            Commencer maintenant <FaArrowRight className="ml-2" />
          </Button>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="md:w-1/2 mt-8 md:mt-0"
      >
        <img
          src={theme === "dark" ? ctaDarkSvg : ctaLightSvg}
          alt="Make it Real"
          className="w-full h-auto max-h-[400px] object-cover rounded-lg"
        />
      </motion.div>
    </section>
  );
};