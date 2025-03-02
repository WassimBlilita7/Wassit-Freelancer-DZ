// src/pages/Profile.tsx
import { ProfileForm } from "../components/profile/ProfileForm";
import { useProfile } from "../hooks/useProfile";
import { Loader } from "../components/common/Loader";
import { motion } from "framer-motion";

export const Profile = () => {
  const { profile, loading, isAuthenticated } = useProfile();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[var(--background)] to-[var(--muted)]/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        <ProfileForm initialProfile={profile} />
      </motion.div>
    </div>
  );
};