import Payment from "../models/paymentModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import PDFDocument from "pdfkit";
import fs from "fs";

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
    // Notifier le freelancer
    const clientUser = await User.findById(clientId);
    const notification = new Notification({
      recipient: freelancerId,
      sender: clientId,
      post: postId,
      type: "project_paid",
      message: `${clientUser?.username || "Un client"} a payé le projet "${post.title}". Les fonds sont désormais disponibles après validation.`
    });
    await notification.save();
    await User.findByIdAndUpdate(freelancerId, { $push: { notifications: notification._id } });
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
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    let payments;
    if (user.isFreelancer) {
      payments = await Payment.find({ freelancerId: userId })
        .populate({ path: 'postId', select: 'title budget client status' })
        .populate({ path: 'clientId', select: 'username email profile.profilePicture' })
        .sort({ createdAt: -1 });
    } else {
      payments = await Payment.find({ clientId: userId })
        .populate({ path: 'postId', select: 'title budget freelancerId status' })
        .populate({ path: 'freelancerId', select: 'username email profile.profilePicture' })
        .sort({ createdAt: -1 });
    }
    res.status(200).json({ payments });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

export const downloadPaymentReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId)
      .populate({ path: 'postId', select: 'title' })
      .populate({ path: 'clientId', select: 'username email' })
      .populate({ path: 'freelancerId', select: 'username email' });
    if (!payment) return res.status(404).json({ message: "Paiement non trouvé" });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="recu_paiement_${payment._id}.pdf"`);
    doc.pipe(res);

    doc.fontSize(20).text('Reçu de Paiement', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`ID Paiement: ${payment._id}`);
    doc.text(`Date: ${new Date(payment.createdAt).toLocaleString()}`);
    doc.text(`Projet: ${payment.postId?.title || payment.postId}`);
    doc.text(`Montant: ${payment.amount.toLocaleString()} DA`);
    doc.text(`Statut: ${payment.status}`);
    doc.text(`Client: ${payment.clientId?.username || payment.clientId}`);
    doc.text(`Freelancer: ${payment.freelancerId?.username || payment.freelancerId}`);
    doc.text(`Moyen de paiement: ${payment.provider}`);
    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}; 