// src/components/category/CategoryDefinition.tsx
import { Category } from "@/types";

interface CategoryDefinitionProps {
  category: Category;
}

export const CategoryDefinition = ({ category }: CategoryDefinitionProps) => {
  const categoryDescriptions: Record<string, string> = {
    "vente & commerce": "Le domaine de la vente et du commerce englobe les stratégies et compétences nécessaires pour promouvoir, négocier et conclure des transactions de biens ou de services. Les professionnels de ce secteur maîtrisent les techniques de vente en ligne et en personne, la gestion de la relation client (CRM), ainsi que l’analyse des tendances du marché. Que ce soit via des plateformes e-commerce comme Shopify ou des approches traditionnelles, ils excellent dans la persuasion, la gestion des stocks et l’optimisation des profits, jouant un rôle clé dans la croissance économique des entreprises.",
    "photographie & vidéo": "La photographie et la vidéo capturent des moments précieux et racontent des histoires visuelles à travers des techniques avancées et un équipement spécialisé. Les photographes et vidéastes utilisent des appareils comme les reflex numériques, des drones ou des caméras 4K, combinés à des logiciels de retouche tels que Lightroom, Premiere Pro ou DaVinci Resolve. Ce domaine couvre la réalisation de portraits, de vidéos promotionnelles, de documentaires ou de contenu pour les réseaux sociaux, nécessitant un sens aigu de l’esthétique, de la lumière et du montage pour répondre aux attentes des clients.",
    "rédaction & traduction": "La rédaction et la traduction réunissent l’art d’écrire et de transposer des contenus d’une langue à une autre avec précision et fluidité. Les rédacteurs produisent des textes variés, comme des articles de blog, des livres blancs ou des scripts, souvent optimisés pour le SEO, tandis que les traducteurs adaptent ces contenus pour des audiences internationales en respectant les nuances culturelles. Ce secteur demande une maîtrise linguistique exceptionnelle, une recherche approfondie et l’utilisation d’outils comme DeepL ou Grammarly pour garantir qualité et cohérence.",
    "marketing & publicité": "Le marketing et la publicité forment un domaine dynamique visant à promouvoir des marques, produits ou services à travers des campagnes percutantes. Les experts utilisent des outils comme Google Ads, Meta Ads ou HubSpot pour cibler les audiences, analyser les données via Google Analytics, et optimiser le retour sur investissement (ROI). Du référencement naturel (SEO) aux influenceurs sur Instagram, ce secteur combine créativité et stratégie pour capter l’attention dans un monde numérique saturé, tout en s’adaptant aux évolutions des algorithmes et des comportements consommateurs.",
    "graphique & design": "Le graphique et le design transforment des idées en visuels captivants, allant des logos aux interfaces utilisateur (UI/UX). Les designers maîtrisent des logiciels comme Adobe Photoshop, Illustrator et Figma pour créer des affiches, des emballages ou des sites web esthétiques et fonctionnels. Ce domaine exige une compréhension profonde de la typographie, des couleurs et de l’ergonomie, ainsi qu’une capacité à collaborer avec des développeurs ou des marketeurs pour produire des designs qui renforcent l’identité visuelle des entreprises.",
    "musique & audio": "La musique et l’audio englobent la création, l’enregistrement et le montage de sons pour divers projets, comme des jingles publicitaires, des podcasts ou des bandes-son de films. Les professionnels utilisent des stations de travail audio (DAW) telles que Ableton Live, FL Studio ou Pro Tools pour composer, mixer et masteriser des pistes. Ce secteur demande une oreille musicale affûtée, une connaissance des techniques d’ingénierie sonore et une créativité pour produire des expériences auditives immersives adaptées aux besoins spécifiques des clients.",
    "programmation & tech": "La programmation et la technologie sont au cœur de l’innovation numérique, permettant de concevoir des logiciels, des applications ou des systèmes complexes. Les développeurs travaillent avec des langages comme Python, JavaScript, C# ou Go, et des frameworks comme React, Django ou .NET pour résoudre des problèmes techniques. Ce domaine couvre le développement web, mobile, l’intelligence artificielle, la cybersécurité et plus encore, nécessitant une logique rigoureuse, une mise à jour constante des compétences et une passion pour les nouvelles technologies.",
    "finance": "La finance regroupe les activités liées à la gestion de l’argent, des investissements et des budgets, tant pour les particuliers que pour les entreprises. Les experts en finance utilisent des outils comme Excel, QuickBooks ou SAP pour analyser les états financiers, prévoir les flux de trésorerie et conseiller sur les stratégies d’investissement. Ce secteur inclut la comptabilité, la planification fiscale, la gestion de portefeuilles et l’analyse des risques, jouant un rôle crucial dans la prise de décisions économiques éclairées et la maximisation de la rentabilité.",
  };

  const getDescription = (name: string): string => {
    const normalizedName = name.toLowerCase();
    return (
      categoryDescriptions[normalizedName] ||
      `Le domaine de ${normalizedName} regroupe un ensemble de compétences spécialisées et de pratiques innovantes, essentielles pour répondre aux exigences variées des projets contemporains dans un environnement freelance dynamique. Les professionnels de ce secteur adaptent leurs approches pour offrir des solutions personnalisées, combinant expertise technique, créativité et une compréhension approfondie des besoins des clients dans un marché en constante évolution.`
    );
  };

  const description = getDescription(category.name);

  return (
    <div className="mt-8 bg-[var(--card)] p-6 rounded-xl shadow-lg border border-[var(--muted)]">
      <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--primary)" }}>
        À propos de {category.name}
      </h2>
      <p className="text-base leading-relaxed" style={{ color: "var(--text)" }}>
        {description}
      </p>
    </div>
  );
};