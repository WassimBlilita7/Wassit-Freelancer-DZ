import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "../schemas/profileSchema";
import { updateProfile, updateProfilePicture } from "../api/api";
import { useState } from "react";
import { ProfileData } from "../types";
import toast from "react-hot-toast";

export const useProfileUpdate = (initialProfile: ProfileData) => {
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(initialProfile.profilePicture || null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialProfile.firstName || "",
      lastName: initialProfile.lastName || "",
      bio: initialProfile.bio || "",
      skills: initialProfile.skills || [],
      companyName: initialProfile.companyName || "",
      webSite: initialProfile.webSite || "",
      github: initialProfile.github || "",
      linkedIn: initialProfile.linkedIn || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setSubmitting(true);
    setAlert(null);

    try {
      const response = await updateProfile(data);
      if (response.userData) {
        setAlert({
          type: "success",
          message: "Profil mis à jour avec succès !",
        });
        toast.success("Profil mis à jour avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setAlert({
        type: "error",
        message: "Erreur lors de la mise à jour du profil. Veuillez réessayer.",
      });
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset({
      firstName: initialProfile.firstName || "",
      lastName: initialProfile.lastName || "",
      bio: initialProfile.bio || "",
      skills: initialProfile.skills || [],
      companyName: initialProfile.companyName || "",
      webSite: initialProfile.webSite || "",
      github: initialProfile.github || "",
      linkedIn: initialProfile.linkedIn || "",
    });
    setAlert(null);
  };

  const handlePictureUpload = async (file: File) => {
    setSubmitting(true);
    setAlert(null);

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await updateProfilePicture(formData);
      if (response.userData?.profile?.profilePicture) {
        setProfilePicture(response.userData.profile.profilePicture);
        setAlert({
          type: "success",
          message: "Photo de profil mise à jour avec succès !",
        });
        toast.success("Photo de profil mise à jour avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la photo:", error);
      setAlert({
        type: "error",
        message: "Erreur lors de la mise à jour de la photo. Veuillez réessayer.",
      });
      toast.error("Erreur lors de la mise à jour de la photo");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    onSubmit,
    resetForm,
    alert,
    profilePicture,
    handlePictureUpload,
  };
};