// src/pages/home/Home.tsx
import { HeroSection } from "../../components/home/HeroSection";
import { FeaturesSection } from "../../components/home/FeaturesSection";
import { CallToActionSection } from "../../components/home/CallToActionSection";
import { useHome } from "../../hooks/useHome";
import { Loader } from "../../components/common/Loader";
import { motion } from "framer-motion";

export const Home = () => {
  const { loading, isAuthenticated, isFreelancer, navigate } = useHome();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto max-w-7xl px-6 py-12" // Taille augmentée à max-w-7xl
      >
        <HeroSection isFreelancer={isFreelancer} navigate={navigate} />
        <FeaturesSection />
        <CallToActionSection />
      </motion.div>
    </div>
  );
};