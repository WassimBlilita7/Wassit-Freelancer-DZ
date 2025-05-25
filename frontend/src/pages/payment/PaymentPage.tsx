import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, initiatePayment, getPaymentStatus } from "@/api/api";
import { PostData, PaymentStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Lottie from "lottie-react";
import payAnimation from "../../assets/lottie/pay.json";

const PaymentPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;
      setLoading(true);
      try {
        const postData = await getPostById(postId);
        setPost(postData);
        const status = await getPaymentStatus(postId);
        setPaymentStatus(status);
      } catch (err) {
        toast.error("Erreur lors du chargement du projet ou du paiement");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handlePay = async () => {
    if (!postId || !post) return;
    try {
      setLoading(true);
      await initiatePayment(postId, post.budget);
      toast.success("Paiement initié !");
      // Recharger le statut
      const status = await getPaymentStatus(postId);
      setPaymentStatus(status);
    } catch (err) {
      toast.error("Erreur lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Chargement...</div>;
  if (!post) return <div className="text-center p-8 text-red-500">Projet non trouvé</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <Card className="max-w-lg w-full">
        <CardContent className="p-8">
          {paymentStatus?.paid ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Lottie animationData={payAnimation} style={{ width: 320, height: 320 }} loop={false} />
              <div className="text-green-600 font-bold text-2xl mt-6">Projet payé avec succès !</div>
            </div>
          ) : (
            <Button className="w-full" onClick={handlePay} disabled={loading}>
              Payer maintenant
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage; 