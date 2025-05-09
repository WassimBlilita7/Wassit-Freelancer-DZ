// src/hooks/useApplyToPost.ts
import { useState } from "react";
import { applyToPost } from "../api/api";
import { toast } from "react-hot-toast";

export const useApplyToPost = () => {
  const [loading, setLoading] = useState(false);

  const submitApplication = async (postId: string, formData: FormData) => {
    setLoading(true);
    try {
      await applyToPost(postId, formData);
      toast.success("Candidature envoyée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la candidature:", error);
      toast.error("Erreur lors de l'envoi de la candidature");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { submitApplication, loading };
};