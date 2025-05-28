import React from "react";

interface ContactsModalProps {
  show: boolean;
  onClose: () => void;
  contacts: any[];
  loadingContacts: boolean;
  onSelect: (user: any) => void;
  getInitials: (username: string) => string;
}

export const ContactsModal: React.FC<ContactsModalProps> = ({ show, onClose, contacts, loadingContacts, onSelect, getInitials }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#23243a] rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-[var(--muted)] hover:text-[var(--primary)] text-xl focus:outline-none"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-4 text-[var(--text)]">Nouveau message</h3>
        {loadingContacts ? (
          <div className="text-center text-[var(--muted)] py-8">Chargement...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center text-[var(--muted)] py-8">Aucun contact disponible.<br />Vous pouvez seulement écrire aux utilisateurs avec qui vous avez un projet accepté.</div>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {contacts.map((user, idx) => (
              <li key={user._id || idx}>
                <button
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-[var(--primary)]/10 transition-all focus:outline-none"
                  onClick={() => onSelect(user)}
                  aria-label={`Démarrer une conversation avec ${user.username}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-blue-200/30 flex items-center justify-center text-lg font-bold text-[var(--primary)]">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      getInitials(user.username)
                    )}
                  </div>
                  <span className="font-medium text-[var(--text)]">{user.username}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}; 