// src/components/layout/Header.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { checkAuth } from "../../api/api";
import { FaBars, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { DropdownMenu } from "../ui/DropdownMenu";
import { getMenuItems } from "../../data/menuItems";
import { MobileMenu } from "./MobileMenu";
import logo from "../../assets/logo/logo-transparent-png.png";
import { motion } from "framer-motion";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        const response = await checkAuth();
        setIsAuthenticated(true);
        setIsFreelancer(response.userData?.isFreelancer || false);
      } catch (err) {
        setIsAuthenticated(false);
        console.error("Erreur d'authentification:", err);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, []);

  const menuItems = getMenuItems(navigate, isFreelancer);

  return (
    <header
      className="fixed top-0 left-0 w-full shadow z-50 py-2"
      style={{
        background: theme === "light"
          ? "linear-gradient(to right, #E5E7EB, #2770D1)"
          : "linear-gradient(to right, #1F2937, #C40D6C)",
      }}
    >
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <motion.div whileHover={{ scale: 1.05 }}>
            <img
              src={logo}
              alt="Freelance DZ Logo"
              className="h-8 w-auto"
              style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
            />
          </motion.div>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {isLoading ? (
            <span style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }}>Chargement...</span>
          ) : isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                className="text-sm hover:text-[var(--secondary)]"
                onClick={() => navigate("/dashboard")}
                style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-sm hover:text-[var(--secondary)]"
                onClick={() => navigate("/all-posts")}
                style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }}
              >
                Offres
              </Button>
              <DropdownMenu
                trigger={
                  <Button variant="ghost" className="p-1">
                    <img
                      src={logo}
                      alt="User Profile"
                      className="w-6 h-6 rounded-full"
                      style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
                    />
                  </Button>
                }
                items={menuItems}
              />
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="text-sm"
                style={{ borderColor: theme === "dark" ? "#FFFFFF" : "#333333", color: theme === "dark" ? "#FFFFFF" : "#333333" }}
                onClick={() => navigate("/login")}
              >
                Connexion
              </Button>
              <Button
                className="text-sm"
                style={{ backgroundColor: "var(--secondary)", color: "#FFFFFF" }}
                onClick={() => navigate("/signup")}
              >
                Inscription
              </Button>
            </>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={toggleTheme}
            className="p-1 rounded-full hover:bg-[var(--primary)]/20"
            style={{ backgroundColor: "transparent" }}
          >
            {theme === "light" ? (
              <FaMoon className="w-4 h-4" style={{ color: "#333333" }} />
            ) : (
              <FaSun className="w-4 h-4" style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }} />
            )}
          </motion.button>
        </div>

        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setIsMenuOpen(true)}>
            <FaBars className="w-5 h-5" style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }} />
          </Button>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menuItems={menuItems}
        isAuthenticated={isAuthenticated}
        toggleTheme={toggleTheme}
        theme={theme}
        navigate={navigate}
      />
    </header>
  );
};