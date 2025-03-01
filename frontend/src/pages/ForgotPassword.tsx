// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/api";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { CustomTextField } from "../components/common/CustomTextField";
import { Loader } from "../components/common/Loader";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      toast.success(response.message || "Code envoyé à votre email !");
      setTimeout(() => navigate("/reset-password"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l’envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md p-8 bg-[var(--card)] rounded-xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--text)" }}>
            Mot de passe oublié
          </h1>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Entrez votre email pour recevoir un code de réinitialisation.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" style={{ color: "var(--text)", fontSize: "16px" }}>
                Email
              </Label>
              <CustomTextField
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                icon="email"
                required
                disabled={loading}
              />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                className="w-full py-6 text-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary)]/90 hover:to-[var(--secondary)]/90"
                style={{ color: "var(--card)" }}
                disabled={loading}
              >
                Envoyer le code
              </Button>
            </motion.div>
            <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
              Retour à la{" "}
              <a href="/login" style={{ color: "var(--secondary)" }} className="hover:underline">
                connexion
              </a>
            </p>
          </form>
        </div>
      </motion.div>
      {loading && <Loader />}
    </div>
  );
};