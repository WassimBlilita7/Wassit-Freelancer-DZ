// src/components/home/StatsSection.tsx
import { motion } from "framer-motion";
import { FaUsers, FaProjectDiagram, FaSmile } from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "../../context/ThemeContext";

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

export const StatsSection = () => {
  const { theme } = useTheme();

  // Données fictives pour les statistiques
  const statsData = {
    users: 15000, // Nombre d'utilisateurs
    projects: 5000, // Projets complétés
    satisfaction: 92, // Taux de satisfaction (%)
  };

  // Données pour le graphique à barres (croissance des utilisateurs)
  const barDataUsers = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        label: "Nouveaux utilisateurs",
        data: [500, 700, 1000, 1200, 1500, 2000],
        backgroundColor: theme === "dark" ? "#C40D6C" : "#2770D1",
        borderColor: theme === "dark" ? "#FFFFFF" : "#333333",
        borderWidth: 1,
      },
    ],
  };

  // Données pour le graphique en courbe (évolution des projets)
  const lineDataProjects = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        label: "Projets complétés",
        data: [200, 350, 600, 900, 1200, 1500],
        fill: false,
        borderColor: theme === "dark" ? "#C40D6C" : "#2770D1",
        backgroundColor: theme === "dark" ? "#C40D6C" : "#2770D1",
        tension: 0.4, // Courbure des lignes
        pointBackgroundColor: theme === "dark" ? "#FFFFFF" : "#333333",
        pointBorderColor: theme === "dark" ? "#C40D6C" : "#2770D1",
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: theme === "dark" ? "#1F2937" : "#E5E7EB" },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: theme === "dark" ? "#FFFFFF" : "#333333" } },
      x: { ticks: { color: theme === "dark" ? "#FFFFFF" : "#333333" } },
    },
  };

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "var(--text)" }}>
        Pourquoi choisir DZFreelancer ? Les chiffres parlent !
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center p-6 rounded-xl shadow-lg"
          style={{ backgroundColor: "var(--card)" }}
        >
          <FaUsers className="text-5xl mb-4" style={{ color: "var(--primary)" }} />
          <h3 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>{statsData.users.toLocaleString()}</h3>
          <p style={{ color: "var(--muted)" }}>Utilisateurs inscrits</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col items-center p-6 rounded-xl shadow-lg"
          style={{ backgroundColor: "var(--card)" }}
        >
          <FaProjectDiagram className="text-5xl mb-4" style={{ color: "var(--secondary)" }} />
          <h3 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>{statsData.projects.toLocaleString()}</h3>
          <p style={{ color: "var(--muted)" }}>Projets complétés</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col items-center p-6 rounded-xl shadow-lg"
          style={{ backgroundColor: "var(--card)" }}
        >
          <FaSmile className="text-5xl mb-4" style={{ color: "var(--primary)" }} />
          <h3 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>{statsData.satisfaction}%</h3>
          <p style={{ color: "var(--muted)" }}>Satisfaction des utilisateurs</p>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="p-6 rounded-xl shadow-lg"
          style={{ backgroundColor: "var(--card)" }}
        >
          <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--text)" }}>Croissance des utilisateurs</h3>
          <Bar data={barDataUsers} options={chartOptions} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="p-6 rounded-xl shadow-lg"
          style={{ backgroundColor: "var(--card)" }}
        >
          <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--text)" }}>Évolution des projets</h3>
          <Line data={lineDataProjects} options={chartOptions} />
        </motion.div>
      </div>
    </section>
  );
};