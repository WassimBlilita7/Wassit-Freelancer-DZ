import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { PaymentData } from "@/types";

const PaymentHistoryPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/v1/payment/history", { withCredentials: true });
        setPayments(res.data.payments || []);
      } catch (err) {
        toast.error("Erreur lors du chargement des paiements");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">Historique de mes paiements</h2>
          {loading ? (
            <div>Chargement...</div>
          ) : payments.length === 0 ? (
            <div>Aucun paiement trouvé.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {payments.map((p) => (
                <li key={p._id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold">Projet : {p.postId}</div>
                    <div>Montant : <span className="text-[var(--primary)] font-bold">{p.amount.toLocaleString()} DA</span></div>
                    <div>Status : <span className={p.status === "succeeded" ? "text-green-600" : "text-red-600"}>{p.status}</span></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 md:mt-0">{new Date(p.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
          <Button variant="ghost" className="w-full mt-4" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistoryPage; 