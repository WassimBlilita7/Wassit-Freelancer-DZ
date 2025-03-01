// src/components/layout/Header.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { checkAuth } from "../../api/api";
import { FaBars, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { DropdownMenu } from "../ui/DropdownMenu";
import { getMenuItems } from "../../data/menuItems";
import { Player } from "@lottiefiles/react-lottie-player";
import logo from "../../assets/logo/logo-transparent-png.png";
import hoverAnimation from "../../assets/lottie/hover.json";
import { motion } from "framer-motion";
import { MenuItem } from "../ui/MenuItem";

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
        setIsFreelancer(response.user.isFreelancer || false);
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
      className="fixed top-0 left-0 w-full shadow z-50"
      style={{
        background: theme === "light"
          ? "linear-gradient(to right, #E5E7EB, #2770D1)" // Gris clair vers bleu vif
          : "linear-gradient(to right, #1F2937, #C40D6C)", // Gris foncé vers magenta
      }}
    >
      <nav className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo avec animation */}
        <Link to="/" className="relative flex items-center">
          <motion.div whileHover={{ scale: 1.05 }}>
            <img
              src={logo}
              alt="Freelance DZ Logo"
              className="h-12 w-auto"
              style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
            />
            <Player
              autoplay
              loop
              src={hoverAnimation}
              style={{ height: "40px", width: "40px", position: "absolute", top: "-10px", right: "-10px", opacity: 0 }}
              className="hover:opacity-100 transition-opacity"
            />
          </motion.div>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {isLoading ? (
            <Player autoplay loop src={hoverAnimation} style={{ height: "30px", width: "30px" }} />
          ) : isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                className="text-lg font-medium hover:text-[var(--primary)]"
                onClick={() => navigate("/dashboard")}
                style={{ color: "#FFFFFF" }} // Texte blanc pour contraste
              >
                Tableau de bord
              </Button>
              <DropdownMenu
                trigger={
                  <Button variant="ghost" className="p-2">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                      <img
                        src={logo}
                        alt="User Profile"
                        className="w-8 h-8 rounded-full"
                        style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
                      />
                    </motion.div>
                  </Button>
                }
                items={menuItems}
              />
            </>
          ) : (
            <>
              <Button
                variant="outline"
                style={{ borderColor: "#FFFFFF", color: "#FFFFFF" }} // Bordure et texte blancs
                onClick={() => navigate("/login")}
              >
                Connexion
              </Button>
              <Button
                style={{ backgroundColor: "var(--secondary)", color: "#FFFFFF" }} // Utilise secondary pour contraste
                onClick={() => navigate("/signup")}
              >
                Inscription
              </Button>
            </>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--primary)]/20 transition-colors"
            style={{ backgroundColor: "transparent" }}
          >
            {theme === "light" ? (
              <FaMoon className="w-5 h-5" style={{ color: "#FFFFFF" }} />
            ) : (
              <FaSun className="w-5 h-5" style={{ color: "#FFFFFF" }} />
            )}
          </motion.button>
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaBars className="w-6 h-6" style={{ color: "#FFFFFF" }} />
          </Button>
        </div>
      </nav>

      {/* Sidebar Mobile */}
      {isMenuOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 w-3/4 h-full p-6 md:hidden"
          style={{
            background: theme === "light"
              ? "linear-gradient(to bottom, #E5E7EB, #2770D1)"
              : "linear-gradient(to bottom, #1F2937, #C40D6C)",
            boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <div className="space-y-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full text-left text-lg"
                  style={{ color: "#FFFFFF" }}
                  onClick={() => navigate("/dashboard")}
                >
                  Tableau de bord
                </Button>
                {menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    text={item.text}
                    icon={item.icon}
                    description={item.description}
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                  />
                ))}
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full"
                  style={{ borderColor: "#FFFFFF", color: "#FFFFFF" }}
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Connexion
                </Button>
                <Button
                  className="w-full"
                  style={{ backgroundColor: "var(--secondary)", color: "#FFFFFF" }}
                  onClick={() => {
                    navigate("/signup");
                    setIsMenuOpen(false);
                  }}
                >
                  Inscription
                </Button>
              </>
            )}
            <Button
              onClick={toggleTheme}
              className="w-full p-2 rounded-full hover:bg-[var(--primary)]/20 transition-colors"
              style={{ backgroundColor: "transparent", color: "#FFFFFF" }}
            >
              {theme === "light" ? "Mode sombre" : "Mode clair"}
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
};