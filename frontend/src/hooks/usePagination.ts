import { useState, useMemo } from "react";
import { PostData } from "../types";

// Définir une interface pour le type de retour
interface PaginationResult {
  currentPage: number;
  setCurrentPage: (page: number) => void; // Ajouté explicitement
  pageCount: number;
  paginatedItems: PostData[];
  handlePageChange: ({ selected }: { selected: number }) => void;
}

export const usePagination = (items: PostData[], itemsPerPage: number): PaginationResult => {
  const [currentPage, setCurrentPage] = useState(0);

  // Calculer le nombre total de pages
  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Obtenir les éléments de la page actuelle
  const paginatedItems = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Fonction pour changer de page
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return {
    currentPage,
    setCurrentPage, // Explicitement inclus
    pageCount,
    paginatedItems,
    handlePageChange,
  };
};