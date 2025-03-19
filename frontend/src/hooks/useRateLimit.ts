/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/useRateLimit.ts
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface RateLimitConfig {
  maxAttempts: number;
  lockoutTime: number; // En millisecondes
  storageKey?: string;
  toastOptions?: {
    lockedMessage?: string;
    unlockedMessage?: string;
    style?: Record<string, any>;
  };
  onUnlock?: () => void;
}

export const useRateLimit = ({
  maxAttempts,
  lockoutTime,
  storageKey = "rateLimit",
  toastOptions,
  onUnlock,
}: RateLimitConfig) => {
  const [attempts, setAttempts] = useState(() => {
    const stored = localStorage.getItem(`${storageKey}_attempts`);
    return stored ? parseInt(stored, 10) : 0;
  });
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutStart, setLockoutStart] = useState(() => {
    const stored = localStorage.getItem(`${storageKey}_lockoutStart`);
    return stored ? parseInt(stored, 10) : null;
  });
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const calculateRemainingTime = () => {
    if (!lockoutStart) return null;
    const timeElapsed = Date.now() - lockoutStart;
    const timeLeft = lockoutTime - timeElapsed;
    return timeLeft > 0 ? timeLeft : 0;
  };

  useEffect(() => {
    if (lockoutStart) {
      const updateRemainingTime = () => {
        const timeLeft = calculateRemainingTime();
        if (timeLeft && timeLeft > 0) {
          setIsLocked(true);
          setRemainingTime(timeLeft);
        } else {
          clearLockout();
        }
      };

      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 1000);
      return () => clearInterval(interval);
    } else {
      setIsLocked(false);
      setRemainingTime(null);
    }
  }, [lockoutStart, lockoutTime]);

  useEffect(() => {
    if (attempts >= maxAttempts && !lockoutStart) {
      const startTime = Date.now();
      setIsLocked(true);
      setLockoutStart(startTime);
      setRemainingTime(lockoutTime);
      localStorage.setItem(`${storageKey}_attempts`, attempts.toString());
      localStorage.setItem(`${storageKey}_lockoutStart`, startTime.toString());

      console.log("Blocage démarré à :", new Date(startTime).toLocaleString());
      toast.error(
        `Trop de tentatives. Réessayez dans ${lockoutTime / 60000} minutes.`,
        toastOptions?.style || {}
      );
    }
  }, [attempts, maxAttempts, lockoutTime, lockoutStart, storageKey, toastOptions]);

  const clearLockout = () => {
    console.log("Déblocage effectué à :", new Date().toLocaleString());
    setAttempts(0);
    setIsLocked(false);
    setLockoutStart(null);
    setRemainingTime(null);
    localStorage.removeItem(`${storageKey}_attempts`);
    localStorage.removeItem(`${storageKey}_lockoutStart`);
    toast.success("Vous pouvez réessayer maintenant.", toastOptions?.style || {});
    if (onUnlock) onUnlock();
  };

  const attemptAction = (action: () => void) => {
    if (isLocked) {
      const minutesLeft = remainingTime ? Math.ceil(remainingTime / 60000) : lockoutTime / 60000;
      toast.error(`Action bloquée. Attendez ${minutesLeft} minute(s).`, toastOptions?.style || {});
      return false;
    }
    setAttempts((prev) => {
      const newAttempts = prev + 1;
      localStorage.setItem(`${storageKey}_attempts`, newAttempts.toString());
      return newAttempts;
    });
    action();
    return true;
  };

  return { isLocked, attempts, attemptAction, remainingTime };
};