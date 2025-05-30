import React from "react";
import { PaymentData } from "@/types";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { downloadPaymentReceipt } from "@/components/payment/paymentPdfUtils";
import { FaFilePdf } from "react-icons/fa";

interface PaymentHistoryListProps {
  payments: PaymentData[];
  isFreelancer: boolean;
}

const UserAvatar: React.FC<{ profilePicture?: string; username: string }> = ({ profilePicture, username }) => (
  profilePicture ? (
    <img src={profilePicture} alt={username} className="w-8 h-8 rounded-full object-cover border-2 border-[var(--primary)] shadow" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-lg shadow">
      {username.charAt(0).toUpperCase()}
    </div>
  )
);

const UserLink: React.FC<{ username: string; children: React.ReactNode }> = ({ username, children }) => {
  const navigate = useNavigate();
  return (
    <button
      className="font-semibold text-[var(--primary)] hover:text-[var(--secondary)] transition-colors underline-offset-2 hover:underline focus:outline-none"
      onClick={() => navigate(`/profile/${username}`)}
      tabIndex={0}
      aria-label={`Voir le profil de ${username}`}
      type="button"
    >
      {children}
    </button>
  );
};

function isRecent(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
  return diff <= 7;
}

const PaymentHistoryList: React.FC<PaymentHistoryListProps> = ({ payments, isFreelancer }) => {
  if (!payments || payments.length === 0) {
    return <div className="text-center text-[var(--muted)] py-8">Aucun paiement trouvé.</div>;
  }
  return (
    <ul className="divide-y divide-[var(--muted)]/30 dark:divide-blue-900/60">
      {payments.map((p, idx) => {
        const post = typeof p.postId === "object" ? p.postId : undefined;
        const client = typeof p.clientId === "object" ? p.clientId : undefined;
        const freelancer = typeof p.freelancerId === "object" ? p.freelancerId : undefined;
        const isRecentPayment = isRecent(p.createdAt);
        return (
          <motion.li
            key={p._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="py-5 px-4 md:px-8 bg-gradient-to-br from-white via-[var(--card)] to-blue-50 dark:from-[#23243a] dark:via-[#23243a] dark:to-[#23243a] rounded-2xl shadow-lg mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-2xl transition-shadow duration-300 border border-[var(--primary)]/20"
            style={{ minHeight: 80 }}
          >
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-lg text-[var(--primary)] truncate drop-shadow-sm dark:text-blue-100">
                  {post?.title ?? String(p.postId)}
                  {isRecentPayment && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200 animate-pulse">Nouveau</span>
                  )}
                </span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === "succeeded" ? "bg-green-200 text-green-900 dark:bg-green-700/30 dark:text-green-100" : "bg-red-200 text-red-800 dark:bg-red-700/30 dark:text-red-200"}`}>{p.status === "succeeded" ? "Payé" : "En attente"}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-1">
                <span className="text-[var(--primary)] text-base font-semibold dark:text-blue-100">{p.amount.toLocaleString()} DA</span>
                {!isFreelancer && post?.status && (
                  <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 rounded-full px-2 py-0.5 ml-2">{post.status}</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2">
                {isFreelancer ? (
                  <>
                    <UserAvatar profilePicture={client?.profile?.profilePicture} username={client?.username || "?"} />
                    {client?.username ? (
                      <UserLink username={client.username}>{client.username}</UserLink>
                    ) : (
                      <span className="font-medium text-[var(--text)] dark:text-blue-100">{typeof p.clientId === 'string' ? p.clientId : p.clientId?.username ?? ''}</span>
                    )}
                  </>
                ) : (
                  <>
                    <UserAvatar profilePicture={freelancer?.profile?.profilePicture} username={freelancer?.username || "?"} />
                    {freelancer?.username ? (
                      <UserLink username={freelancer.username}>{freelancer.username}</UserLink>
                    ) : (
                      <span className="font-medium text-[var(--text)] dark:text-blue-100">{typeof p.freelancerId === 'string' ? p.freelancerId : p.freelancerId?.username ?? ''}</span>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end min-w-[120px] gap-2">
              <span className="text-xs text-[var(--muted)] mb-1 dark:text-blue-200">{new Date(p.createdAt).toLocaleDateString()}<br />{new Date(p.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                className={`px-3 py-1 rounded-full text-xs font-bold shadow ${p.status === "succeeded" ? "bg-green-200 text-green-900 dark:bg-green-700/30 dark:text-green-100" : "bg-red-200 text-red-800 dark:bg-red-700/30 dark:text-red-200"}`}
              >
                {p.status === "succeeded" ? "Succès" : "En attente"}
              </motion.div>
              <div className="relative group w-full flex justify-end">
                <button
                  className="mt-2 px-4 py-1 rounded-lg bg-[var(--primary)] text-white font-semibold text-xs shadow hover:bg-[var(--secondary)] transition-all flex items-center gap-2 border-2 border-transparent hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 dark:focus:ring-blue-400 dark:focus:ring-offset-[#23243a] hover:scale-105 hover:shadow-2xl"
                  onClick={() => downloadPaymentReceipt(p)}
                  aria-label="Télécharger le reçu PDF"
                  title="Télécharger le reçu PDF"
                >
                  <motion.span
                    whileHover={{ scale: 1.2, rotate: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaFilePdf className="text-red-500" />
                  </motion.span>
                  <span className="hidden md:inline">Télécharger</span>
                </button>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-lg">
                  Télécharger le reçu PDF
                </span>
              </div>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
};

export default PaymentHistoryList; 