// src/components/post/ApplyToPostForm.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applySchema, ApplyFormData } from "../../schemas/applySchema";
import { Button } from "../ui/button";
import { useApplyToPost } from "../../hooks/useApplyToPost";
import { FaUpload, FaFilePdf, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FileText } from "lucide-react";

interface ApplyToPostFormProps {
  postId: string;
  isFreelancer: boolean;
}

export const ApplyToPostForm = ({ postId, isFreelancer }: ApplyToPostFormProps) => {
  const { submitApplication, loading } = useApplyToPost();
  const [fileError, setFileError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      coverLetter: "",
      bidAmount: 0,
    },
  });

  const selectedFile = watch("cv");

  const validatePDF = (file: File): boolean => {
    // Vérifier le type MIME
    if (file.type !== "application/pdf") {
      setFileError("Le fichier doit être au format PDF");
      return false;
    }

    // Vérifier la taille (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setFileError("Le fichier ne doit pas dépasser 10MB");
      return false;
    }

    setFileError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validatePDF(file)) {
        setValue("cv", file, { shouldValidate: true });
        toast.success("Fichier PDF valide");
      } else {
        // Réinitialiser l'input file
        e.target.value = "";
        setValue("cv", undefined, { shouldValidate: true });
      }
    }
  };

  const onSubmit: SubmitHandler<ApplyFormData> = async (data) => {
    if (!data.cv) {
      toast.error("Veuillez télécharger un CV au format PDF");
      return;
    }

    const formData = new FormData();
    formData.append("cv", data.cv);
    formData.append("coverLetter", data.coverLetter);
    formData.append("bidAmount", data.bidAmount.toString());

    try {
      await submitApplication(postId, formData);
      reset();
      // Réinitialiser l'input file
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      toast.success("Candidature envoyée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la candidature:", error);
      toast.error("Erreur lors de l'envoi de la candidature");
    }
  };

  if (!isFreelancer) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--card)] rounded-xl shadow-lg p-6 text-center"
      >
        <p className="text-[var(--muted)] text-lg">
          Ops ! Seuls les freelances peuvent postuler à cette offre 😪
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--card)] rounded-xl shadow-lg p-6"
    >
      <h3 className="text-2xl font-semibold text-[var(--text)] mb-6 flex items-center">
        <FaPaperPlane className="text-[var(--primary)] mr-2" />
        Postuler maintenant
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="cv" className="block text-sm font-medium text-[var(--text)] mb-2">
            CV (PDF)
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                id="cv"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="cv"
                className={`flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed rounded-lg bg-[var(--background)] text-[var(--text)] hover:bg-[var(--background)]/80 cursor-pointer transition-all ${
                  fileError ? "border-[var(--error)]" : "border-[var(--muted)]"
                }`}
              >
                <FaUpload className={`${fileError ? "text-[var(--error)]" : "text-[var(--primary)]"}`} />
                <span>{selectedFile ? selectedFile.name : "Télécharger votre CV (PDF)"}</span>
              </label>
            </div>
            {selectedFile && !fileError && (
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.open(URL.createObjectURL(selectedFile), "_blank")}
              >
                <FaFilePdf />
                <span>Voir</span>
              </Button>
            )}
          </div>
          {(fileError || errors.cv) && (
            <p className="text-[var(--error)] text-sm mt-1">{fileError || errors.cv?.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-[var(--text)] mb-2">
            Lettre de motivation
          </label>
          <textarea
            id="coverLetter"
            {...register("coverLetter")}
            className="w-full p-3 border rounded-lg bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all min-h-[150px]"
            placeholder="Expliquez pourquoi vous êtes le meilleur choix pour ce projet..."
          />
          {errors.coverLetter && (
            <p className="text-[var(--error)] text-sm mt-1">{errors.coverLetter.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bidAmount" className="block text-sm font-medium text-[var(--text)] mb-2">
            Montant proposé (DA)
          </label>
          <div className="relative">
            <input
              id="bidAmount"
              type="number"
              {...register("bidAmount", { valueAsNumber: true })}
              className="w-full p-3 pl-12 border rounded-lg bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
              placeholder="5000"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">DA</span>
          </div>
          {errors.bidAmount && (
            <p className="text-[var(--error)] text-sm mt-1">{errors.bidAmount.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !!fileError}
          className="w-full bg-[var(--primary)] text-[var(--card)] hover:bg-[var(--primary)]/90 py-3 text-lg rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <FaPaperPlane />
              Postuler
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};