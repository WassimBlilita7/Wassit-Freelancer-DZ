// src/components/home/HeroSection.tsx
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "../ui/button";

// Importation des SVG locaux depuis assets/home/
import heroLightSvg from "../../assets/home/hero-light.svg" // Ajuste selon ton arborescence
import heroDarkSvg from "../../assets/home/hero-dark.svg" 

interface HeroSectionProps {
  isFreelancer: boolean;
  navigate: (path: string) => void;
}

export const HeroSection = ({ isFreelancer, navigate }: HeroSectionProps) => {
  const { theme } = useTheme();

  return (
    <section className="flex flex-col md:flex-row items-center justify-between py-16">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="md:w-1/2 space-y-6"
      >
        <h1 className="text-5xl font-bold leading-tight" style={{ color: "var(--text)" }}>
          {isFreelancer
            ? "Lancez votre carrière freelance au sommet !"
            : "Transformez vos rêves en succès avec les pros !"}
        </h1>
        <p className="text-lg" style={{ color: "var(--muted)" }}>
        Des missions qui boostent votre talent, des clients qui valorisent vos idées : votre prochaine grande opportunité vous attend ici 🩷
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => navigate(isFreelancer ? "/all-posts" : "/new-project")}
            className="py-3 px-6 text-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary)]/90 hover:to-[var(--secondary)]/90"
            style={{ color: "var(--card)" }}
          >
            {isFreelancer ? "Explorer les projets" : "Publier une offre"} <FaArrowRight className="ml-2" />
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
          src={theme === "dark" ? heroDarkSvg : heroLightSvg}
          alt="Freelance Illustration"
          className="w-full h-auto max-h-[500px] object-cover"
        />
      </motion.div>
    </section>
  );
};