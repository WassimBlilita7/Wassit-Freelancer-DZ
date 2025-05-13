import { useEffect, useState, useContext, useRef } from "react";
import { getUserConversations, getConversation, sendMessage, deleteMessage as deleteMessageApi, markMessageAsRead } from "@/api/api";
import { FaPaperPlane, FaUserPlus, FaTrashAlt, FaCheckDouble, FaSmile } from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";
import { motion } from "framer-motion";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";

export const MessagesPage = () => {
  const { currentUserId } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);

  useEffect(() => {
    getUserConversations().then(setConversations);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchMessages = () => {
      if (selectedUser) {
        getConversation(selectedUser._id).then(setMessages);
      }
    };
    fetchMessages();
    if (selectedUser) {
      interval = setInterval(fetchMessages, 2000);
    }
    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !selectedUser) return;
    await sendMessage(selectedUser._id, message);
    setMessage("");
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (window.confirm("Supprimer ce message ?")) {
      await deleteMessageApi(msgId);
    }
  };

  const handleInputFocus = async () => {
    const unread = messages.filter((msg) => {
      let receiverId = msg.receiver;
      if (typeof receiverId === "object" && receiverId !== null && receiverId._id) {
        receiverId = receiverId._id;
      }
      return String(receiverId) === String(currentUserId) && !msg.read && !msg.isDeleted;
    });
    for (const msg of unread) {
      await markMessageAsRead(msg._id);
    }
    if (selectedUser) {
      await getConversation(selectedUser._id).then(setMessages);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--background)] to-blue-50/20 dark:from-[var(--background)] dark:to-blue-950/20">
      <div className="w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl bg-gradient-to-br from-[#181c2a] via-[#23243a] to-[#181c2a] border border-[var(--muted)]/30 flex overflow-hidden">
        {/* Liste des conversations */}
        <div className="md:w-1/3 w-2/5 min-w-[220px] max-w-[300px] border-r border-[var(--muted)]/20 bg-[var(--background)]/80 flex flex-col">
          <div className="p-4 border-b border-[var(--muted)]/20 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--text)]">Messages</h2>
            <button className="p-2 rounded-full hover:bg-[var(--primary)]/10 transition-colors">
              <FaUserPlus />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            {conversations.map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all mb-1 ${selectedUser?._id === user._id ? "bg-gradient-to-r from-pink-500/30 to-[var(--primary)]/20 border-l-4 border-pink-400" : "hover:bg-[var(--background)]"}`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-blue-200/30 flex items-center justify-center text-lg font-bold text-[var(--primary)]">
                  {user.profile?.profilePicture ? (
                    <img src={user.profile.profilePicture} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    getInitials(user.username)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--text)] truncate">{user.username}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Zone de chat */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-[#23243a]/80 to-[#181c2a]/90 relative">
          {/* En-tête du chat */}
          {selectedUser && (
            <div className="p-4 border-b border-[var(--muted)]/20 bg-[var(--background)]/80 flex items-center gap-3">
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
                <h3 className="font-medium text-[var(--text)]">{selectedUser.username}</h3>
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
                          className={`relative px-4 py-2 rounded-2xl shadow-md text-sm max-w-[70vw] md:max-w-[32vw] break-words ${
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
                                  onClick={() => handleDeleteMessage(msg._id)}
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
          {/* Zone de saisie */}
          {selectedUser && (
            <div className="p-4 border-t border-[var(--muted)]/20 bg-[var(--background)]/90 flex items-center gap-2 sticky bottom-0 z-10">
              <div className="relative flex-1">
                <input
                  className="w-full p-3 rounded-xl bg-[var(--background)] text-[var(--text)] border border-[var(--muted)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Écrire un message..."
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  onFocus={handleInputFocus}
                />
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--primary)]"
                >
                  <FaSmile />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 z-10">
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme={theme as any} />
                  </div>
                )}
              </div>
              <button
                className="p-3 rounded-xl bg-gradient-to-br from-pink-400 via-pink-500 to-blue-400 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                <FaPaperPlane />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 