import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

interface CardPaymentFormProps {
  amount: number;
  onPay: (cardData: { cardNumber: string; cardName: string; expMonth: string; expYear: string; cvv: string }) => void;
  loading?: boolean;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({ amount, onPay, loading }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !expMonth || !expYear || !cvv) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (isNaN(Number(expMonth)) || Number(expMonth) < 1 || Number(expMonth) > 12) {
      setError("Le mois d'expiration doit être entre 01 et 12.");
      return;
    }
    if (isNaN(Number(expYear)) || Number(expYear) <= 25) {
      setError("L'année d'expiration doit être supérieure à 2025.");
      return;
    }
    if (!/^\d{3}$/.test(cvv)) {
      setError("Le CVV doit contenir exactement 3 chiffres.");
      return;
    }
    setError(null);
    onPay({ cardNumber, cardName, expMonth, expYear, cvv });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Carte visuelle */}
      <div className={`rounded-xl card-gradient shadow-lg p-6 flex flex-col gap-2 text-white relative ${theme === 'dark' ? 'card-gradient-dark' : 'card-gradient-light'}`}>
        <div className="text-lg font-bold tracking-widest">BANK</div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl tracking-widest">{cardNumber.padEnd(16, "•").replace(/(.{4})/g, "$1 ")}</span>
        </div>
        <div className="flex justify-between mt-4 text-xs">
          <span>{cardName || "CARDHOLDER NAME"}</span>
          <span>{expMonth && expYear ? `${expMonth}/${expYear}` : "MM/YY"}</span>
        </div>
      </div>
      {/* Champs du formulaire */}
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Numéro de carte"
          maxLength={16}
          value={cardNumber}
          onChange={e => setCardNumber(e.target.value.replace(/[^0-9]/g, ""))}
          className="rounded-lg border px-4 py-3 bg-[var(--background)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all shadow-sm"
        />
        <input
          type="text"
          placeholder="Nom du titulaire"
          value={cardName}
          onChange={e => setCardName(e.target.value.toUpperCase())}
          className="rounded-lg border px-4 py-3 bg-[var(--background)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all shadow-sm"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="MM"
            maxLength={2}
            value={expMonth}
            onChange={e => setExpMonth(e.target.value.replace(/[^0-9]/g, ""))}
            className="rounded-lg border px-2 py-3 w-16 bg-[var(--background)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all shadow-sm"
          />
          <input
            type="text"
            placeholder="YY"
            maxLength={2}
            value={expYear}
            onChange={e => setExpYear(e.target.value.replace(/[^0-9]/g, ""))}
            className="rounded-lg border px-2 py-3 w-16 bg-[var(--background)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all shadow-sm"
          />
          <input
            type="password"
            placeholder="CVV"
            maxLength={3}
            value={cvv}
            onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
            className="rounded-lg border px-2 py-3 w-20 bg-[var(--background)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all shadow-sm"
          />
        </div>
      </div>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <Button
        type="submit"
        className="w-full bg-gradient-to-tr from-green-400 to-green-600 text-white text-lg font-bold py-3 rounded-lg shadow-lg hover:from-green-500 hover:to-green-700 transition-all"
        disabled={loading}
      >
        {loading ? "Paiement en cours..." : `Payer ${amount.toLocaleString()} DA`}
      </Button>
    </form>
  );
};

export default CardPaymentForm; 