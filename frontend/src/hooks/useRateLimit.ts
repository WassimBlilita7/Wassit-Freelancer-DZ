/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/useRateLimit.ts
import { useState, useEffect } from "react";
import toast, { ToastOptions } from "react-hot-toast";

interface RateLimitConfig {
  maxAttempts: number; 
  lockoutTime: number; 
  storageKey?: string; 
  toastOptions?: {
    lockedMessage?: string;
    unlockedMessage?: string;
    style?: ToastOptions;
  };
}

export const useRateLimit = ({
  maxAttempts,
  lockoutTime,
  storageKey = "rateLimit",
  toastOptions,
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

  useEffect(() => {
    if (lockoutStart) {
      const timeElapsed = Date.now() - lockoutStart;
      if (timeElapsed < lockoutTime) {
        setIsLocked(true);
        const remainingTime = lockoutTime - timeElapsed;
        setTimeout(() => {
          clearLockout();
        }, remainingTime);
      } else {
        clearLockout(); 
      }
    }
  }, [lockoutStart, lockoutTime]);

  useEffect(() => {
    if (attempts >= maxAttempts && !isLocked) {
      const startTime = Date.now();
      setIsLocked(true);
      setLockoutStart(startTime);
      localStorage.setItem(`${storageKey}_attempts`, attempts.toString());
      localStorage.setItem(`${storageKey}_lockoutStart`, startTime.toString());

      toast.error(
        toastOptions?.lockedMessage || `Trop de tentatives. Réessayez dans ${lockoutTime / 60000} minutes.`,
        toastOptions?.style || {}
      );

      const timer = setTimeout(() => {
        clearLockout();
      }, lockoutTime);

      return () => clearTimeout(timer);
    }
  }, [attempts, maxAttempts, lockoutTime, toastOptions, isLocked, storageKey]);

  const clearLockout = () => {
    setAttempts(0);
    setIsLocked(false);
    setLockoutStart(null);
    localStorage.removeItem(`${storageKey}_attempts`);
    localStorage.removeItem(`${storageKey}_lockoutStart`);
    toast.success(
      toastOptions?.unlockedMessage || "Vous pouvez réessayer maintenant.",
      toastOptions?.style || {}
    );
  };

  const attemptAction = (action: () => void) => {
    if (isLocked) {
      toast.error("Action bloquée temporairement.", toastOptions?.style || {});
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

  return { isLocked, attempts, attemptAction };
};