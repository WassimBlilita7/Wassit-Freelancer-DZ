// src/pages/Logout.tsx
import { useEffect , useState    } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser } from "../api/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Loader } from "../components/common/Loader";
import { motion } from "framer-motion";

export const Logout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      setLoading(true);
      try {
        const response = await logoutUser();
        toast.success(response.message || "Déconnexion réussie !", { id: "logout" });
        setTimeout(() => navigate("/login"), 2000);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Erreur lors de la déconnexion", { id: "logout" });
      } finally {
        setLoading(false);
      }
    };
    handleLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md" style={{ backgroundColor: "var(--card)" }}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Déconnexion
            </CardTitle>
            <CardDescription style={{ color: "var(--muted)" }}>
              Vous êtes en train de vous déconnecter de votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center" style={{ color: "var(--text)" }}>
              {loading ? "Déconnexion en cours..." : "Vous serez redirigé vers la page de connexion."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              disabled={loading}
              style={{ borderColor: "var(--muted)", color: "var(--text)" }}
            >
              Retour à l'accueil
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      {loading && <Loader />}
    </div>
  );
};