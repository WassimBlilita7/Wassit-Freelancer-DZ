// src/components/home/FeaturesSection.tsx
import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaStar } from "react-icons/fa";

// Importation des images locales depuis assets/home/
import whyDzFreelancerImg from "../../assets/home/rocket.svg"; // Ajuste selon tes noms de fichiers
import bestOffersImg from "../../assets/home/bestOffersImg.svg";
import qualityImg from "../../assets/home/qualityImg.svg";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <FaRocket className="text-[var(--primary)] text-4xl" />,
      image: whyDzFreelancerImg,
      title: "Pourquoi DZFreelancer ?",
      description: "Une plateforme rapide et intuitive pour connecter les talents aux projets, conçue pour simplifier votre expérience.",
    },
    {
      icon: <FaUsers className="text-[var(--secondary)] text-4xl" />,
      image: bestOffersImg,
      title: "Écoutez les meilleures offres",
      description: "Accédez à une communauté active de freelancers et de clients, avec des opportunités adaptées à vos besoins.",
    },
    {
      icon: <FaStar className="text-[var(--primary)] text-4xl" />,
      image: qualityImg,
      title: "Qualité garantie",
      description: "Des profils vérifiés et des projets bien définis pour assurer des résultats exceptionnels à chaque collaboration.",
    },
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "var(--text)" }}>
        Ce qui nous distingue
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="flex flex-col items-center text-center p-6 rounded-xl shadow-lg"
            style={{ backgroundColor: "var(--card)" }}
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-auto max-h-48 object-contain mb-4" // Affiche l'image complète
            />
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>
              {feature.title}
            </h3>
            <p style={{ color: "var(--muted)" }}>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};