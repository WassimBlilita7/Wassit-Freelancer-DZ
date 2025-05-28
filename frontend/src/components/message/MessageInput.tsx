import React from "react";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface MessageInputProps {
  message: string;
  setMessage: (msg: string) => void;
  handleSend: () => void;
  sending: boolean;
  error: string | null;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  handleEmojiClick: (emojiData: EmojiClickData) => void;
  theme: string;
  handleInputFocus: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  handleSend,
  sending,
  error,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
  theme,
  handleInputFocus,
}) => (
  <div className="p-4 border-t border-[var(--muted)]/20 bg-white/80 dark:bg-[#23243a]/90 backdrop-blur-lg flex items-center gap-2 sticky bottom-0 z-10">
    <div className="relative flex-1">
      <input
        className="w-full p-3 rounded-xl bg-[var(--background)] text-[var(--text)] border border-[var(--muted)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 shadow-md"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Écrire un message..."
        onKeyDown={e => e.key === "Enter" && handleSend()}
        onFocus={handleInputFocus}
        disabled={sending}
        aria-label="Écrire un message"
      />
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--primary)] focus:outline-none"
        disabled={sending}
        aria-label="Ajouter un emoji"
      >
        <FaSmile />
      </button>
      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 mb-2 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme={theme as any} />
        </div>
      )}
      {error && (
        <div className="absolute left-0 -top-8 text-xs text-red-500 bg-white/80 dark:bg-black/80 px-3 py-1 rounded shadow z-20">
          {error}
        </div>
      )}
    </div>
    <button
      className="p-3 rounded-xl bg-gradient-to-br from-pink-400 via-pink-500 to-blue-400 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg focus:outline-none"
      onClick={handleSend}
      disabled={!message.trim() || sending}
      aria-label="Envoyer le message"
    >
      <FaPaperPlane />
    </button>
  </div>
); 