import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { useSearchPosts } from '@/hooks/useSearchPosts';
import { useProfile } from '@/hooks/useProfile';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationIcon } from '@/components/common/NotificationIcon';
import { ThemeContext } from '@/context/ThemeContext';
import { AuthContext } from '@/context/AuthContext';
import { getMenuItems } from '@/data/menuItems';
import Logo from '../../assets/logo/logo-transparent-svg.svg';
import { FaBars, FaTimes, FaSun, FaMoon, FaFacebookMessenger, FaClipboardCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserConversations, getConversation, getAcceptedPostsForFreelancer } from '@/api/api';

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isFreelancer } = useProfile({ redirectToLogin: false });
  const { currentUserId } = useContext(AuthContext);
  const { notifications, markAsRead, markAllAsRead } = useNotifications(currentUserId);
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme ?? 'light';
  const toggleTheme = themeContext?.toggleTheme ?? (() => {});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { query, setQuery, suggestions, performSearch } = useSearchPosts();
  const menuRef = useRef<HTMLDivElement>(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [showAccepted, setShowAccepted] = useState(false);
  const [acceptedPosts, setAcceptedPosts] = useState<any[]>([]);
  const [loadingAccepted, setLoadingAccepted] = useState(false);
  const { profile: userProfile, username: userUsername } = useProfile({ redirectToLogin: false });

  const menuItems = isAuthenticated
    ? getMenuItems(navigate, false)
    : [{ text: 'Accueil', icon: null, action: () => navigate('/'), description: 'Page principale' }];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!currentUserId) return;
      let total = 0;
      const conversations = await getUserConversations();
      for (const user of conversations) {
        const msgs = await getConversation(user._id);
        total += msgs.filter(
          (msg: any) => {
            let receiverId = msg.receiver;
            if (typeof receiverId === 'object' && receiverId !== null && receiverId._id) receiverId = receiverId._id;
            return String(receiverId) === String(currentUserId) && !msg.read && !msg.isDeleted;
          }
        ).length;
      }
      setUnreadMessagesCount(total);
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 3000);
    return () => clearInterval(interval);
  }, [currentUserId]);

  // Fetch accepted posts for freelancer
  useEffect(() => {
    if (showAccepted && isFreelancer) {
      setLoadingAccepted(true);
      getAcceptedPostsForFreelancer()
        .then(res => setAcceptedPosts(res.posts || []))
        .finally(() => setLoadingAccepted(false));
    }
  }, [showAccepted, isFreelancer]);

  // Calcul du nombre de notifications non lues
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full bg-[var(--card)] shadow-lg backdrop-blur-sm bg-opacity-90 z-50 border-b border-[var(--muted)]/20"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src={Logo}
              alt="Freelancer DZ Logo"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </motion.div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar
              query={query}
              setQuery={setQuery}
              suggestions={suggestions}
              performSearch={performSearch}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated && isFreelancer && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAccepted((v) => !v)}
                  className="p-2 rounded-full bg-[var(--background)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white transition-colors duration-200"
                  aria-label="Projets acceptés"
                >
                  <FaClipboardCheck className="w-5 h-5" />
                </motion.button>
                {showAccepted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-[var(--card)] border border-[var(--muted)]/20 rounded-lg shadow-xl z-30 overflow-hidden"
                  >
                    <div className="p-3 border-b border-[var(--muted)]/20 font-semibold text-[var(--primary)]">Projets à finaliser</div>
                    <div className="max-h-96 overflow-y-auto">
                      {loadingAccepted ? (
                        <div className="p-4 text-center text-[var(--muted)]">Chargement...</div>
                      ) : acceptedPosts.length === 0 ? (
                        <div className="p-4 text-center text-[var(--muted)]">Aucun projet accepté</div>
                      ) : (
                        acceptedPosts.map((post) => (
                          <button
                            key={post._id}
                            onClick={() => { setShowAccepted(false); navigate(`/post/${post._id}/finalize`); }}
                            className="w-full text-left px-4 py-3 hover:bg-[var(--background)]/80 border-b border-[var(--muted)]/10 last:border-b-0"
                          >
                            <div className="font-bold text-[var(--text)]">{post.title}</div>
                            <div className="text-xs text-[var(--muted)]">Client : {post.client?.username}</div>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {isAuthenticated && (
              <NotificationIcon
                unreadCount={unreadNotificationsCount}
                notifications={notifications}
                markAsRead={markAsRead}
                markAllAsRead={markAllAsRead}
              />
            )}

            {/* Messenger Icon */}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/messages')}
                className="relative p-2 rounded-full bg-[var(--background)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white transition-colors duration-200"
                aria-label="Messages"
              >
                <FaFacebookMessenger className="w-5 h-5" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-lg border-2 border-[var(--background)]">
                    {unreadMessagesCount}
                  </span>
                )}
              </motion.button>
            )}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[var(--background)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white transition-colors duration-200"
              aria-label="Changer le thème"
            >
              {theme === 'dark' ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Menu */}
            <div className="relative" ref={menuRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 rounded-full bg-[var(--background)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                aria-label="Menu utilisateur"
                tabIndex={0}
              >
                {isMenuOpen ? (
                  <FaTimes className="w-7 h-7" />
                ) : userProfile?.profilePicture ? (
                  <img
                    src={userProfile.profilePicture}
                    alt={userUsername || "Profil"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-[var(--primary)] shadow-sm"
                  />
                ) : userUsername ? (
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--primary)] text-white font-bold text-lg uppercase border-2 border-[var(--primary)] shadow-sm">
                    {userUsername.charAt(0)}
                  </span>
                ) : (
                  <FaBars className="w-7 h-7" />
                )}
              </motion.button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-[var(--card)] border border-[var(--muted)]/20 rounded-lg shadow-xl z-20 overflow-hidden"
                  >
                    {menuItems.map((item) => (
                      <motion.button
                        key={item.text}
                        whileHover={{ x: 5 }}
                        onClick={() => {
                          item.action();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-[var(--text)] hover:bg-[var(--background)] transition-colors duration-200 text-left"
                      >
                        {item.icon && <item.icon className="w-5 h-5 text-[var(--primary)]" />}
                        <div>
                          <span className="block font-medium">{item.text}</span>
                          {item.description && (
                            <span className="block text-sm text-[var(--muted)]">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons */}
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium text-[var(--text)] border border-[var(--muted)] rounded-lg hover:bg-[var(--background)] transition-colors duration-200"
                >
                  Connexion
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors duration-200"
                >
                  Inscription
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};