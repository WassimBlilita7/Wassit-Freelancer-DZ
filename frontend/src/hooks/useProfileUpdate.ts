import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "../schemas/profileSchema";
import { updateProfile, updateProfilePicture } from "../api/api";
import { ProfileData, ApiResponse } from "../types";

export type AlertType = "success" | "error" | "info" | null;

export const useProfileUpdate = (initialProfile: ProfileData) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>(initialProfile.profilePicture || "");

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
      const response: ApiResponse = await updateProfile(data);
      form.reset({
        firstName: response.userData?.profile?.firstName || "",
        lastName: response.userData?.profile?.lastName || "",
        bio: response.userData?.profile?.bio || "",
        companyName: response.userData?.profile?.companyName || "",
        webSite: response.userData?.profile?.webSite || "",
      });
      setAlert({ type: "success", message: response.message });
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Erreur lors de la mise à jour",
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const resetForm = () => {
    form.reset();
    setAlert({ type: "info", message: "Modifications annulées." });
    setTimeout(() => setAlert(null), 5000);
  };

  const handlePictureUpload = async (file: File) => {
    setSubmitting(true);
    try {
      const response: ApiResponse = await updateProfilePicture(file);
      setProfilePicture(response.userData?.profile?.profilePicture || "");
      setAlert({ type: "success", message: response.message });
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Erreur lors de l’upload",
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return { form, submitting, onSubmit, resetForm, alert, setAlert, profilePicture, handlePictureUpload };
};