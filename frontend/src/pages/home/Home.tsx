// src/pages/home/Home.tsx
import { HeroSection } from "../../components/home/HeroSection";
import { FeaturesSection } from "../../components/home/FeaturesSection";
import { CallToActionSection } from "../../components/home/CallToActionSection";
import { StatsSection } from "../../components/home/StatsSection";
import { InspirationSection } from "../../components/home/InspirationSection";
import { useHome } from "../../hooks/useHome";
import { Loader } from "../../components/common/Loader";
import { motion } from "framer-motion";

export const Home = () => {
  const { loading, isAuthenticated, isFreelancer, navigate } = useHome();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <p style={{ color: "var(--text)" }}>
          Veuillez vous connecter pour accéder à cette page.
        </p>
      </div>
    );
  }

  if (isFreelancer === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <p style={{ color: "var(--text)" }}>
          Erreur : Impossible de déterminer votre rôle. Veuillez réessayer.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto max-w-7xl px-6 py-12"
      >
        <HeroSection isFreelancer={isFreelancer} navigate={navigate} />
        <FeaturesSection />
        <StatsSection />
        <InspirationSection isFreelancer={isFreelancer} />
        <CallToActionSection />
      </motion.div>
    </div>
  );
};