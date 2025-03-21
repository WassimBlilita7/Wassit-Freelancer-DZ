// src/components/category/CategoryCard.tsx
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export const CategoryCard = ({ title, description, icon }: CategoryCardProps) => {
  return (
    <motion.div
      className="bg-[var(--card)] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-[var(--muted)]"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <div className="text-[var(--primary)] text-3xl mr-3">{icon}</div>
        <h3 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
          {title}
        </h3>
      </div>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {description}
      </p>
    </motion.div>
  );
};