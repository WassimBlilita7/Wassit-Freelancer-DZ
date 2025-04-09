// src/components/post/ApplyToPostForm.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applySchema, ApplyFormData } from "../../schemas/applySchema";
import { Button } from "../ui/button";
import { useApplyToPost } from "../../hooks/useApplyToPost";

interface ApplyToPostFormProps {
  postId: string;
  isFreelancer: boolean;
}

export const ApplyToPostForm = ({ postId, isFreelancer }: ApplyToPostFormProps) => {
  const { submitApplication, loading } = useApplyToPost();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      cv: "",
      coverLetter: "",
      bidAmount: 0,
    },
  });

  const onSubmit: SubmitHandler<ApplyFormData> = async (data) => {
    await submitApplication(postId, data);
    reset();
  };

  if (!isFreelancer) {
    return (
      <div className="bg-[var(--card)] rounded-xl shadow-lg p-6 text-center">
        <p className="text-[var(--muted)] text-lg">
          Ops ! Seuls les freelances peuvent postuler à cette offre 😪
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-semibold text-[var(--text)] mb-6">Postuler maintenant</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="cv" className="block text-sm font-medium text-[var(--text)] mb-2">
            Lien vers votre Portfolio
          </label>
          <input
            id="cv"
            type="url"
            {...register("cv")}
            className="w-full p-3 border rounded-lg bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            placeholder="https://example.com/mon-cv.pdf"
          />
          {errors.cv && <p className="text-[var(--error)] text-sm mt-1">{errors.cv.message}</p>}
        </div>

        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-[var(--text)] mb-2">
            Lettre de motivation
          </label>
          <textarea
            id="coverLetter"
            {...register("coverLetter")}
            className="w-full p-3 border rounded-lg bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            rows={5}
            placeholder="Expliquez pourquoi vous êtes le meilleur choix..."
          />
          {errors.coverLetter && (
            <p className="text-[var(--error)] text-sm mt-1">{errors.coverLetter.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bidAmount" className="block text-sm font-medium text-[var(--text)] mb-2">
            Montant proposé (DA)
          </label>
          <input
            id="bidAmount"
            type="number"
            {...register("bidAmount", { valueAsNumber: true })}
            className="w-full p-3 border rounded-lg bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            placeholder="5000"
          />
          {errors.bidAmount && (
            <p className="text-[var(--error)] text-sm mt-1">{errors.bidAmount.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--primary)] text-[var(--card)] hover:bg-[var(--primary)]/90 py-3 text-lg rounded-lg transition-all"
        >
          {loading ? "Envoi en cours..." : "Postuler "}
        </Button>
      </form>
    </div>
  );
};