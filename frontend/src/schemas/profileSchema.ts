// src/schemas/profileSchema.ts
import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").max(50, "Maximum 50 caractères"),
  lastName: z.string().min(1, "Le nom est requis").max(50, "Maximum 50 caractères"),
  bio: z.string().max(500, "Maximum 500 caractères").optional(),
  companyName: z.string().max(100, "Maximum 100 caractères").optional(),
  webSite: z.string().url("URL invalide").optional().or(z.literal("")),
  skills: z.array(z.string())
    .min(1, "Au moins une compétence est requise")
    .max(10, "Maximum 10 compétences")
    .transform(skills => skills.filter(skill => skill && skill.trim() !== ""))
    .refine(skills => skills.length > 0, {
      message: "Au moins une compétence est requise"
    }),
  github: z.string().url("URL GitHub invalide").optional().or(z.literal("")),
  linkedIn: z.string().url("URL LinkedIn invalide").optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const getProfileSchema = (isFreelancer: boolean) => {
  return z.object({
    firstName: z.string().min(1, "Le prénom est requis").max(50, "Maximum 50 caractères"),
    lastName: z.string().min(1, "Le nom est requis").max(50, "Maximum 50 caractères"),
    bio: z.string().max(500, "Maximum 500 caractères").optional(),
    companyName: z.string().max(100, "Maximum 100 caractères").optional(),
    webSite: z.string().url("URL invalide").optional().or(z.literal("")),
    skills: isFreelancer
      ? z.array(z.string())
          .min(1, "Au moins une compétence est requise")
          .max(10, "Maximum 10 compétences")
          .transform(skills => skills.filter(skill => skill && skill.trim() !== ""))
          .refine(skills => skills.length > 0, {
            message: "Au moins une compétence est requise"
          })
      : z.array(z.string()).max(10, "Maximum 10 compétences").optional(),
    github: z.string().url("URL GitHub invalide").optional().or(z.literal("")),
    linkedIn: z.string().url("URL LinkedIn invalide").optional().or(z.literal("")),
  });
};