/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaymentData } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { downloadPaymentReceiptFromServer } from "@/api/api";

export async function downloadPaymentReceipt(payment: PaymentData, isFreelancer: boolean) {
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

  doc.setFontSize(18);
  doc.text("Reçu de Paiement", 14, 18);
  doc.setFontSize(12);
  doc.text(`Date: ${new Date(payment.createdAt).toLocaleString()}`, 14, 28);
  doc.text(`ID Paiement: ${payment._id}`, 14, 36);

  autoTable(doc, {
    startY: 44,
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
  });

  doc.save(`recu_paiement_${payment._id}.pdf`);
} 