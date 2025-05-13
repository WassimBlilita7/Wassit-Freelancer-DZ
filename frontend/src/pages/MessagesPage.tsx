import { useEffect, useState, useContext, useRef } from "react";
import { getUserConversations, getConversation, sendMessage, deleteMessage as deleteMessageApi } from "@/api/api";
import { FaPaperPlane, FaUserPlus, FaTrashAlt } from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";

export const MessagesPage = () => {
  const { currentUserId } = useContext(AuthContext);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Récupère les conversations
  useEffect(() => {
    getUserConversations().then(setConversations);
  }, []);

  // Récupère les messages et met à jour toutes les 2s (polling)
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

  const handleSend = async () => {
    if (!message.trim() || !selectedUser) return;
    await sendMessage(selectedUser._id, message);
    setMessage("");
    // getConversation(selectedUser._id).then(setMessages); // plus besoin, polling s'en charge
  };

  // Suppression d'un message
  const handleDeleteMessage = async (msgId: string) => {
    if (window.confirm("Supprimer ce message ?")) {
      await deleteMessageApi(msgId);
      // Le polling va rafraîchir la conversation
    }
  };

  // Styles UI/UX modernes pour la page de messages (clair et sombre)
  const msgStyles = {
    background: isDark
      ? { background: 'linear-gradient(135deg, #181824 0%, #23243a 100%)' }
      : { background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)' },
    card: isDark
      ? { background: '#23243a', boxShadow: '0 2px 16px 0 #18182444' }
      : { background: '#fff', boxShadow: '0 2px 16px 0 #e0e7ef44' },
    sent: isDark
      ? { background: '#7c3aed', color: '#fff', borderRadius: '18px 18px 4px 18px', boxShadow: '0 2px 8px #7c3aed33' }
      : { background: '#7c3aed', color: '#fff', borderRadius: '18px 18px 4px 18px', boxShadow: '0 2px 8px #7c3aed22' },
    received: isDark
      ? { background: '#34d399', color: '#181824', borderRadius: '18px 18px 18px 4px', border: 'none', boxShadow: '0 2px 8px #34d39933' }
      : { background: '#a7f3d0', color: '#181824', borderRadius: '18px 18px 18px 4px', border: 'none', boxShadow: '0 2px 8px #34d39922' },
    input: isDark
      ? { background: '#23243a', color: '#fff', border: '1px solid #353652' }
      : { background: '#fff', color: '#181824', border: '1px solid #e5e7eb' },
    conversationItem: isDark
      ? { background: '#23243a', color: '#fff', border: 'none' }
      : { background: '#f3f4f6', color: '#181824', border: 'none' },
    conversationItemActive: isDark
      ? { background: '#7c3aed22', color: '#fff', border: 'none' }
      : { background: '#ede9fe', color: '#7c3aed', border: 'none' },
  };

  return (
    <div
      className="flex h-[80vh] rounded-2xl shadow-2xl overflow-hidden mt-8"
      style={msgStyles.background}
    >
      {/* Liste des conversations */}
      <div
        className="w-1/3 border-r p-4 flex flex-col gap-2"
        style={msgStyles.card}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-2xl tracking-tight">Discussions</h2>
          <button className="p-2 rounded-full hover:bg-purple-200/20 transition-colors">
            <FaUserPlus />
          </button>
        </div>
        <ul className="space-y-1 overflow-y-auto flex-1">
          {conversations.map(user => (
            <li
              key={user._id}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-150 hover:scale-[1.03]`}
              style={selectedUser?._id === user._id ? msgStyles.conversationItemActive : msgStyles.conversationItem}
              onClick={() => setSelectedUser(user)}
            >
              <img src={user.profile?.profilePicture || "/default-avatar.png"} alt="" className="w-10 h-10 rounded-full border-2 border-purple-200" />
              <span className="font-medium text-lg truncate">{user.username}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        <div
          className="flex-1 overflow-y-auto p-6 space-y-3"
          style={msgStyles.background}
        >
          {selectedUser ? (
            messages.map(msg => {
              let senderId = msg.sender;
              if (typeof senderId === "object" && senderId !== null && senderId._id) {
                senderId = senderId._id;
              }
              const isMe = String(senderId) === String(currentUserId);
              return (
                <div
                  key={msg._id}
                  className={`flex items-end mb-2 ${isMe ? "justify-end" : "justify-start"}`}
                  onMouseEnter={() => setHoveredMsgId(msg._id)}
                  onMouseLeave={() => setHoveredMsgId(null)}
                >
                  {/* Avatar pour les messages reçus */}
                  {!isMe && (
                    <img
                      src={selectedUser.profile?.profilePicture || "/default-avatar.png"}
                      alt=""
                      className="w-8 h-8 rounded-full mr-2 border-2 border-green-200"
                    />
                  )}
                  <div
                    className={`max-w-xs px-4 py-2 shadow-lg font-medium text-base relative group`}
                    style={isMe ? msgStyles.sent : msgStyles.received}
                  >
                    {msg.isDeleted ? (
                      <span className="italic text-sm text-red-400 flex items-center gap-1">
                        <FaTrashAlt className="inline-block text-red-400" /> Ce message a été supprimé
                      </span>
                    ) : (
                      <>
                        {msg.content}
                        {/* Icône suppression visible seulement pour l'expéditeur au hover */}
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
                  </div>
                  {isMe && (
                    <img
                      src={conversations.find(u => String(u._id) === String(currentUserId))?.profile?.profilePicture || "/default-avatar.png"}
                      alt=""
                      className="w-8 h-8 rounded-full ml-2 opacity-0"
                    />
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--muted)]">
              Sélectionnez une discussion pour commencer à chatter.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {selectedUser && (
          <div className="p-4 border-t flex gap-2 bg-transparent">
            <input
              className="flex-1 p-3 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              style={msgStyles.input}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Écrire un message..."
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            <button
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg flex items-center justify-center text-xl transition-all"
              onClick={handleSend}
            >
              <FaPaperPlane />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage; 