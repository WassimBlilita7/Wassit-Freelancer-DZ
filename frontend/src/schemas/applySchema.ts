// src/schemas/applySchema.ts
import { z } from "zod";

export const applySchema = z.object({
  cv: z.instanceof(File).optional(),
  coverLetter: z.string().min(10, "La lettre de motivation doit contenir au moins 10 caractères"),
  bidAmount: z.number().min(1, "Le montant doit être supérieur à 0"),
});

export type ApplyFormData = z.infer<typeof applySchema>;