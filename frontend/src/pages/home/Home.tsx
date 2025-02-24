// src/pages/Home/Home.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Loader } from "../../components/common/Loader";
import { checkAuth } from "../../api/api";
import { motion } from "framer-motion";

export const Home = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
      try {
        const response = await checkAuth();
        setIsAuthenticated(true);
        setIsFreelancer(response.user.isFreelancer || false); 
      } catch (err) {
        setIsAuthenticated(false);
        console.error("Erreur lors de la vérification de l’authentification:", err);
        navigate("/login"); 
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, [navigate]);

  const handleAction = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
            Bienvenue sur Freelance DZ !
          </h1>
          <p className="mt-2" style={{ color: "var(--muted)", fontSize: "16px" }}>
            {isFreelancer
              ? "Commencez à explorer des opportunités pour booster votre carrière."
              : "Gérez vos projets et trouvez les meilleurs talents ici."}
          </p>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
              Que voulez-vous faire ?
            </h2>
            <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center">
              {isFreelancer ? (
                <Button
                  onClick={() => handleAction("/dashboard")} 
                  style={{ backgroundColor: "var(--secondary)", color: "#FFFFFF" }}
                  className="w-full md:w-auto"
                >
                  Voir mon tableau de bord
                </Button>
              ) : (
                <Button
                  onClick={() => handleAction("/new-project")} // À créer si nécessaire
                  style={{ backgroundColor: "var(--secondary)", color: "#FFFFFF" }}
                  className="w-full md:w-auto"
                >
                  Publier un projet
                </Button>
              )}
              <Button
                onClick={() => handleAction("/profile")}
                style={{ backgroundColor: "var(--primary)", color: "#FFFFFF" }}
                className="w-full md:w-auto"
              >
                Gérer mon profil
              </Button>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};