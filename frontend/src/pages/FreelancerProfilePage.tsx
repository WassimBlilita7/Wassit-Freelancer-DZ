import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileInfo } from "../components/profile/ProfileInfo";
import { FreelancerStats } from "../components/profile/FreelancerStats";
import { ProfileData } from "../types";
import { Helmet } from 'react-helmet-async';

interface FreelancerProfilePageProps {
  profile: any;
}

const FreelancerProfilePage = ({ profile }: FreelancerProfilePageProps) => {
  return (
    <>
      <Helmet>
        <title>Profil de {profile.username} | Freelancer | Wassit Freelance DZ</title>
        <meta name="description" content={`Découvrez le profil du freelancer ${profile.username} sur Wassit Freelance DZ : compétences, expériences, avis clients et plus.`} />
        <meta property="og:title" content={`Profil de ${profile.username} | Freelancer | Wassit Freelance DZ`} />
        <meta property="og:description" content={`Découvrez le profil du freelancer ${profile.username} sur Wassit Freelance DZ : compétences, expériences, avis clients et plus.`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--muted)]/20 p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <ProfileHeader
            username={profile.username}
            profilePicture={profile.profile.profilePicture}
            isFreelancer={profile.isFreelancer}
            github={profile.profile.github}
            linkedIn={profile.profile.linkedIn}
          />
          <section>
            <FreelancerStats username={profile.username} profile={profile.profile} id={profile.id} />
          </section>
          <section>
            <ProfileInfo profile={profile.profile as ProfileData} isFreelancer={profile.isFreelancer} />
          </section>
        </div>
      </div>
    </>
  );
};

export default FreelancerProfilePage; 