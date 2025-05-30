import Payment from "../models/paymentModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import QRCode from 'qrcode';

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

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="recu_paiement_${payment._id}.pdf"`);
    doc.pipe(res);

    // Logo centré
    try {
      doc.image('backend/assets/logo.png', doc.page.width / 2 - 50, 30, { width: 100, align: 'center' });
    } catch (e) {}

    // En-tête moderne (sans le titre)
    doc.moveDown(4);
    doc.fontSize(13).fillColor('#2d3e50').font('Helvetica-Bold').text("", { align: 'center' });
    doc.moveDown(1.2);

    // Séparateur
    doc.moveTo(60, doc.y).lineTo(480, doc.y).strokeColor('#2980B9').lineWidth(1.5).stroke();
    doc.moveDown(1.5);

    // Tableau de détails amélioré
    const details = [
      ['ID Paiement', payment._id.toString()],
      ['Date', new Date(payment.createdAt).toLocaleString()],
      ['Projet', payment.postId?.title || payment.postId],
      ['Montant', `${payment.amount.toLocaleString()} DA`],
      ['Statut', payment.status === 'succeeded' ? 'Succès' : payment.status],
      ['Client', payment.clientId?.username || payment.clientId],
      ['Freelancer', payment.freelancerId?.username || payment.freelancerId],
      ['Moyen de paiement', payment.provider],
    ];
    const startY = doc.y;
    const col1Width = 140;
    const col2Width = 320;
    const rowHeight = 28;
    details.forEach(([label, value], i) => {
      const y = startY + i * rowHeight;
      // Label
      doc
        .roundedRect(60, y, col1Width, rowHeight, 7)
        .fillAndStroke(i % 2 === 0 ? '#2980B9' : '#3b5998', '#2980B9')
        .fillColor('#fff')
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(label, 68, y + 8, { width: col1Width - 16, align: 'left' });
      // Value
      doc
        .roundedRect(60 + col1Width, y, col2Width, rowHeight, 7)
        .fillAndStroke(i % 2 === 0 ? '#f4f8fb' : '#e1e8ed', '#e1e8ed')
        .fillColor('#222')
        .font('Helvetica')
        .fontSize(12)
        .text(value, 68 + col1Width, y + 8, { width: col2Width - 16, align: 'left' });
    });
    doc.moveDown(2);

    // Footer moderne
    const footerY = startY + details.length * rowHeight + 40;
    doc.fontSize(12).fillColor('#2980B9').font('Helvetica-Bold').text(
      'Ce reçu atteste que la transaction a été traitée avec succès.',
      60,
      footerY,
      { align: 'center', width: 400 }
    );
    doc.fontSize(10).fillColor('#555').font('Helvetica').text(
      'Pour toute question ou assistance, contactez-nous : wassitfreelancerdz@gmail.com',
      60,
      footerY + 22,
      { align: 'center', width: 400 }
    );
    doc.fontSize(10).fillColor('#888').text(
      'Merci pour votre confiance et bonne continuation sur Wassit Freelance DZ !',
      60,
      footerY + 40,
      { align: 'center', width: 400 }
    );

    // QR code centré en bas
    const qrText = `https://wassitfreelance.dz/payment/receipt/${payment._id}`;
    const qrDataUrl = await QRCode.toDataURL(qrText, { width: 100, margin: 1 });
    const img = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(img, 'base64');
    const qrX = doc.page.width / 2 - 30;
    const qrY = doc.page.height - 120;
    doc.image(qrBuffer, qrX, qrY, { width: 60, height: 60 });
    doc.fontSize(9).fillColor('#2980B9').text('', qrX - 10, qrY + 65, { width: 80, align: 'center' });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}; 