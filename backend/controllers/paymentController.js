import Payment from "../models/paymentModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

// Initie un paiement (mock)
export const initiatePayment = async (req, res) => {
  try {
    const { postId, amount } = req.body;
    if (!postId) {
      return res.status(400).json({ message: "postId manquant" });
    }
    if (amount === undefined || amount === null) {
      return res.status(400).json({ message: "amount manquant" });
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "amount invalide" });
    }
    const clientId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Projet non trouvé" });
    if (post.paid) return res.status(400).json({ message: "Projet déjà payé" });
    if (String(post.client) !== String(clientId)) return res.status(403).json({ message: "Non autorisé" });
    // Trouver le freelancer accepté
    const acceptedApp = post.applications.find(app => app.status === "accepted");
    if (!acceptedApp) return res.status(400).json({ message: "Aucun freelancer accepté pour ce projet" });
    let freelancerId = acceptedApp.freelancer;
    if (freelancerId && typeof freelancerId === 'object' && freelancerId._id) {
      freelancerId = freelancerId._id;
    }
    // Créer le paiement
    const transactionId = `mock_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const payment = new Payment({
      postId,
      clientId,
      freelancerId,
      amount,
      status: "succeeded", // Mock: paiement réussi directement
      provider: "mock",
      transactionId
    });
    await payment.save();
    post.paid = true;
    await post.save();
    res.status(201).json({ message: "Paiement effectué avec succès", payment });
  } catch (err) {
    console.error("Erreur dans initiatePayment:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Vérifie le paiement (mock, toujours succeeded)
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Paiement non trouvé" });
    payment.status = "succeeded";
    await payment.save();
    // Met à jour le post
    const post = await Post.findById(payment.postId);
    if (post) {
      post.paid = true;
      await post.save();
    }
    res.status(200).json({ message: "Paiement vérifié", payment });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Statut du paiement
export const getPaymentStatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const payment = await Payment.findOne({ postId });
    const post = await Post.findById(postId);
    res.status(200).json({
      status: payment ? payment.status : "pending",
      paymentId: payment ? payment._id : undefined,
      paid: post ? !!post.paid : false
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const clientId = req.user.id;
    const payments = await Payment.find({ clientId }).sort({ createdAt: -1 });
    res.status(200).json({ payments });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}; 