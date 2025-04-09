/* eslint-disable react-hooks/rules-of-hooks */
// src/pages/ProfilePage.tsx
import { useParams } from "react-router-dom";
import { useFetchProfile } from "../hooks/useFetchProfile";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileInfo } from "../components/profile/ProfileInfo";
import { Loader } from "../components/common/Loader";
import { ProfileData } from "../types"; // Import pour typage

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();

  if (!username) {
    return <div className="text-center text-[var(--error)] p-8">Username manquant dans l'URL</div>;
  }

  const { profile, loading, error } = useFetchProfile(username);

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-[var(--error)] p-8">{error}</div>;
  if (!profile) return <div className="text-center text-[var(--muted)] p-8">Profil non trouvé</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--muted)]/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <ProfileHeader
          username={profile.username}
          profilePicture={profile.profile.profilePicture}
          isFreelancer={profile.isFreelancer}
        />
        <ProfileInfo profile={profile.profile as ProfileData} /> {/* Typage explicite */}
      </div>
    </div>
  );
};