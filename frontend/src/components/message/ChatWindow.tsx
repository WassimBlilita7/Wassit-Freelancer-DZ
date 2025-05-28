import React from "react";
import { motion } from "framer-motion";
import { FaTrashAlt, FaCheckDouble } from "react-icons/fa";

interface ChatWindowProps {
  messages: any[];
  selectedUser: any;
  currentUserId: string | null;
  getInitials: (username: string) => string;
  onDeleteMessage: (msgId: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  hoveredMsgId: string | null;
  setHoveredMsgId: (id: string | null) => void;
  navigate: (path: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  selectedUser,
  currentUserId,
  getInitials,
  onDeleteMessage,
  messagesEndRef,
  hoveredMsgId,
  setHoveredMsgId,
  navigate,
}) => (
  <div className="flex-1 flex flex-col bg-gradient-to-br from-[#23243a]/80 to-[#181c2a]/90 relative">
    {/* Header sticky */}
    {selectedUser && (
      <div className="sticky top-0 z-10 p-4 border-b border-white/10 bg-white/40 dark:bg-[#23243a]/80 backdrop-blur-lg flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-blue-200/30 flex items-center justify-center text-lg font-bold text-[var(--primary)] cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate(`/profile/${selectedUser.username}`)}
          title="Voir le profil"
        >
          {selectedUser.profile?.profilePicture ? (
            <img src={selectedUser.profile.profilePicture} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            getInitials(selectedUser.username)
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-[var(--text)]">{selectedUser.username}</h3>
          <p className="text-xs text-[var(--muted)]">En ligne</p>
        </div>
      </div>
    )}
    {/* Messages */}
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
      {selectedUser ? (
        messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--muted)]">Aucun message</div>
        ) : (
          messages.map((msg) => {
            let senderId = msg.sender;
            if (typeof senderId === "object" && senderId !== null && senderId._id) {
              senderId = senderId._id;
            }
            const isMe = String(senderId) === String(currentUserId);
            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                onMouseEnter={() => setHoveredMsgId(msg._id)}
                onMouseLeave={() => setHoveredMsgId(null)}
              >
                <div className="flex items-end gap-2 max-w-full">
                  {!isMe && (
                    <div
                      className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--primary)] cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => navigate(`/profile/${selectedUser.username}`)}
                      title="Voir le profil"
                    >
                      {selectedUser.profile?.profilePicture ? (
                        <img src={selectedUser.profile.profilePicture} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        getInitials(selectedUser.username)
                      )}
                    </div>
                  )}
                  <div
                    className={`relative px-4 py-2 rounded-2xl shadow-md text-sm max-w-[70vw] md:max-w-[32vw] break-words backdrop-blur-lg bg-white/60 dark:bg-[#23243a]/70 border border-white/20 ${
                      isMe
                        ? "bg-gradient-to-br from-pink-400 via-pink-500 to-blue-400 text-white rounded-br-md"
                        : "bg-[var(--background)]/90 text-[var(--text)] rounded-bl-md border border-[var(--muted)]/20"
                    }`}
                  >
                    {msg.isDeleted ? (
                      <span className="italic text-[var(--muted)]">Ce message a été supprimé</span>
                    ) : (
                      <>
                        {msg.content}
                        {isMe && hoveredMsgId === msg._id && !msg.isDeleted && (
                          <button
                            className="absolute top-1 right-1 p-1 rounded-full bg-white/80 hover:bg-red-100 text-red-500 shadow transition-all"
                            title="Supprimer"
                            onClick={() => onDeleteMessage(msg._id)}
                          >
                            <FaTrashAlt />
                          </button>
                        )}
                      </>
                    )}
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <span className="text-xs opacity-60">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {isMe && msg.read && !msg.isDeleted && (
                        <FaCheckDouble className="ml-1 text-blue-300 text-xs align-bottom" title="Vu" />
                      )}
                    </div>
                  </div>
                  {isMe && (
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--primary)] opacity-0">
                      {/* Avatar invisible pour alignement */}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )
      ) : (
        <div className="flex items-center justify-center h-full text-[var(--muted)]">Sélectionnez une discussion pour commencer à chatter.</div>
      )}
      <div ref={messagesEndRef} />
    </div>
  </div>
); 