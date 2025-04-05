import { FaUserCircle, FaSave, FaUndo } from "react-icons/fa";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion } from "framer-motion";
import { ProfileData } from "../../types";
import { useProfileUpdate } from "../../hooks/useProfileUpdate";
import { ProfileFields } from "./ProfileFields";
import { useTheme } from "../../context/ThemeContext";

interface ProfileFormProps {
  initialProfile: ProfileData;
  username: string;
}

export const ProfileForm = ({ initialProfile, username }: ProfileFormProps) => {
  const { theme } = useTheme();
  const { form, submitting, onSubmit, resetForm } = useProfileUpdate(initialProfile);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar avec username */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:w-1/3"
      >
        <Card className="shadow-xl rounded-xl" style={{ backgroundColor: "var(--card)" }}>
          <CardHeader className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--card)] rounded-t-xl p-6">
            <CardTitle className="text-2xl font-bold flex items-center">
              <FaUserCircle className="mr-2 text-3xl" /> Votre identité
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-lg font-medium flex items-center" style={{ color: "var(--text)" }}>
                <FaUserCircle className="mr-2 text-[var(--primary)]" /> Nom d’utilisateur
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

      {/* Formulaire principal */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:w-2/3"
      >
        <Card className="shadow-xl rounded-xl" style={{ backgroundColor: "var(--card)" }}>
          <CardHeader className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--card)] rounded-t-xl p-6">
            <CardTitle className="text-3xl font-bold">
              Gérer mon profil
            </CardTitle>
            <p className="mt-2 text-sm opacity-90">
              Mettez à jour vos informations pour un profil professionnel.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <ProfileFields form={form} submitting={submitting} />
              <div className="flex gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary)]/90 hover:to-[var(--secondary)]/90 flex items-center justify-center"
                    disabled={submitting}
                  >
                    <FaSave className="mr-2" />
                    {submitting ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full py-3"
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