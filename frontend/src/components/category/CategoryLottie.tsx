// src/components/category/CategoryLottie.tsx
import { Player } from "@lottiefiles/react-lottie-player";
import { Category } from "@/types";

interface CategoryLottieProps {
  category: Category;
}

export const CategoryLottie = ({ category }: CategoryLottieProps) => {
  const getLottieAnimation = (name: string): string => {
    const normalizedName = name.toLowerCase();
    switch (normalizedName) {
      case "vente & commerce":
        return "/assets/lottie/sales.json"; // Ex : animation de commerce
      case "photographie & vidéo":
        return "/assets/lottie/photography.json"; // Ex : animation de caméra
      case "rédaction & traduction":
        return "/assets/lottie/writing.json"; // Ex : animation d’écriture
      case "marketing & publicité":
        return "/assets/lottie/marketing.json"; // Ex : animation de stats
      case "graphique & design":
        return "/assets/lottie/design.json"; // Ex : animation de dessin
      case "musique & audio":
        return "/assets/lottie/music.json"; // Ex : animation de notes
      case "programmation & tech":
        return "/assets/lottie/coding.json"; // Ex : animation de code
      case "finance":
        return "/assets/lottie/finance.json"; // Ex : animation de graphiques
      default:
        return "/assets/lottie/default.json"; // Animation générique
    }
  };

  const animationSrc = getLottieAnimation(category.name);

  return (
    <div className="flex justify-center mb-8">
      <Player
        autoplay
        loop
        src={animationSrc}
        style={{ height: "250px", width: "250px" }}
        className="drop-shadow-md"
      />
    </div>
  );
};