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
      title: "Une fusée pour vos ambitions",
      description: "Fini les complications : connectez-vous en un éclair aux projets qui vous font décoller",
    },
    {
      icon: <FaUsers className="text-[var(--secondary)] text-4xl" />,
      image: bestOffersImg,
      title: "Des opportunités qui parlent fort",
      description: "Plongez dans un vivier de talents et de missions taillées pour vos rêves",
    },
    {
      icon: <FaStar className="text-[var(--primary)] text-4xl" />,
      image: qualityImg,
      title: "L’excellence à chaque clic",
      description: "Collaborez en toute confiance avec des pros triés sur le volet pour des résultats qui bluffent",
    },
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "var(--text)" }}>
      Votre succès commence avec ces atouts !
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