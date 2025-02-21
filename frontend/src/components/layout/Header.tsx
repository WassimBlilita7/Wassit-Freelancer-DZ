// src/components/layout/Header.tsx
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export const Header = () => {
  return (
    <header className="shadow" style={{ backgroundColor: "var(--card)" }}>
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold" style={{ color: "var(--text)" }}>
          Freelance DZ
        </Link>
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="outline" style={{ borderColor: "var(--muted)", color: "var(--text)" }}>
              Connexion
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" style={{ borderColor: "var(--muted)", color: "var(--text)" }}>
              Inscription
            </Button>
          </Link>
          <Link to="/logout">
            <Button style={{ backgroundColor: "var(--primary)", color: "#FFFFFF" }}>
              Déconnexion
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};