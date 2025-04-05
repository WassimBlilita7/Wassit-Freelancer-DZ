import creativityAnimation from "../../assets/lottie/creativity.json"; // Assure-toi d'avoir ces fichiers Lottie
import collaborationAnimation from "../../assets/lottie/collaboration.json";
import successAnimation from "../../assets/lottie/success.json";

export interface InspirationItem {
  title: string;
  description: string;
  animation: object;
  actionText: string;
  actionPath: string;
}

export const getInspirationData = (isFreelancer: boolean): InspirationItem[] => {
  return isFreelancer
    ? [
        {
          title: "Libérez votre créativité",
          description: "Trouvez des projets qui stimulent votre imagination et mettez vos compétences en avant.",
          animation: creativityAnimation,
          actionText: "Explorer les projets",
          actionPath: "/all-posts",
        },
        {
          title: "Collaborez avec des visionnaires",
          description: "Travaillez avec des clients passionnés qui valorisent votre expertise.",
          animation: collaborationAnimation,
          actionText: "Voir les offres",
          actionPath: "/all-posts",
        },
        {
          title: "Célébrez vos succès",
          description: "Chaque projet terminé est une étape vers votre réussite. Continuez à briller !",
          animation: successAnimation,
          actionText: "Mon profil",
          actionPath: "/profile",
        },
      ]
    : [
        {
          title: "Donnez vie à vos idées",
          description: "Trouvez des freelancers talentueux pour transformer vos concepts en réalité.",
          animation: creativityAnimation,
          actionText: "Publier une offre",
          actionPath: "/new-project",
        },
        {
          title: "Bâtissez une équipe de rêve",
          description: "Collaborez avec des experts pour mener vos projets à bien.",
          animation: collaborationAnimation,
          actionText: "Trouver des talents",
          actionPath: "/all-posts",
        },
        {
          title: "Atteignez vos objectifs",
          description: "Chaque collaboration réussie rapproche votre vision du succès.",
          animation: successAnimation,
          actionText: "Commencer maintenant",
          actionPath: "/new-project",
        },
      ];
};