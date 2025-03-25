import { useState } from "react";
import { Category } from "../../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: Category[];
  onFilterChange: (categoryId: string | null) => void;
}

export const CategoryFilter = ({ categories, onFilterChange }: CategoryFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    onFilterChange(categoryId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <FaFilter className="w-4 h-4" />
            {selectedCategory
              ? categories.find((cat) => cat._id === selectedCategory)?.name || "Filtrer"
              : "Filtrer par catégorie"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-[var(--card)] border-[var(--muted)]">
          <DropdownMenuItem
            onClick={() => handleFilter(null)}
            className="hover:bg-pink-500/10 hover:text-pink-500 transition-colors duration-200"
          >
            Toutes les catégories
          </DropdownMenuItem>
          {categories.length > 0 ? (
            categories.map((category) => (
              <DropdownMenuItem
                key={category._id}
                onClick={() => handleFilter(category._id)}
                className="hover:bg-pink-500/10 hover:text-pink-500 transition-colors duration-200"
              >
                {category.name}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled className="text-[var(--muted)]">
              Aucune catégorie disponible
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};