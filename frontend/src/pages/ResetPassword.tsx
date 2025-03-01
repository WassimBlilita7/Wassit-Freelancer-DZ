// src/pages/ResetPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../api/api";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { CustomTextField } from "../components/common/CustomTextField";
import { CustomOTPInput } from "../components/common/CustomOTPInput";
import { Loader } from "../components/common/Loader";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export const ResetPassword = () => {
  const [formData, setFormData] = useState({ email: "", resetOTP: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOTPChange = (otp: string) => {
    setFormData((prev) => ({ ...prev, resetOTP: otp }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await resetPassword(formData);
      toast.success(response.message || "Mot de passe réinitialisé !");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de la réinitialisation");
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
            Réinitialiser le mot de passe
          </h1>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Entrez votre email, le code reçu, et votre nouveau mot de passe.
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
                value={formData.email}
                onChange={handleChange}
                placeholder="Entrez votre email"
                icon="email"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-3">
              <Label style={{ color: "var(--text)", fontSize: "16px" }}>
                Code OTP
              </Label>
              <CustomOTPInput
                length={6}
                value={formData.resetOTP}
                onChange={handleOTPChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="newPassword" style={{ color: "var(--text)", fontSize: "16px" }}>
                Nouveau mot de passe
              </Label>
              <CustomTextField
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Entrez votre nouveau mot de passe"
                icon="password"
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
                Réinitialiser
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