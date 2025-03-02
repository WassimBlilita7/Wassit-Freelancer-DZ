// src/schemas/profileSchema.ts
import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").max(50, "Maximum 50 caractères"),
  lastName: z.string().min(1, "Le nom est requis").max(50, "Maximum 50 caractères"),
  bio: z.string().max(500, "Maximum 500 caractères").optional(),
  companyName: z.string().max(100, "Maximum 100 caractères").optional(),
  webSite: z.string().url("URL invalide").optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;