import { createContext, useState, useEffect, ReactNode } from "react";
import { checkAuth } from "@/api/api";

interface AuthContextType {
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentUserId: null,
  setCurrentUserId: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const authResponse = await checkAuth();
        console.log("Auth response:", authResponse);
        const userId = authResponse.user?.id; // Correction ici : utiliser authResponse.user.id
        setCurrentUserId(userId ? userId.toString() : null);
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        setCurrentUserId(null);
      }
    };
    fetchAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUserId, setCurrentUserId }}>
      {children}
    </AuthContext.Provider>
  );
};