// src/components/common/Loader.tsx
import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
        <span style={{ color: "#FFFFFF", fontSize: "18px" }}>Chargement...</span>
      </div>
    </div>
  );
};