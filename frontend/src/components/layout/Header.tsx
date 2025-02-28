// src/components/layout/Header.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { checkAuth } from "../../api/api";
import { FaSun, FaMoon, FaUserCircle, FaBars } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import logo from "../../assets/logo/logo-transparent-png.png"; // Import du logo

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
        console.error("Erreur d'authentification:", err);
      }
    };
    verifyAuth();
  }, []);

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <header
      className="fixed top-0 left-0 w-full shadow z-50"
      style={{ backgroundColor: "var(--card)" }}
    >
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Freelance DZ Logo"
            className="h-13 w-auto" // Ajuste la taille selon tes besoins
            style={{ filter: theme === "dark" ? "invert(1)" : "none" }} // Optionnel : ajuste pour le thème sombre
          />
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-[var(--primary)] transition-colors">
                Tableau de bord
              </Link>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="ghost" className="p-2">
                    <FaUserCircle className="w-6 h-6" style={{ color: "var(--text)" }} />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="mt-2 p-2 rounded-lg shadow-lg border"
                    style={{ backgroundColor: "var(--card)", borderColor: "var(--muted)" }}
                  >
                    <DropdownMenu.Item
                      className="px-4 py-2 hover:bg-[var(--primary)]/10 cursor-pointer"
                      style={{ color: "var(--text)" }}
                      onClick={() => navigate("/profile")}
                    >
                      Profil
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="px-4 py-2 hover:bg-[var(--primary)]/10 cursor-pointer"
                      style={{ color: "var(--text)" }}
                      onClick={handleLogout}
                    >
                      Déconnexion
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" style={{ borderColor: "var(--muted)", color: "var(--text)" }}>
                  Connexion
                </Button>
              </Link>
              <Link to="/signup">
                <Button style={{ backgroundColor: "var(--primary)", color: "#FFFFFF" }}>
                  Inscription
                </Button>
              </Link>
            </>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--primary)]/20 transition-colors"
            style={{ backgroundColor: "transparent" }}
          >
            {theme === "light" ? (
              <FaMoon className="w-5 h-5" style={{ color: "var(--text)" }} />
            ) : (
              <FaSun className="w-5 h-5" style={{ color: "var(--text)" }} />
            )}
          </motion.button>
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaBars className="w-6 h-6" style={{ color: "var(--text)" }} />
          </Button>
        </div>
      </nav>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden p-4 space-y-4"
          style={{ backgroundColor: "var(--card)", borderTop: "1px solid var(--muted)" }}
        >
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="block" style={{ color: "var(--text)" }}>
                Tableau de bord
              </Link>
              <Link to="/profile" className="block" style={{ color: "var(--text)" }}>
                Profil
              </Link>
              <Button
                variant="outline"
                className="w-full"
                style={{ borderColor: "var(--muted)", color: "var(--text)" }}
                onClick={handleLogout}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="w-full"
                  style={{ borderColor: "var(--muted)", color: "var(--text)" }}
                >
                  Connexion
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  className="w-full"
                  style={{ backgroundColor: "var(--primary)", color: "#FFFFFF" }}
                >
                  Inscription
                </Button>
              </Link>
            </>
          )}
          <Button
            onClick={toggleTheme}
            className="w-full p-2 rounded-full hover:bg-[var(--primary)]/20 transition-colors"
            style={{ backgroundColor: "transparent" }}
          >
            {theme === "light" ? "Mode sombre" : "Mode clair"}
          </Button>
        </motion.div>
      )}
    </header>
  );
};