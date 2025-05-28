import { useClientStats } from "../../hooks/useClientStats";
import { FaProjectDiagram, FaMoneyBillWave, FaUsers } from "react-icons/fa";

export const ClientStats = ({ username }: { username: string }) => {
  const { stats, loading, error } = useClientStats(username);

  if (loading) {
    return <div className="text-center p-4">Chargement des statistiques...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }
  if (!stats) {
    return <div className="text-center p-4">Aucune statistique disponible</div>;
  }
  const averageBudget = stats.totalOffers > 0 ? stats.totalBudget / stats.totalOffers : 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl shadow-lg p-6 flex flex-col items-center border-2 border-[var(--primary)]/30">
        <FaProjectDiagram className="h-8 w-8 text-white mb-2" />
        <div className="text-2xl font-bold text-white">{stats.totalOffers ?? 0}</div>
        <div className="text-xs text-white/80">Offres publiées</div>
      </div>
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl shadow-lg p-6 flex flex-col items-center border-2 border-[var(--secondary)]/30">
        <FaMoneyBillWave className="h-8 w-8 text-white mb-2" />
        <div className="text-2xl font-bold text-white">{(stats.totalBudget).toLocaleString()} DA</div>
        <div className="text-xs text-white/80">Budget total</div>
        <div className="text-xs text-white/80">Moyenne: {averageBudget.toLocaleString()} DA/offre</div>
      </div>
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl shadow-lg p-6 flex flex-col items-center border-2 border-[var(--accent)]/30">
        <FaUsers className="h-8 w-8 text-white mb-2" />
        <div className="text-2xl font-bold text-white">{stats.totalFreelancers ?? 0}</div>
        <div className="text-xs text-white/80">Freelancers engagés</div>
        <div className="text-xs text-white/80">{stats.activeFreelancers ?? 0} actifs</div>
      </div>
    </div>
  );
}; 