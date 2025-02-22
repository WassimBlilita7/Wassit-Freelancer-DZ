// src/pages/Signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signupUser, SignupData } from "../api/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Loader } from "../components/common/Loader";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

export const Signup = () => {
  const [formData, setFormData] = useState<SignupData>({
    username: "",
    email: "",
    password: "",
    isFreelancer: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await signupUser(formData);
      toast.success(response.message, { id: "signup" });
      setTimeout(() => navigate("/verify-otp"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'inscription", { id: "signup" });
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
              Inscription
            </CardTitle>
            <CardDescription style={{ color: "var(--muted)" }}>
              Créez votre compte Freelance DZ
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" style={{ color: "var(--text)" }}>
                  Nom d'utilisateur
                </Label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "var(--muted)" }} />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Entrez votre nom d'utilisateur"
                    className="pl-10"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--muted)", color: "var(--text)" }}
                    required
                    minLength={5}
                    maxLength={20}
                    disabled={loading}
                  />
                </div>
              </div>

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
                <Label htmlFor="password" style={{ color: "var(--text)" }}>
                  Mot de passe
                </Label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "var(--muted)" }} />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Entrez votre mot de passe"
                    className="pl-10"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--muted)", color: "var(--text)" }}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFreelancer"
                  name="isFreelancer"
                  checked={formData.isFreelancer}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isFreelancer: !!checked }))}
                  disabled={loading}
                />
                <Label htmlFor="isFreelancer" style={{ color: "var(--text)" }}>
                  Je suis un freelance
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: "var(--primary)", color: "#FFFFFF" }}
                disabled={loading}
              >
                S'inscrire
              </Button>
              <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
                Déjà un compte ?{" "}
                <a href="/login" style={{ color: "var(--secondary)" }} className="hover:underline">
                  Connectez-vous
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