/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser, LoginData } from "../api/api";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { CustomTextField } from "../components/common/CustomTextField";
import { GoogleAuthButton } from "../components/common/GoogleAuthButton" // Nouveau composant
import { Loader } from "../components/common/Loader";
import { motion } from "framer-motion";
import loginBgImage from "../assets/signupPicture.png";

export const Login = () => {
  const [formData, setFormData] = useState<LoginData>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(formData);
      toast.success("Connexion réussie !", { id: "login" });
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de la connexion", { id: "login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-x-hidden">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center">
        {/* Côté gauche : Formulaire */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full md:w-3/5 p-8 z-10"
        >
          <div className="pb-6">
            <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
              Connexion
            </h1>
            <p className="mt-2" style={{ color: "var(--muted)", fontSize: "16px" }}>
              Accédez à votre compte Freelance DZ pour continuer votre aventure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" style={{ color: "var(--text)", fontSize: "16px" }}>
                Email
              </Label>
              <CustomTextField
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Entrez votre email"
                icon="email"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" style={{ color: "var(--text)", fontSize: "16px" }}>
                Mot de passe
              </Label>
              <CustomTextField
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe"
                icon="password"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg"
              style={{ backgroundColor: "var(--primary)", color: "#FFFFFF" }}
              disabled={loading}
            >
              Se connecter
            </Button>

            {/* Bouton Google */}
            <div className="mt-4">
              <GoogleAuthButton />
            </div>

            <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
              Pas de compte ?{" "}
              <a href="/signup" style={{ color: "var(--secondary)" }} className="hover:underline">
                Inscrivez-vous
              </a>
            </p>
          </form>
        </motion.div>

        {/* Côté droit : Image fixée */}
        <div
          className="hidden md:block fixed top-0 right-0 w-7/20 h-full bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${loginBgImage})`,
          }}
        />
      </div>

      {loading && <Loader />}
    </div>
  );
};