/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Loader } from "../components/common/Loader";
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";

export const SignupWithGoogle = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleGoogleSignup = () => {
    setLoading(true);
    try {
      // Rediriger vers l'endpoint Google OAuth du backend
      window.location.href = "http://localhost:5000/api/v1/auth/google";
    } catch (err) {
      toast.error("Erreur lors de la redirection vers Google", { id: "google-signup" });
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
              Inscription avec Google
            </CardTitle>
            <CardDescription style={{ color: "var(--muted)" }}>
              Utilisez votre compte Google pour vous inscrire rapidement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center" style={{ color: "var(--text)" }}>
              Cliquez sur le bouton ci-dessous pour vous inscrire avec Google.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full flex items-center justify-center space-x-2"
              onClick={handleGoogleSignup}
              disabled={loading}
              style={{ backgroundColor: "var(--primary)", color: "#FFFFFF" }}
            >
              <FaGoogle className="w-5 h-5" />
              <span>S'inscrire avec Google</span>
            </Button>
            <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
              Préférez une inscription classique ?{" "}
              <a href="/signup" style={{ color: "var(--secondary)" }} className="hover:underline">
                Inscrivez-vous ici
              </a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
      {loading && <Loader />}
    </div>
  );
};