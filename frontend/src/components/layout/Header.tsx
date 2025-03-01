// src/components/layout/Header.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { checkAuth } from "../../api/api";
import { FaBars, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { DropdownMenu } from "../ui/DropdownMenu";
import { getMenuItems } from "../../data/menuItems";
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
      className="fixed top-0 left-0 w-full shadow z-50 py-2" // Réduit la hauteur
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
              className="h-8 w-auto" // Réduit la taille du logo
              style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
            />
          </motion.div>
        </Link>

        <div className="hidden md:flex items-center space-x-4"> {/* Réduit l'espacement */}
          {isLoading ? (
            <span style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }}>Chargement...</span>
          ) : isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                className="text-sm hover:text-[var(--secondary)]" // Réduit la taille du texte
                onClick={() => navigate("/dashboard")}
                style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }}
              >
                Dashboard
              </Button>
              <DropdownMenu
                trigger={
                  <Button variant="ghost" className="p-1">
                    <img
                      src={logo}
                      alt="User Profile"
                      className="w-6 h-6 rounded-full" // Réduit la taille
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
                className="text-sm" // Réduit la taille
                style={{ borderColor: theme === "dark" ? "#FFFFFF" : "#333333", color: theme === "dark" ? "#FFFFFF" : "#333333" }}
                onClick={() => navigate("/login")}
              >
                Connexion
              </Button>
              <Button
                className="text-sm" // Réduit la taille
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
              <FaMoon className="w-4 h-4" style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }} />
            ) : (
              <FaSun className="w-4 h-4" style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }} />
            )}
          </motion.button>
        </div>

        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaBars className="w-5 h-5" style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }} />
          </Button>
        </div>
      </nav>

      {isMenuOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 w-2/3 h-full p-4 md:hidden"
          style={{
            background: theme === "light" ? "#E5E7EB" : "#1F2937",
            boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <div className="space-y-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full text-left text-sm"
                  style={{ color: theme === "dark" ? "#FFFFFF" : "#333333" }}
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-[var(--primary)]/10 rounded"
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
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
                  onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                >
                  Connexion
                </Button>
                <Button
                  className="w-full text-sm"
                  style={{ backgroundColor: "var(--secondary)", color: "#FFFFFF" }}
                  onClick={() => { navigate("/signup"); setIsMenuOpen(false); }}
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
      )}
    </header>
  );
};