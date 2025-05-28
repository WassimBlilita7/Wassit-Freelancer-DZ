import React from "react";
import { FaTrashAlt } from "react-icons/fa";

interface MessageListProps {
  conversations: any[];
  selectedUser: any;
  onSelect: (user: any) => void;
  onDelete: (user: any) => void;
  getInitials: (username: string) => string;
}

export const MessageList: React.FC<MessageListProps> = ({ conversations, selectedUser, onSelect, onDelete, getInitials }) => (
  <div className="md:w-1/3 w-2/5 min-w-[220px] max-w-[320px] border-r border-white/10 bg-white/40 dark:bg-[#23243a]/70 backdrop-blur-lg flex flex-col">
    <div className="p-4 border-b border-white/10 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-[var(--primary)]">Messages</h2>
    </div>
    <div className="flex-1 overflow-y-auto pr-1">
      {conversations.map((user) => (
        <div
          key={user._id}
          className={`group flex items-center gap-3 p-3 rounded-2xl mb-1 cursor-pointer transition-all ${
            selectedUser?._id === user._id
              ? 'bg-gradient-to-r from-pink-400/30 to-blue-400/20 border-l-4 border-pink-400 shadow-lg'
              : 'hover:bg-white/30 dark:hover:bg-[#23243a]/40'
          }`}
          onClick={() => onSelect(user)}
          tabIndex={0}
          aria-label={`Ouvrir la conversation avec ${user.username}`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)]/30 to-blue-200/40 flex items-center justify-center text-lg font-bold text-[var(--primary)] shadow-md">
            {user.profile?.profilePicture ? (
              <img src={user.profile.profilePicture} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              getInitials(user.username)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg text-[var(--text)] truncate">{user.username}</div>
          </div>
          <button
            className="ml-2 p-2 rounded-full text-[var(--muted)] opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-100/40 transition"
            title="Supprimer la conversation"
            onClick={e => { e.stopPropagation(); onDelete(user); }}
            tabIndex={0}
            aria-label={`Supprimer la conversation avec ${user.username}`}
          >
            <FaTrashAlt />
          </button>
        </div>
      ))}
    </div>
  </div>
); 