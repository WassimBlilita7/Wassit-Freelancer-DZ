// src/data/menuItems.ts
import { IconType } from "react-icons";
import { FaHome, FaUser, FaPlusCircle, FaSignOutAlt, FaList } from "react-icons/fa";

export interface MenuItemData {
  text: string;
  icon: IconType;
  action: () => void;
  description?: string;
  restrictedTo?: "client" | "freelancer";
}

export const getMenuItems = (navigate: (path: string) => void, isFreelancer: boolean): MenuItemData[] => {
  const allItems: MenuItemData[] = [
    {
      text: "Accueil",
      icon: FaHome,
      action: () => navigate("/"),
      description: "Retourner à la page principale",
    },
    {
      text: "Offres",
      icon: FaList,
      action: () => navigate("/all-posts"),
      description: "Voir toutes les offres disponibles",
    },
    {
      text: "Gérer mon profil",
      icon: FaUser,
      action: () => navigate("/profile"),
      description: "Modifier vos informations personnelles",
    },
    {
      text: "Publier une Offre",
      icon: FaPlusCircle,
      action: () => navigate("/new-project"),
      description: "Créer une nouvelle offre de projet",
      restrictedTo: "client",
    },
    {
      text: "Déconnexion",
      icon: FaSignOutAlt,
      action: () => navigate("/logout"),
      description: "Quitter votre session",
    },
  ];

  return allItems.filter((item) => {
    if (item.restrictedTo === "client" && isFreelancer) {
      return false;
    }
    return true;
  });
};