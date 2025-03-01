/* eslint-disable @typescript-eslint/prefer-as-const */
// src/data/menuItems.ts
import { IconType } from "react-icons";
import { FaHome, FaUser, FaPlusCircle, FaSignOutAlt } from "react-icons/fa";

export interface MenuItemData {
  text: string;
  icon: IconType;
  action: () => void;
  description?: string;
  restrictedTo?: "client" | "freelancer";
}

export const getMenuItems = (navigate: (path: string) => void, isFreelancer: boolean): MenuItemData[] => [
  {
    text: "Accueil",
    icon: FaHome,
    action: () => navigate("/"),
    description: "Retourner à la page principale",
  },
  {
    text: "Mon Profil",
    icon: FaUser,
    action: () => navigate("/profile"),
    description: "Voir vos informations personnelles",
  },
  {
    text: "Publier une Offre",
    icon: FaPlusCircle,
    action: () => navigate("/new-project"),
    description: "Créer une nouvelle offre de projet",
    restrictedTo: "client" as "client",
  },
  {
    text: "Déconnexion",
    icon: FaSignOutAlt,
    action: () => navigate("/logout"),
    description: "Quitter votre session",
  },
].filter((item: MenuItemData) => !item.restrictedTo || (item.restrictedTo === "freelancer" ? isFreelancer : !isFreelancer));