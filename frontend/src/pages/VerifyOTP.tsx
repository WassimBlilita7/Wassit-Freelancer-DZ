// src/pages/VerifyOTP.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOTP, VerifyOTPData } from "../api/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Loader } from "../components/common/Loader";
import { FaEnvelope, FaKey } from "react-icons/fa";
import { motion } from "framer-motion";

export const VerifyOTP = () => {
  const [formData, setFormData] = useState<VerifyOTPData>({ email: "", otp: "" });
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md" style={{ backgroundColor: "var(--card)" }}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Vérification OTP
            </CardTitle>
            <CardDescription style={{ color: "var(--muted)" }}>
              Entrez le code OTP envoyé à votre email
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: "var(--text)" }}>
                  Email
                </Label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "var(--muted)" }} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Entrez votre email"
                    className="pl-10"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--muted)", color: "var(--text)" }}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" style={{ color: "var(--text)" }}>
                  Code OTP
                </Label>
                <div className="relative">
                  <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "var(--muted)" }} />
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Entrez le code OTP"
                    className="pl-10"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--muted)", color: "var(--text)" }}
                    required
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
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
            </CardFooter>
          </form>
        </Card>
      </motion.div>
      {loading && <Loader />}
    </div>
  );
};