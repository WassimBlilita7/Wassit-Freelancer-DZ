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
const ClientStats = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
    >
      <Card className="bg-[var(--card)]/95 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Offres publiées</CardTitle>
          <FaProjectDiagram className="h-4 w-4 text-[var(--primary)]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15</div>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-[var(--success)]/20 text-[var(--success)] px-2 py-1 rounded-full">
              8 en cours
            </span>
            <span className="text-xs bg-[var(--muted)]/20 text-[var(--muted)] px-2 py-1 rounded-full">
              7 complétées
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[var(--card)]/95 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget investi</CardTitle>
          <FaMoneyBillWave className="h-4 w-4 text-[var(--success)]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12,500 €</div>
          <Progress value={75} className="mt-2" />
          <p className="text-xs text-[var(--muted)] mt-2">Budget moyen par projet: 833€</p>
        </CardContent>
      </Card>

      <Card className="bg-[var(--card)]/95 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Freelancers engagés</CardTitle>
          <FaUsers className="h-4 w-4 text-[var(--accent)]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-[var(--primary)]/20 text-[var(--primary)] px-2 py-1 rounded-full">
              5 actifs
            </span>
            <span className="text-xs bg-[var(--muted)]/20 text-[var(--muted)] px-2 py-1 rounded-full">
              3 complétés
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
        {profile.isFreelancer ? <FreelancerStats /> : <ClientStats />}
        
        <ProfileInfo 
          profile={profile.profile as ProfileData} 
          isFreelancer={profile.isFreelancer}
        />
      </div>
    </div>
  );
};