// src/schemas/postSchema.ts
import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(7, "Le titre doit contenir au moins 3 caractères").max(100, "Le titre ne peut pas dépasser 100 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères").max(1000, "La description ne peut pas dépasser 1000 caractères"),
  skillsRequired: z.array(z.string().min(1, "Chaque compétence doit avoir au moins 1 caractère")).min(1, "Au moins une compétence est requise"),
  budget: z.number().min(1, "Le budget doit être supérieur à 0"),
  duration: z.enum(["short-term", "long-term", "ongoing"], { required_error: "Veuillez sélectionner une durée" }),
  category: z.string().nonempty("Veuillez sélectionner une catégorie"),
  picture: z.instanceof(File).optional(),
});

export type PostFormData = z.infer<typeof postSchema>;