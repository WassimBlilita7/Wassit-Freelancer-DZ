import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Button } from "../ui/button";
import { getInspirationData, InspirationItem } from "./inspirationData";
import { useNavigate } from "react-router-dom";

interface InspirationSectionProps {
  isFreelancer: boolean;
}

export const InspirationSection = ({ isFreelancer }: InspirationSectionProps) => {
  const navigate = useNavigate();
  const inspirationItems = getInspirationData(isFreelancer);

  return (
    <section className="py-16">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-12"
        style={{ color: "var(--text)" }}
      >
        Inspirez-vous et passez à l’action
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {inspirationItems.map((item: InspirationItem, index: number) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="flex flex-col items-center p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ backgroundColor: "var(--card)" }}
          >
            <Lottie
              animationData={item.animation}
              loop
              style={{ width: 150, height: 150, marginBottom: "1rem" }}
            />
            <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>
              {item.title}
            </h3>
            <p className="text-center mb-4" style={{ color: "var(--muted)" }}>
              {item.description}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate(item.actionPath)}
                className="py-2 px-4 text-base bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary)]/90 hover:to-[var(--secondary)]/90"
                style={{ color: "var(--card)" }}
              >
                {item.actionText}
              </Button>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};