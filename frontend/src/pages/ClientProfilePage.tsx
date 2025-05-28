import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileInfo } from "../components/profile/ProfileInfo";
import { ClientStats } from "../components/profile/ClientStats";
import { ProfileData } from "../types";
import { Helmet } from 'react-helmet-async';

interface ClientProfilePageProps {
  profile: any;
}

const ClientProfilePage = ({ profile }: ClientProfilePageProps) => {
  return (
    <>
      <Helmet>
        <title>Profil de {profile.username} | Client | Wassit Freelance DZ</title>
        <meta name="description" content={`Découvrez le profil du client ${profile.username} sur Wassit Freelance DZ : historique de projets, informations professionnelles et plus.`} />
        <meta property="og:title" content={`Profil de {profile.username} | Client | Wassit Freelance DZ`} />
        <meta property="og:description" content={`Découvrez le profil du client ${profile.username} sur Wassit Freelance DZ : historique de projets, informations professionnelles et plus.`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--muted)]/20 p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <ProfileHeader
            username={profile.username}
            profilePicture={profile.profile.profilePicture}
            isFreelancer={profile.isFreelancer}
          />
          <section>
            <ClientStats username={profile.username} />
          </section>
          <section>
            <ProfileInfo profile={profile.profile as ProfileData} isFreelancer={false} />
          </section>
        </div>
      </div>
    </>
  );
};

export default ClientProfilePage; 