import { useState, useEffect } from "react";
import { getClientStats, getClientStatsByUsername, getFreelancerStats, getFreelancerStatsByUsername } from "../api/api";
import { toast } from "react-hot-toast";
import { FreelancerStats } from "../types";

interface ClientStats {
  totalOffers: number;
  activeOffers: number;
  completedOffers: number;
  totalBudget: number;
  totalFreelancers: number;
  activeFreelancers: number;
}

export const useClientStats = (username?: string) => {
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      console.log("Fetching client stats...");
      setLoading(true);
      setError(null);
      
      const data = username ? await getClientStatsByUsername(username) : await getClientStats();
      console.log("Client stats response:", data);
      
      // Correction robuste : désimbrication récursive
      let statsObj = data;
      while (
        statsObj &&
        typeof statsObj === "object" &&
        "stats" in statsObj &&
        typeof statsObj.stats === "object"
      ) {
        statsObj = statsObj.stats;
      }
      console.log("Stats object used:", statsObj);

      if (statsObj && typeof statsObj === 'object') {
        // Vérifier que toutes les propriétés requises sont présentes
        const requiredStats: (keyof ClientStats)[] = [
          'totalOffers',
          'activeOffers',
          'completedOffers',
          'totalBudget',
          'totalFreelancers',
          'activeFreelancers'
        ];

        const missingStats = requiredStats.filter(stat => statsObj[stat] === undefined);
        
        if (missingStats.length > 0) {
          console.warn("Missing stats:", missingStats);
          // Convertir les valeurs manquantes en 0
          const processedData = {
            ...statsObj,
            ...Object.fromEntries(missingStats.map(stat => [stat, 0]))
          };
          setStats(processedData as ClientStats);
        } else {
          setStats(statsObj as ClientStats);
        }
      } else {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error fetching client stats:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch client statistics";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [username]);

  return { stats, loading, error, refetch: fetchStats };
};

export const useFreelancerStats = (username?: string) => {
  const [stats, setStats] = useState<FreelancerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (username) {
          data = await getFreelancerStatsByUsername(username);
        } else {
          data = await getFreelancerStats();
        }
        setStats(data.stats);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [username]);

  return { stats, loading, error };
}; 