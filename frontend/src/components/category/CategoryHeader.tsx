// src/components/category/CategoryHeader.tsx
import { Category } from "@/types";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext"; // Assurez-vous que ce contexte existe

interface CategoryHeaderProps {
  category: Category;
}

export const CategoryHeader = ({ category }: CategoryHeaderProps) => {
  const { theme } = useContext(ThemeContext) || { theme: "light" }; // Pour dark/light
  const isDark = theme === "dark";

  // SVG moderne (simplifié, ajustez selon vos besoins)
  const svgColor = isDark ? "#ffffff" : "#333333";

  return (
    <div className="relative py-12 text-center">
      <h1
        className="text-4xl md:text-5xl font-extrabold mb-6"
        style={{ color: "var(--text)" }}
      >
        {category.name}
      </h1>
      <svg
        width="300"
        height="100"
        viewBox="0 0 300 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto"
      >
        <path
          d="M20 80 Q150 20 280 80 T 280 80"
          stroke={svgColor}
          strokeWidth="4"
          fill="none"
          opacity="0.8"
        />
        <circle cx="150" cy="50" r="10" fill={svgColor} />
      </svg>
    </div>
  );
};