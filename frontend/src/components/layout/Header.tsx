/* eslint-disable no-empty-pattern */
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
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useProfile();
  const { currentUserId } = useContext(AuthContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(currentUserId);
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme ?? 'light';
  const toggleTheme = themeContext?.toggleTheme ?? (() => {});
  const [] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { query, setQuery, suggestions, performSearch } = useSearchPosts();
  const menuRef = useRef<HTMLDivElement>(null);

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
            {isAuthenticated && (
              <NotificationIcon
                unreadCount={unreadCount}
                notifications={notifications}
                markAsRead={markAsRead}
                markAllAsRead={markAllAsRead}
                onClick={() => {}}
              />
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
                className="p-2 rounded-full bg-[var(--background)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white transition-colors duration-200"
                aria-label="Menu"
              >
                {isMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
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