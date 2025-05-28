import { FaUserCircle, FaSave, FaUndo, FaCamera, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { motion } from "framer-motion";
import { ProfileData } from "../../types";
import { useProfileUpdate } from "../../hooks/useProfileUpdate";
import { ProfileFields } from "./ProfileFields";
import { useTheme } from "../../context/ThemeContext";
import { ChangeEvent } from "react";

interface ProfileFormProps {
  initialProfile: ProfileData;
  username: string;
  isFreelancer: boolean;
}

export const ProfileForm = ({ initialProfile, username, isFreelancer }: ProfileFormProps) => {
  const { theme } = useTheme();
  const { form, submitting, onSubmit, resetForm, alert, profilePicture, handlePictureUpload } = useProfileUpdate(initialProfile, isFreelancer);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePictureUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:w-1/3"
      >
        <Card
          className="shadow-xl rounded-xl relative"
          style={{
            backgroundColor: "var(--profile-sidebar-bg)",
            backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
            backgroundSize: "cover",
          }}
        >
          <CardHeader
            className="rounded-t-xl p-6"
            style={{
              background: `linear-gradient(to right, var(--profile-header-start), var(--profile-header-end))`,
              color: "var(--header-text)",
            }}
          >
            <CardTitle className="text-2xl font-bold flex items-center">
              <FaUserCircle className="mr-2 text-3xl" /> Votre identité
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="relative flex justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--profile-header-start)]">
                {profilePicture ? (
                  <img src={profilePicture} alt="Photo de profil" className="w-full h-full object-cover" />
                ) : (
                  <FaUserCircle className="w-full h-full text-[var(--muted)]" />
                )}
              </div>
              <label
                htmlFor="profilePictureUpload"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-full"
              >
                <FaCamera className="text-white text-2xl" />
                <span className="text-white ml-2">Modifier</span>
              </label>
              <input
                id="profilePictureUpload"
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFileChange}
                disabled={submitting}
              />
            </div>
            <div>
              <label className="text-lg font-medium flex items-center" style={{ color: "var(--text)" }}>
                <FaUserCircle className="mr-2" style={{ color: "var(--profile-header-start)" }} /> Nom d'utilisateur
              </label>
              <input
                value={username}
                disabled
                className="w-full mt-2 p-3 rounded-lg border-2 border-[var(--muted)]/50 bg-[var(--muted)]/20 text-[var(--text)] cursor-not-allowed"
                style={{ backgroundColor: theme === "dark" ? "#475569" : "#EFF6FF" }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:w-2/3"
      >
        <Card className="shadow-xl rounded-xl" style={{ backgroundColor: "var(--card)" }}>
          <CardHeader
            className="rounded-t-xl p-6"
            style={{
              background: `linear-gradient(to right, var(--profile-header-start), var(--profile-header-end))`,
              color: "var(--header-text)",
            }}
          >
            <CardTitle className="text-3xl font-bold">
              {isFreelancer ? "Devenez inoubliable avec un profil au top 🚀" : "Complétez votre profil professionnel"}
            </CardTitle>
            <p className="mt-2 text-sm opacity-90">
              {isFreelancer 
                ? "Racontez votre histoire, montrez vos compétences et attirez les clients qui vous correspondent"
                : "Présentez votre entreprise et vos besoins pour trouver les meilleurs freelancers"}
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {alert && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <Alert variant={alert.type === "error" ? "destructive" : "default"}>
                  {alert.type === "success" && <FaCheckCircle className="h-4 w-4" />}
                  {alert.type === "error" && <FaExclamationCircle className="h-4 w-4" />}
                  {alert.type === "info" && <FaInfoCircle className="h-4 w-4" />}
                  <AlertTitle>
                    {alert.type === "success" && "Succès"}
                    {alert.type === "error" && "Erreur"}
                    {alert.type === "info" && "Information"}
                  </AlertTitle>
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <ProfileFields form={form} submitting={submitting} isFreelancer={isFreelancer} />
              <div className="flex gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="w-full py-3 flex items-center justify-center"
                    style={{ backgroundColor: "var(--profile-button-save)", color: "#FFFFFF" }}
                    disabled={submitting}
                  >
                    <FaSave className="mr-2" />
                    {submitting ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    className="w-full py-3 flex items-center justify-center"
                    style={{ backgroundColor: "var(--profile-button-cancel)", color: "#FFFFFF" }}
                    onClick={resetForm}
                    disabled={submitting}
                  >
                    <FaUndo className="mr-2" />
                    Annuler
                  </Button>
                </motion.div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};