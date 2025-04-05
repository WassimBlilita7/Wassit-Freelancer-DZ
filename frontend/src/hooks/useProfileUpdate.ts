import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "../schemas/profileSchema";
import { updateProfile } from "../api/api";
import { ProfileData } from "../types";
import toast from "react-hot-toast";

export const useProfileUpdate = (initialProfile: ProfileData) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const form: UseFormReturn<ProfileFormData> = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialProfile.firstName || "",
      lastName: initialProfile.lastName || "",
      bio: initialProfile.bio || "",
      companyName: initialProfile.companyName || "",
      webSite: initialProfile.webSite || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setSubmitting(true);
    try {
      const response = await updateProfile(data);
      form.reset({
        firstName: response.userData?.profile?.firstName || "",
        lastName: response.userData?.profile?.lastName || "",
        bio: response.userData?.profile?.bio || "",
        companyName: response.userData?.profile?.companyName || "",
        webSite: response.userData?.profile?.webSite || "",
      });
      toast.success(response.message || "Profil mis à jour avec succès !");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset();
    toast("Modifications annulées.", { 
      style: {
        background: "#e0f2fe",
        color: "#0369a1",
      },
      icon: "ℹ️",
    });
  };

  return { form, submitting, onSubmit, resetForm };
};