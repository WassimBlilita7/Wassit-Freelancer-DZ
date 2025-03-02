// src/components/layout/MobileMenu.tsx
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { Button } from "../ui/button";
import { MenuItemData } from "../../data/menuItems";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItemData[];
  isAuthenticated: boolean;
  toggleTheme: () => void;
  theme: "light" | "dark";
  navigate: (path: string) => void;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  menuItems,
  isAuthenticated,
  toggleTheme,
  theme,
  navigate,
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 w-2/3 h-full p-4 md:hidden shadow-lg z-50"
      style={{
        background: theme === "light" ? "#E5E7EB" : "#1F2937",
        boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex justify-end mb-4">
        <Button variant="ghost" onClick={onClose}>
          <FaTimes className="w-6 h-6" style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }} />
        </Button>
      </div>
      <div className="space-y-3">
        {isAuthenticated ? (
          <>
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="p-2 hover:bg-[var(--primary)]/10 rounded flex items-center"
                onClick={() => {
                  item.action();
                  onClose();
                }}
                style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }}
              >
                <item.icon className="inline mr-2 w-4 h-4" /> {item.text}
              </div>
            ))}
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="w-full text-sm"
              style={{ borderColor: theme === "dark" ? "#FFFFFF" : "#333333", color: theme === "dark" ? "#FFFFFF" : "#333333" }}
              onClick={() => {
                navigate("/login");
                onClose();
              }}
            >
              Connexion
            </Button>
            <Button
              className="w-full text-sm"
              style={{ backgroundColor: "var(--secondary)", color: "#FFFFFF" }}
              onClick={() => {
                navigate("/signup");
                onClose();
              }}
            >
              Inscription
            </Button>
          </>
        )}
        <Button
          onClick={toggleTheme}
          className="w-full p-2 text-sm rounded-full hover:bg-[var(--primary)]/20"
          style={{ backgroundColor: "transparent", color: theme === "dark" ? "#FFFFFF" : "#333333" }}
        >
          {theme === "light" ? "Sombre" : "Clair"}
        </Button>
      </div>
    </motion.div>
  );
};