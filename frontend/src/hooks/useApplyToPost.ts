// src/hooks/useApplyToPost.ts
import { useState } from "react";
import { applyToPost } from "../api/api";
import { ApplyToPostData } from "@/types";
import toast from "react-hot-toast";

export const useApplyToPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submitApplication = async (postId: string, data: ApplyToPostData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await applyToPost(postId, data);
      setSuccess(response.message || "Postulé avec succès !");
      toast.success(response.message || "Postulé avec succès !");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Une erreur est survenue lors de la candidature.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { submitApplication, loading, error, success };
};