// src/schemas/applySchema.ts
import * as z from "zod";

export const applySchema = z.object({
  cv: z.instanceof(File, { message: "Veuillez télécharger un fichier PDF valide" })
    .refine((file) => file.type === "application/pdf", {
      message: "Le fichier doit être au format PDF"
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Le fichier ne doit pas dépasser 10MB"
    }),
  coverLetter: z.string().min(10, "La lettre de motivation doit contenir au moins 10 caractères"),
  bidAmount: z.number().min(1, "Le montant doit être supérieur à 0"),
});

export type ApplyFormData = z.infer<typeof applySchema>;