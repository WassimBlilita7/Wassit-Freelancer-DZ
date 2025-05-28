import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { PaymentData } from "@/types";
import { getPaymentHistory } from "@/api/api";
import { useProfile } from "@/hooks/useProfile";
import PaymentHistoryList from "@/pages/payment/PaymentHistoryList";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">Historique de mes paiements</h2>
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <PaymentHistoryList payments={payments} isFreelancer={isFreelancer} />
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