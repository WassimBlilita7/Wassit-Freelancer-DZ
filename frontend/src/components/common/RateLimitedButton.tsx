// src/components/common/RateLimitedButton.tsx
import { Button } from "../ui/button";
import { useRateLimit } from "../../hooks/useRateLimit";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

interface RateLimitedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  maxAttempts?: number;
  lockoutTime?: number;
  loading?: boolean;
  storageKey?: string;
  toastOptions?: {
    lockedMessage?: string;
    unlockedMessage?: string;
    style?: Record<string, any>;
  };
}

export const RateLimitedButton = ({
  onClick,
  children,
  maxAttempts = 5, 
  lockoutTime = 15 * 60 * 1000, // 15 minutes 
  loading = false,
  storageKey = "rateLimit",
  toastOptions,
}: RateLimitedButtonProps) => {
  const { isLocked, attemptAction } = useRateLimit({ maxAttempts, lockoutTime, storageKey, toastOptions });

  const handleClick = () => {
    attemptAction(onClick);
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={handleClick}
        disabled={isLocked || loading}
        className="w-full py-6 text-lg bg-[var(--primary)]"
        style={{ color: "var(--card)" }}
      >
        {loading ? (
          <ClipLoader size={20} color="var(--card)" className="mr-2" />
        ) : null}
        {isLocked ? "Bloqué" : children}
      </Button>
    </motion.div>
  );
};