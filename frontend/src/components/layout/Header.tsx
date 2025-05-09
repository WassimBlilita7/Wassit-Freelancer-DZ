import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileMenu } from './MobileMenu';
import { SearchBar } from './SearchBar';
import { useSearchPosts } from '@/hooks/useSearchPosts';
import { useProfile } from '@/hooks/useProfile';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationIcon } from '@/components/common/NotificationIcon';
import { ThemeContext } from '@/context/ThemeContext';
import { AuthContext } from '@/context/AuthContext';
import { getMenuItems } from '@/data/menuItems';
import Logo from '../../assets/logo/logo-transparent-svg.svg';
import { FaBars, FaTimes } from 'react-icons/fa';

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useProfile();
  const { currentUserId } = useContext(AuthContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(currentUserId);
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme ?? 'light';
  const toggleTheme = themeContext?.toggleTheme ?? (() => {});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <header className="fixed top-0 left-0 w-full bg-[var(--card)] shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
        <div className="w-full flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <img
              src={Logo}
              alt="Freelancer DZ Logo"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {isAuthenticated && (
              <NotificationIcon
                unreadCount={unreadCount}
                notifications={notifications}
                markAsRead={markAsRead}
                markAllAsRead={markAllAsRead}
                onClick={() => {}}
              />
            )}

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                aria-label="Ouvrir le menu"
              >
                {isMenuOpen ? <FaTimes className="w-5 h-5 md:w-6 md:h-6" /> : <FaBars className="w-5 h-5 md:w-6 md:h-6" />}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-20">
                  {menuItems.map((item) => (
                    <button
                      key={item.text}
                      onClick={() => {
                        item.action();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <div>
                        <span className="block font-medium">{item.text}</span>
                        {item.description && (
                          <span className="block text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <>
                <button
                  className="px-2 py-1 md:px-4 md:py-2 text-sm md:text-base text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => navigate('/login')}
                >
                  Connexion
                </button>
                <button
                  className="px-2 py-1 md:px-4 md:py-2 text-sm md:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => navigate('/signup')}
                >
                  Inscription
                </button>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="Changer le thème"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              className="md:hidden text-gray-700 dark:text-gray-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Ouvrir le menu mobile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="w-full">
          <SearchBar
            query={query}
            setQuery={setQuery}
            suggestions={suggestions}
            performSearch={performSearch}
          />
        </div>
      </div>
      {isMobileMenuOpen && <MobileMenu isOpen={false} onClose={function (): void {
        throw new Error('Function not implemented.');
      }} menuItems={[]} isAuthenticated={false} toggleTheme={function (): void {
        throw new Error('Function not implemented.');
      }} theme={'light'} navigate={function (): void {
        throw new Error('Function not implemented.');
      }} />}
    </header>
  );
};