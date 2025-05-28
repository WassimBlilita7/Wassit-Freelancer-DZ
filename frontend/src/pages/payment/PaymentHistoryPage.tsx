/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { PaymentData } from "@/types";
import { getPaymentHistory } from "@/api/api";
import { useProfile } from "@/hooks/useProfile";
import PaymentHistoryList from "@/pages/payment/PaymentHistoryList";
import { FaMoneyCheckAlt, FaWallet } from "react-icons/fa";
import Lottie from "lottie-react";
import emptyAnimation from "@/assets/lottie/notFound.json";

const PaymentHistoryPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isFreelancer } = useProfile();

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const payments = await getPaymentHistory();
        setPayments(payments || []);
      } catch (err) {
        toast.error("Erreur lors du chargement des paiements");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Calculs pour le résumé
  const totalAmount = useMemo(() => payments.reduce((sum, p) => sum + (p.amount || 0), 0), [payments]);
  const totalPayments = payments.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 dark:from-[#181c2a] dark:via-[#23243a] dark:to-[#181c2a] py-8 px-2">
      <Card className="max-w-2xl w-full shadow-2xl border-0 bg-white/90 dark:bg-[#23243a]/90">
        <CardContent className="p-8">
          <div className="flex flex-col items-center mb-6">
            <FaWallet className="text-4xl text-[var(--primary)] mb-2 drop-shadow" />
            <h2 className="text-3xl font-extrabold text-[var(--primary)] dark:text-blue-200 mb-1 tracking-tight">Historique de mes paiements</h2>
            <p className="text-[var(--muted)] text-sm dark:text-blue-100">Consultez tous vos paiements et téléchargez vos reçus.</p>
          </div>

          {/* Résumé */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-100/60 to-pink-100/40 dark:from-blue-900/30 dark:to-pink-900/20 rounded-xl p-4 mb-8 shadow">
            <div className="flex items-center gap-2">
              <FaMoneyCheckAlt className="text-xl text-green-600 dark:text-green-300" />
              <span className="font-semibold text-lg text-green-700 dark:text-green-200">{totalPayments}</span>
              <span className="text-[var(--muted)] text-sm ml-1">paiement{totalPayments > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--muted)] text-sm">Total</span>
              <span className="font-bold text-xl text-[var(--primary)] dark:text-blue-200">{totalAmount.toLocaleString()} DA</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px] text-[var(--muted)]">Chargement...</div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-48 h-48 mb-4">
                <Lottie animationData={emptyAnimation} loop={true} />
              </div>
              <div className="text-xl font-semibold text-[var(--primary)] mb-2">Aucun paiement trouvé</div>
              <div className="text-[var(--muted)] text-center max-w-xs mb-4">Vous n'avez pas encore effectué ou reçu de paiements sur la plateforme.</div>
              <Button variant="outline" onClick={() => navigate(-1)} className="mt-2">Retour</Button>
            </div>
          ) : (
            <>
              <PaymentHistoryList payments={payments} isFreelancer={isFreelancer} />
              <Button variant="ghost" className="w-full mt-4" onClick={() => navigate(-1)}>
                Retour
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistoryPage; 