import { useState } from "react";
import { askAI } from "../api/ai";

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export function useAIChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (userMessage: string) => {
    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    try {
      const aiResponse = await askAI(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (e: any) {
      setError("Erreur lors de la communication avec l'IA.");
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => setMessages([]);

  return { messages, loading, error, sendMessage, resetChat };
} 