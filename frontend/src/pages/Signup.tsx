import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signupUser, SignupData } from "../api/api";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { CustomCheckbox } from "../components/common/CustomCheckbox";
import { CustomTextField } from "../components/common/CustomTextField";
import { Loader } from "../components/common/Loader";
import { motion } from "framer-motion";
import signupBgImage from "../assets/signupPicture.png";

interface SignupFormData extends SignupData {
  confirmPassword: string;
}

export const Signup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Validation côté client pour confirmPassword
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas", { id: "signup" });
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...signupPayload } = formData; // Exclure confirmPassword
      const response = await signupUser(signupPayload);
      toast.success(response.message, { id: "signup" });
      setTimeout(() => navigate("/verify-otp"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'inscription", { id: "signup" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-x-hidden">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full md:w-3/5 p-8 z-10"
        >
          <div className="pb-6">
            <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
              Inscription
            </h1>
            <p className="mt-2" style={{ color: "var(--muted)", fontSize: "16px" }}>
              Créez votre compte pour commencer votre aventure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="username" style={{ color: "var(--text)", fontSize: "16px" }}>
                Nom d'utilisateur
              </Label>
              <CustomTextField
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Entrez votre nom d'utilisateur"
                icon="user"
                required
                minLength={5}
                maxLength={20}
                disabled={loading}
              />
            </div>

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
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword" style={{ color: "var(--text)", fontSize: "16px" }}>
                Confirmer le mot de passe
              </Label>
              <CustomTextField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmez votre mot de passe"
                icon="password"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="flex items-center space-x-3">
              <CustomCheckbox
                id="isFreelancer"
                checked={formData.isFreelancer}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isFreelancer: !!checked }))
                }
                disabled={loading}
              />
              <Label
                htmlFor="isFreelancer"
                style={{ color: "var(--text)", fontSize: "16px" }}
                className="cursor-pointer hover:text-[var(--primary)] transition-colors duration-200"
              >
                Je suis un freelancer
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg"
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
          </form>
        </motion.div>

        <div
          className="hidden md:block fixed top-0 right-0 w-2/5 h-full bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${signupBgImage})` }}
        />
      </div>

      {loading && <Loader />}
    </div>
  );
};