/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/common/GoogleAuthButton.tsx
import { FcGoogle } from "react-icons/fc"; // Icône Google colorée de react-icons
import toast from "react-hot-toast";

export const GoogleAuthButton = () => {
  const handleGoogleAuth = () => {
    try {
      // Rediriger vers l'endpoint Google OAuth du backend
      window.location.href = "http://localhost:5000/api/v1/auth/google";
    } catch (err) {
      toast.error("Erreur lors de la redirection vers Google", { id: "google-auth" });
    }
  };

  return (
    <button
      onClick={handleGoogleAuth}
      className="w-full py-4 text-lg flex items-center justify-center space-x-2 
        rounded-lg border-2 border-[var(--muted)] 
        hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/70 
        transition-all duration-200 ease-in-out"
      style={{ backgroundColor: "var(--card)", color: "var(--text)" }}
    >
      <FcGoogle className="w-6 h-6" />
      <span>Continue with Google</span>
    </button>
  );
};