/* eslint-disable react-hooks/rules-of-hooks */
// src/pages/ProfilePage.tsx
import { useParams } from "react-router-dom";
import { useFetchProfile } from "../hooks/useFetchProfile";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileInfo } from "../components/profile/ProfileInfo";
import { Loader } from "../components/common/Loader";
import { ProfileData } from "../types";
import { motion } from "framer-motion";
import { FaStar, FaProjectDiagram, FaUsers, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { useClientStats } from "../hooks/useClientStats";

// Composant pour les statistiques des freelancers
const FreelancerStats = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
    >
      <Card className="bg-[var(--card)]/95 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projets complétés</CardTitle>
          <FaProjectDiagram className="h-4 w-4 text-[var(--primary)]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <Progress value={80} className="mt-2" />
          <p className="text-xs text-[var(--muted)] mt-2">+12% par rapport au mois dernier</p>
        </CardContent>
      </Card>

      <Card className="bg-[var(--card)]/95 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de satisfaction</CardTitle>
          <FaStar className="h-4 w-4 text-[var(--accent)]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4.8/5</div>
          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`h-4 w-4 ${
                  star <= 4 ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">Basé sur 32 évaluations</p>
        </CardContent>
      </Card>

      <Card className="bg-[var(--card)]/95 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Temps de réponse</CardTitle>
          <FaClock className="h-4 w-4 text-[var(--success)]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2h</div>
          <Progress value={90} className="mt-2" />
          <p className="text-xs text-[var(--muted)] mt-2">Moyenne de réponse</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Composant pour les statistiques des clients
const ClientStats = ({ username }: { username: string }) => {
  const { stats, loading, error } = useClientStats(username);

  console.log("ClientStats render:", { stats, loading, error });

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </CardTitle>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-4">
        Aucune statistique disponible
      </div>
    );
  }

  const averageBudget = stats.totalOffers > 0 ? stats.totalBudget / stats.totalOffers : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Offres publiées</CardTitle>
          <FaProjectDiagram className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOffers ?? 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeOffers ?? 0} actives, {stats.completedOffers ?? 0} complétées
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget total</CardTitle>
          <FaMoneyBillWave className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(stats.totalBudget).toLocaleString()} DA</div>
          <p className="text-xs text-muted-foreground">
            Moyenne: {averageBudget.toLocaleString()} DA/offre
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Freelancers engagés</CardTitle>
          <FaUsers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFreelancers ?? 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeFreelancers ?? 0} freelancers actifs
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

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
      <div className="max-w-6xl mx-auto space-y-6">
        <ProfileHeader
          username={profile.username}
          profilePicture={profile.profile.profilePicture}
          isFreelancer={profile.isFreelancer}
        />
        
        {/* Statistiques spécifiques selon le type d'utilisateur */}
        {profile.isFreelancer ? <FreelancerStats /> : <ClientStats username={profile.username} />}
        
        <ProfileInfo 
          profile={profile.profile as ProfileData} 
          isFreelancer={profile.isFreelancer}
        />
      </div>
    </div>
  );
};