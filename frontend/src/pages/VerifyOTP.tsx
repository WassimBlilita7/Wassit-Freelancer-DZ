// src/pages/VerifyOTP.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOTP, VerifyOTPData } from "../api/api";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { CustomTextField } from "../components/common/CustomTextField";
import { CustomOTPInput } from "../components/common/CustomOTPInput";
import { Loader } from "../components/common/Loader";
import { motion } from "framer-motion";

export const VerifyOTP = () => {
  const [formData, setFormData] = useState<VerifyOTPData>({ email: "", otp: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  };

  const handleOTPChange = (otp: string) => {
    setFormData((prev) => ({ ...prev, otp }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await verifyOTP(formData);
      toast.success(response.message, { id: "verify-otp" });
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de la vérification de l'OTP", { id: "verify-otp" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Conteneur centré */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8" // Taille ajustée pour un UI centré et compact
      >
        <div className="pb-6 text-center">
          <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
            Vérification OTP
          </h1>
          <p className="mt-2" style={{ color: "var(--muted)", fontSize: "16px" }}>
            Entrez le code OTP envoyé à votre email pour vérifier votre compte.
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
            <Label style={{ color: "var(--text)", fontSize: "16px" }}>
              Code OTP
            </Label>
            <CustomOTPInput
              length={6}
              value={formData.otp}
              onChange={handleOTPChange}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-lg"
            style={{ backgroundColor: "var(--primary)", color: "#FFFFFF" }}
            disabled={loading}
          >
            Vérifier
          </Button>

          <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
            Pas reçu de code ?{" "}
            <a href="/signup" style={{ color: "var(--secondary)" }} className="hover:underline">
              Renvoyer
            </a>
          </p>
        </form>
      </motion.div>

      {loading && <Loader />}
    </div>
  );
};