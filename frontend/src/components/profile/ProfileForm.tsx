// src/components/profile/ProfileForm.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "../../schemas/profileSchema";
import { updateProfile } from "../../api/api";
import { ProfileData } from "../../types";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { FaUser, FaBriefcase, FaGlobe, FaEdit, FaSave } from "react-icons/fa";

interface ProfileFormProps {
  initialProfile: ProfileData;
}

export const ProfileForm = ({ initialProfile }: ProfileFormProps) => {
  const { theme } = useTheme();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
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
      reset({
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

  return (
    <Card className="shadow-2xl rounded-2xl" style={{ backgroundColor: "var(--card)" }}>
      <CardHeader className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--card)] rounded-t-2xl p-8">
        <CardTitle className="text-4xl font-bold flex items-center">
          <FaUser className="mr-3 text-3xl" /> Gérer mon profil
        </CardTitle>
        <p className="mt-2 text-base opacity-90 italic">
          Personnalisez vos informations pour vous démarquer !
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prénom */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <label className="flex items-center text-lg font-medium" style={{ color: "var(--text)" }}>
                <FaUser className="mr-2 text-[var(--primary)]" /> Prénom
                <span className="text-[var(--error)] ml-1">*</span>
              </label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Entrez votre prénom"
                    className={`w-full mt-2 p-3 rounded-lg border-2 ${errors.firstName ? "border-[var(--error)]" : "border-[var(--muted)]/50"} focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all`}
                    style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                    disabled={submitting}
                  />
                )}
              />
              {errors.firstName && <p className="text-[var(--error)] text-sm mt-1">{errors.firstName.message}</p>}
            </motion.div>

            {/* Nom */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <label className="flex items-center text-lg font-medium" style={{ color: "var(--text)" }}>
                <FaUser className="mr-2 text-[var(--secondary)]" /> Nom
                <span className="text-[var(--error)] ml-1">*</span>
              </label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Entrez votre nom"
                    className={`w-full mt-2 p-3 rounded-lg border-2 ${errors.lastName ? "border-[var(--error)]" : "border-[var(--muted)]/50"} focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/30 transition-all`}
                    style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                    disabled={submitting}
                  />
                )}
              />
              {errors.lastName && <p className="text-[var(--error)] text-sm mt-1">{errors.lastName.message}</p>}
            </motion.div>
          </div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <label className="flex items-center text-lg font-medium" style={{ color: "var(--text)" }}>
              <FaEdit className="mr-2 text-[var(--primary)]" /> Bio
            </label>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Décrivez-vous en quelques mots..."
                  className={`w-full mt-2 p-3 rounded-lg border-2 ${errors.bio ? "border-[var(--error)]" : "border-[var(--muted)]/50"} focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all h-32 resize-none`}
                  style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                  disabled={submitting}
                />
              )}
            />
            {errors.bio && <p className="text-[var(--error)] text-sm mt-1">{errors.bio.message}</p>}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom de l'entreprise */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <label className="flex items-center text-lg font-medium" style={{ color: "var(--text)" }}>
                <FaBriefcase className="mr-2 text-[var(--secondary)]" /> Nom de l'entreprise
              </label>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Entrez le nom de votre entreprise"
                    className={`w-full mt-2 p-3 rounded-lg border-2 ${errors.companyName ? "border-[var(--error)]" : "border-[var(--muted)]/50"} focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/30 transition-all`}
                    style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                    disabled={submitting}
                  />
                )}
              />
              {errors.companyName && <p className="text-[var(--error)] text-sm mt-1">{errors.companyName.message}</p>}
            </motion.div>

            {/* Site web */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <label className="flex items-center text-lg font-medium" style={{ color: "var(--text)" }}>
                <FaGlobe className="mr-2 text-[var(--primary)]" /> Site web
              </label>
              <Controller
                name="webSite"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Entrez l’URL de votre site"
                    className={`w-full mt-2 p-3 rounded-lg border-2 ${errors.webSite ? "border-[var(--error)]" : "border-[var(--muted)]/50"} focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all`}
                    style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF", color: "var(--text)" }}
                    disabled={submitting}
                  />
                )}
              />
              {errors.webSite && <p className="text-[var(--error)] text-sm mt-1">{errors.webSite.message}</p>}
            </motion.div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              type="submit"
              className="w-full py-6 text-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary)]/90 hover:to-[var(--secondary)]/90 transition-all rounded-lg flex items-center justify-center"
              style={{ color: "var(--card)" }}
              disabled={submitting}
            >
              <FaSave className="mr-2" />
              {submitting ? "Mise à jour en cours..." : "Enregistrer les modifications"}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
};