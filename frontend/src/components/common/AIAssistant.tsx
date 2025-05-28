import { useState, useRef, useEffect } from "react";
import { useAIChat } from "../../hooks/useAIChat";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

export const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, loading, error, sendMessage, resetChat } = useAIChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <>
      {/* Bouton flottant pour ouvrir l'assistant */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
        onClick={() => setOpen((o) => !o)}
        aria-label="Ouvrir l'assistant IA"
      >
        <FaRobot size={28} />
      </button>
      {/* Fenêtre de chat IA */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[95vw] bg-[var(--card)] rounded-2xl shadow-2xl border border-[var(--primary)] flex flex-col overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white">
            <span className="font-bold flex items-center gap-2"><FaRobot /> Assistant IA</span>
            <button onClick={() => setOpen(false)} aria-label="Fermer" className="hover:text-[var(--accent)]"><FaTimes /></button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto max-h-80 bg-[var(--background)]">
            {messages.length === 0 && (
              <div className="text-center text-[var(--muted)] py-8">Posez-moi une question sur la plateforme, les freelances, les projets, etc.</div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-3 py-2 rounded-xl max-w-[80%] text-sm shadow ${msg.role === "user" ? "bg-[var(--primary)] text-white" : "bg-white dark:bg-black/30 text-[var(--text)]"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-[var(--muted)] text-center">L'IA réfléchit...</div>}
            {error && <div className="text-xs text-red-500 text-center">{error}</div>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t bg-[var(--background)]">
            <input
              type="text"
              className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white dark:bg-black/20"
              placeholder="Votre question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--secondary)] transition"
              disabled={loading || !input.trim()}
              aria-label="Envoyer"
            >
              <FaPaperPlane />
            </button>
          </form>
          <button onClick={resetChat} className="text-xs text-[var(--muted)] hover:underline p-2">Réinitialiser la conversation</button>
        </div>
      )}
    </>
  );
}; 