import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileInfo } from "../components/profile/ProfileInfo";
import { ClientStats } from "../components/profile/ClientStats";
import { ProfileData } from "../types";

interface ClientProfilePageProps {
  profile: any;
}

const ClientProfilePage = ({ profile }: ClientProfilePageProps) => {
  return (
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
  );
};

export default ClientProfilePage; 