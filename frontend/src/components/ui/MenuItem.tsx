// src/components/ui/MenuItem.tsx
import { IconType } from "react-icons";
import { Player } from "@lottiefiles/react-lottie-player";
import hoverAnimation from "../../assets/lottie/hover.json"; // Télécharge une animation "hover"
import { motion } from "framer-motion";

interface MenuItemProps {
  text: string;
  icon: IconType;
  description?: string;
  onClick: () => void;
}

export const MenuItem = ({ text, icon: Icon, description, onClick }: MenuItemProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-[var(--primary)]/10"
    style={{ color: "var(--text)" }}
    onClick={onClick}
  >
    <div className="relative flex items-center">
      <Icon className="w-5 h-5 mr-3" />
      <Player
        autoplay
        loop
        src={hoverAnimation}
        style={{ height: "20px", width: "20px", position: "absolute", left: "-5px", opacity: 0 }}
        className="hover:opacity-100 transition-opacity"
      />
    </div>
    <div className="flex-1">
      <span className="font-medium">{text}</span>
      {description && (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {description}
        </p>
      )}
    </div>
  </motion.div>
);