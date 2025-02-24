// src/components/common/CustomOTPInput.tsx
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface CustomOTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CustomOTPInput = ({ length, value, onChange, disabled }: CustomOTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>(Array(length).fill(null));

  useEffect(() => {
    const otpArray = value.split("").slice(0, length);
    setOtp(otpArray.concat(Array(length - otpArray.length).fill("")));
  }, [value, length]);

  const handleChange = (index: number, newValue: string) => {
    if (newValue.length > 1 || !/^\d?$/.test(newValue)) return; // Accepte uniquement un chiffre ou vide

    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus sur le champ suivant si un chiffre est entré
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("").concat(Array(length - pastedData.length).fill(""));
      setOtp(newOtp);
      onChange(newOtp.join(""));
      inputRefs.current[Math.min(pastedData.length - 1, length - 1)]?.focus();
    }
  };

  return (
    <div className="flex space-x-2 justify-center">
      {otp.map((digit, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.9 }}
          animate={{ scale: digit ? 1 : 0.9 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <input
            ref={(el) => (inputRefs.current[index] = el!)}
            type="text"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            maxLength={1}
            disabled={disabled}
            className="w-12 h-12 text-center text-xl rounded-lg border-2 
              bg-[var(--background)] text-[var(--text)] 
              border-[var(--muted)] 
              focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 
              hover:border-[var(--primary)]/70 
              transition-all duration-200 ease-in-out 
              outline-none"
            style={{ color: "var(--text)" }}
          />
        </motion.div>
      ))}
    </div>
  );
};