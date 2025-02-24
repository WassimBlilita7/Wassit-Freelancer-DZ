// src/components/layout/Header.tsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { checkAuth } from "../../api/api";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (err) {
        // Pas besoin d'état local ici sauf si nécessaire
      }
    };
    verifyAuth();
  }, []);

  return (
    <header className="shadow" style={{ backgroundColor: "var(--card)" }}>
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold" style={{ color: "var(--text)" }}>
          Freelance DZ
        </Link>
        <div className="flex items-center" style={{ gap: "20px" }}>
          <Link to="/login">
            <Button
              variant="outline"
              style={{ borderColor: "var(--muted)", color: "var(--text)", marginRight: "10px" }}
            >
              Connexion
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              variant="outline"
              style={{ borderColor: "var(--muted)", color: "var(--text)", marginRight: "10px" }}
            >
              Inscription
            </Button>
          </Link>
          <Link to="/logout">
            <Button
              style={{ backgroundColor: "var(--primary)", color: "#FFFFFF", marginRight: "10px" }}
            >
              Déconnexion
            </Button>
          </Link>
          <Button
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-[var(--primary)]/20 transition-colors duration-200"
            style={{ backgroundColor: "transparent", border: "none" }}
            title={theme === "light" ? "Passer au thème sombre" : "Passer au thème clair"}
          >
            {theme === "light" ? (
              <FaMoon className="w-5 h-5" style={{ color: "var(--text)" }} />
            ) : (
              <FaSun className="w-5 h-5" style={{ color: "var(--text)" }} />
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
};