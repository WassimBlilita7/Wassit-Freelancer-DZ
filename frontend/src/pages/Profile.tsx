import { ProfileForm } from "../components/profile/ProfileForm";
import { useProfile } from "../hooks/useProfile";
import { Loader } from "../components/common/Loader";
import { motion } from "framer-motion";

export const Profile = () => {
  const { profile, username, loading, isAuthenticated, isFreelancer } = useProfile();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <p style={{ color: "var(--text)" }}>
          Veuillez vous connecter pour accéder à cette page.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--background)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <ProfileForm initialProfile={profile} username={username} isFreelancer={isFreelancer} />
      </motion.div>
    </div>
  );
};