/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaymentData } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { downloadPaymentReceiptFromServer } from "@/api/api";
import logo from "@/assets/logo/logo-transparent-png.png";

export async function downloadPaymentReceipt(payment: PaymentData) {
  // Try to use backend endpoint if payment._id exists
  if (payment._id) {
    try {
      await downloadPaymentReceiptFromServer(payment._id);
      return;
    } catch (e) {
      // fallback to client-side PDF
    }
  }
  // Fallback: client-side PDF
  const doc = new jsPDF();
  const post = typeof payment.postId === "object" ? payment.postId : undefined;
  const client = typeof payment.clientId === "object" ? payment.clientId : undefined;
  const freelancer = typeof payment.freelancerId === "object" ? payment.freelancerId : undefined;

  // Add logo (small, centered)
  try {
    doc.addImage(logo, "PNG", 85, 8, 40, 18);
  } catch (err) {
    // If logo fails to load, continue without it
  }

  // Modern header
  doc.setFontSize(18);
  doc.setTextColor(41, 128, 185);
  doc.text("Reçu de Paiement", 105, 32, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text("Merci d'avoir utilisé Wassit Freelance DZ !", 105, 39, { align: "center" });

  // Payment details
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Date: ${new Date(payment.createdAt).toLocaleString()}`, 14, 50);
  doc.text(`ID Paiement: ${payment._id}`, 14, 57);

  // Get finalY from autoTable
  const { finalY } = (autoTable(doc, {
    startY: 64,
    head: [["Détail", "Valeur"]],
    body: [
      ["Projet", post?.title ?? String(payment.postId)],
      ["Montant", `${payment.amount.toLocaleString()} DA`],
      ["Statut", payment.status === "succeeded" ? "Succès" : payment.status],
      ["Client", client?.username ?? String(payment.clientId)],
      ["Freelancer", freelancer?.username ?? String(payment.freelancerId)],
      ["Date", new Date(payment.createdAt).toLocaleString()],
      ["Moyen de paiement", payment.provider],
    ],
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    bodyStyles: { textColor: 50 },
    styles: { fontSize: 11, cellPadding: 3 },
  }) as any) || { finalY: 104 };

  // Modern footer
  doc.setFontSize(11);
  doc.setTextColor(41, 128, 185);
  doc.text("Ce reçu atteste que la transaction a été traitée avec succès.", 105, (finalY || 104) + 14, { align: "center" });
  doc.setTextColor(80, 80, 80);
  doc.text("Pour toute question ou assistance, contactez-nous : support@wassitfreelance.dz", 105, (finalY || 104) + 22, { align: "center" });
  doc.setTextColor(120, 120, 120);
  doc.text("Merci pour votre confiance et bonne continuation sur Wassit Freelance DZ !", 105, (finalY || 104) + 30, { align: "center" });

  doc.save(`recu_paiement_${payment._id}.pdf`);
} 