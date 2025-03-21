// src/components/category/CategorySummary.tsx
import { Category } from "@/types";
import { CategoryCard } from "./CategoryCard";
import {
  FaShoppingCart,
  FaCamera,
  FaPen,
  FaBullhorn,
  FaPaintBrush,
  FaMusic,
  FaCode,
  FaChartLine,
} from "react-icons/fa";
import { ReactNode } from "react";

interface CategorySummaryProps {
  category: Category;
}

export const CategorySummary = ({ category }: CategorySummaryProps) => {
  const summaries: Record<string, { title: string; description: string; icon: ReactNode }[]> = {
    "vente & commerce": [
      { title: "Stratégie de vente", description: "Techniques pour booster les conversions.", icon: <FaShoppingCart /> },
      { title: "E-commerce", description: "Gestion de boutiques en ligne comme Shopify.", icon: <FaShoppingCart /> },
      { title: "Négociation", description: "Compétences pour conclure des deals.", icon: <FaShoppingCart /> },
      { title: "Analyse de marché", description: "Étude des tendances pour optimiser.", icon: <FaShoppingCart /> },
    ],
    "photographie & vidéo": [
      { title: "Photographie pro", description: "Portraits et paysages avec reflex.", icon: <FaCamera /> },
      { title: "Montage vidéo", description: "Création avec Premiere Pro ou Resolve.", icon: <FaCamera /> },
      { title: "Contenu réseaux", description: "Vidéos courtes pour TikTok ou IG.", icon: <FaCamera /> },
      { title: "Drone", description: "Prises de vue aériennes spectaculaires.", icon: <FaCamera /> },
    ],
    "rédaction & traduction": [
      { title: "Rédaction SEO", description: "Textes optimisés pour Google.", icon: <FaPen /> },
      { title: "Traduction", description: "Adaptation précise entre langues.", icon: <FaPen /> },
      { title: "Copywriting", description: "Textes persuasifs pour la pub.", icon: <FaPen /> },
      { title: "Recherche", description: "Contenus basés sur des données fiables.", icon: <FaPen /> },
    ],
    "marketing & publicité": [
      { title: "SEO", description: "Visibilité accrue sur les moteurs.", icon: <FaBullhorn /> },
      { title: "Publicité payante", description: "Campagnes sur Google et Meta.", icon: <FaBullhorn /> },
      { title: "Réseaux sociaux", description: "Stratégies pour engager les fans.", icon: <FaBullhorn /> },
      { title: "Analyse", description: "Optimisation via Google Analytics.", icon: <FaBullhorn /> },
    ],
    "graphique & design": [
      { title: "Logos", description: "Identités visuelles uniques.", icon: <FaPaintBrush /> },
      { title: "UI/UX", description: "Interfaces intuitives avec Figma.", icon: <FaPaintBrush /> },
      { title: "Illustration", description: "Visuels vectoriels créatifs.", icon: <FaPaintBrush /> },
      { title: "Branding", description: "Design cohérent pour les marques.", icon: <FaPaintBrush /> },
    ],
    "musique & audio": [
      { title: "Composition", description: "Création de pistes originales.", icon: <FaMusic /> },
      { title: "Mixage", description: "Équilibrage audio avec Pro Tools.", icon: <FaMusic /> },
      { title: "Jingles", description: "Sons courts pour la pub.", icon: <FaMusic /> },
      { title: "Podcasts", description: "Production audio de qualité.", icon: <FaMusic /> },
    ],
    "programmation & tech": [
      { title: "Développement web", description: "Sites avec React ou Django.", icon: <FaCode /> },
      { title: "Apps mobiles", description: "Solutions iOS/Android.", icon: <FaCode /> },
      { title: "IA", description: "Algorithmes intelligents en Python.", icon: <FaCode /> },
      { title: "Cybersécurité", description: "Protection des systèmes.", icon: <FaCode /> },
    ],
    "finance": [
      { title: "Comptabilité", description: "Gestion des livres avec QuickBooks.", icon: <FaChartLine /> },
      { title: "Investissement", description: "Stratégies pour maximiser les gains.", icon: <FaChartLine /> },
      { title: "Analyse financière", description: "Prévisions via Excel ou SAP.", icon: <FaChartLine /> },
      { title: "Fiscalité", description: "Optimisation des obligations fiscales.", icon: <FaChartLine /> },
    ],
  };

  const cards = summaries[category.name.toLowerCase()] || [
    { title: "Compétence 1", description: "Description générique.", icon: <FaCode /> },
    { title: "Compétence 2", description: "Description générique.", icon: <FaCode /> },
    { title: "Compétence 3", description: "Description générique.", icon: <FaCode /> },
    { title: "Compétence 4", description: "Description générique.", icon: <FaCode /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <CategoryCard
          key={index}
          title={card.title}
          description={card.description}
          icon={card.icon}
        />
      ))}
    </div>
  );
};