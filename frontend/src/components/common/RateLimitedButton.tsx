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
  onUnlock?: () => void;
}

export const RateLimitedButton = ({
  onClick,
  children,
  maxAttempts = 5,
  lockoutTime = 5 * 60 * 1000, // 5 minutes (300000 ms)
  loading = false,
  storageKey = "rateLimit",
  toastOptions,
  onUnlock,
}: RateLimitedButtonProps) => {
  const { isLocked, attemptAction, remainingTime } = useRateLimit({
    maxAttempts,
    lockoutTime,
    storageKey,
    toastOptions,
    onUnlock,
  });

  const handleClick = () => {
    attemptAction(onClick);
  };

  const formatTime = (timeMs: number) => {
    const totalSeconds = Math.ceil(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes >= 1) {
      return `${minutes} min ${seconds} s`;
    }
    return `${totalSeconds} s`;
  };

  return (
    <motion.div whileHover={{ scale: isLocked ? 1 : 1.05 }} whileTap={{ scale: isLocked ? 1 : 0.95 }}>
      <Button
        onClick={handleClick}
        disabled={isLocked || loading}
        className="w-full h-12"
      >
        {loading ? (
          <ClipLoader size={20} color="#fff" />
        ) : isLocked && remainingTime !== null ? (
          `Bloqué (${formatTime(remainingTime)})`
        ) : (
          children
        )}
      </Button>
    </motion.div>
  );
};