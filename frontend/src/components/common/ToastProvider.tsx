// src/components/common/ToastProvider.tsx
import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "8px",
          padding: "16px",
          fontSize: "14px",
          backgroundColor: "var(--card)",
          color: "var(--text)",
        },
        success: { style: { border: "2px solid var(--success)" } },
        error: { style: { border: "2px solid var(--error)" } },
      }}
    />
  );
};