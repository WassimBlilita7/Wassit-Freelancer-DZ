/* eslint-disable react-hooks/rules-of-hooks */
// src/pages/ProfilePage.tsx
import { useParams } from "react-router-dom";
import { useFetchProfile } from "../hooks/useFetchProfile";
import { Loader } from "../components/common/Loader";
import FreelancerProfilePage from "./FreelancerProfilePage";
import ClientProfilePage from "./ClientProfilePage";
import NotFoundPage from "./NotFoundPage";

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { profile, loading, error } = useFetchProfile(username || "");

  if (!username) return <div className="text-center text-[var(--error)] p-8">Username manquant dans l'URL</div>;
  if (loading) return <Loader />;
  if (error === "Utilisateur non trouvé") return <NotFoundPage />;
  if (!profile) return <div className="text-center text-[var(--muted)] p-8">Profil non trouvé</div>;

  return profile.isFreelancer ? (
    <FreelancerProfilePage profile={profile} />
  ) : (
    <ClientProfilePage profile={profile} />
  );
};