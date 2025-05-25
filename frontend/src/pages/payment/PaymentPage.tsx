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
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-4 text-[var(--primary)]">Récapitulatif du paiement</h2>
              <div className="space-y-2 text-[var(--text)]">
                <div><span className="font-semibold">Titre du projet :</span> {post.title}</div>
                <div><span className="font-semibold">Montant à payer :</span> <span className="text-green-600 font-bold">{post.budget.toLocaleString()} DA</span></div>
                <div><span className="font-semibold">Client :</span> {post.client?.username}</div>
                <div><span className="font-semibold">Durée :</span> {post.duration}</div>
                {post.category && <div><span className="font-semibold">Catégorie :</span> {typeof post.category === 'object' ? post.category.name : post.category}</div>}
                <div><span className="font-semibold">Description :</span> <span className="text-sm text-[var(--muted)]">{post.description}</span></div>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-blue-700 text-sm">
                <span className="font-semibold">Sécurité :</span> Votre paiement est sécurisé et sera transféré au freelancer une fois le projet terminé.
              </div>
              <Button className="w-full mt-4" onClick={handlePay} disabled={loading}>
                {loading ? "Paiement en cours..." : "Payer maintenant"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage; 