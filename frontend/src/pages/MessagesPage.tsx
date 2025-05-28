/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useContext, useRef } from "react";
import { getUserConversations, getConversation, sendMessage, deleteMessage as deleteMessageApi, markMessageAsRead, getAllPosts, deleteConversation as deleteConversationApi } from "@/api/api";
import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MessageList } from "@/components/message/MessageList";
import { ChatWindow } from "@/components/message/ChatWindow";
import { MessageInput } from "@/components/message/MessageInput";
import { ContactsModal } from "@/components/message/ContactsModal";

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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState<boolean | null>(null);

  useEffect(() => {
    getUserConversations().then(setConversations);
    (async () => {
      try {
        const res = await fetch('/api/v1/auth/profile', { credentials: 'include' });
        const data = await res.json();
        setIsFreelancer(data?.userData?.isFreelancer ?? null);
      } catch {
        setIsFreelancer(null);
      }
    })();
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
    setSending(true);
    setError(null);
    try {
    await sendMessage(selectedUser._id, message);
    setMessage("");
      setConversations((prev) => {
        if (!prev.some((u) => u._id === selectedUser._id)) {
          return [selectedUser, ...prev];
        }
        return prev;
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erreur lors de l'envoi du message.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (window.confirm("Supprimer ce message ?")) {
      await deleteMessageApi(msgId);
    }
  };

  const handleDeleteConversation = async (user: any) => {
    if (window.confirm(`Supprimer toute la conversation avec ${user.username} ?`)) {
      try {
        await deleteConversationApi(user._id);
        setConversations((prev) => prev.filter((u) => u._id !== user._id));
        if (selectedUser && selectedUser._id === user._id) setSelectedUser(null);
        toast.success("Conversation supprimée");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Erreur lors de la suppression");
      }
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

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const posts = await getAllPosts();
      const userId = currentUserId;
      const acceptedUsers = new Set<string>();
      const users: any[] = [];
      posts.forEach((post: any) => {
        if (!post.applications) return;
        post.applications.forEach((app: any) => {
          if (app.status === "accepted") {
            if (isFreelancer === false && post.client && String(post.client._id) === String(userId)) {
              const freelancerId = app.freelancer?._id || app.freelancer;
              if (!acceptedUsers.has(freelancerId)) {
                acceptedUsers.add(freelancerId);
                users.push(app.freelancerData || app.freelancer);
              }
            }
            if (isFreelancer === true && String(app.freelancer?._id || app.freelancer) === String(userId)) {
              if (post.client && !acceptedUsers.has(post.client._id)) {
                acceptedUsers.add(post.client._id);
                users.push(post.client);
              }
            }
          }
        });
      });
      setContacts(users);
    } catch (e) {
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c2a] via-[#23243a] to-[#181c2a]">
      <div className="w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl backdrop-blur-lg bg-white/30 dark:bg-[#23243a]/60 border border-white/20 flex overflow-hidden">
        <MessageList
          conversations={conversations}
          selectedUser={selectedUser}
          onSelect={setSelectedUser}
          onDelete={handleDeleteConversation}
          getInitials={getInitials}
        />
        <div className="flex-1 flex flex-col">
          <ChatWindow
            messages={messages}
            selectedUser={selectedUser}
            currentUserId={currentUserId}
            getInitials={getInitials}
            onDeleteMessage={handleDeleteMessage}
            messagesEndRef={messagesEndRef}
            hoveredMsgId={hoveredMsgId}
            setHoveredMsgId={setHoveredMsgId}
            navigate={navigate}
          />
          <MessageInput
            message={message}
            setMessage={setMessage}
            handleSend={handleSend}
            sending={sending}
            error={error}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            handleEmojiClick={handleEmojiClick}
            theme={theme}
            handleInputFocus={handleInputFocus}
          />
        </div>
        <ContactsModal
          show={showContactsModal}
          onClose={() => setShowContactsModal(false)}
          contacts={contacts}
          loadingContacts={loadingContacts}
          onSelect={(user) => { setSelectedUser(user); setShowContactsModal(false); }}
          getInitials={getInitials}
                />
                <button
          className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-blue-400 text-white shadow-xl hover:scale-105 transition-all z-50 focus:outline-none"
          title="Nouveau message"
          onClick={() => { setShowContactsModal(true); fetchContacts(); }}
          aria-label="Nouveau message"
              >
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 20 20"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" /></svg>
              </button>
      </div>
    </div>
  );
};

export default MessagesPage; 