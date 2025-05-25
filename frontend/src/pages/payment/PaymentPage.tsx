/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, initiatePayment, getPaymentStatus } from "@/api/api";
import { PostData, PaymentStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import Lottie from "lottie-react";
import payAnimation from "../../assets/lottie/pay.json";
import CardPaymentForm from "@/components/payment/CardPaymentForm";

const PaymentPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

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


  // Callback pour le paiement par carte (mock)
  const handleCardPay = async () => {
    if (!postId || !post) return;
    try {
      setLoading(true);
      // Ici, tu pourrais envoyer cardData à un vrai provider
      await initiatePayment(postId, post.budget);
      toast.success("Paiement initié !");
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
            <>
              <div className="flex justify-center mb-4">
                <span className="inline-block bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-1 rounded-full text-xs font-semibold shadow-sm border border-green-300 dark:border-green-700">
                  🔒 Paiement sécurisé
                </span>
              </div>
              <h2 className="text-2xl font-bold text-center mb-4 text-[var(--primary)]">Paiement par carte bancaire</h2>
              <CardPaymentForm amount={post.budget} onPay={handleCardPay} loading={loading} />
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-3 rounded text-blue-700 dark:text-blue-200 text-xs mt-4">
                <span className="font-semibold">Sécurité :</span> Les informations de votre carte ne sont pas stockées. Paiement 100% sécurisé.
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage; 