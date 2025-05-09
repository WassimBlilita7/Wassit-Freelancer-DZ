// src/components/layout/SearchBar.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostData } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  suggestions: PostData[];
  performSearch: () => void;
}

export const SearchBar = ({ query, setQuery, suggestions, performSearch }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fermer les suggestions si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
      navigate('/search-results', { state: { query } });
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (post: PostData) => {
    setQuery(post.title);
    performSearch();
    navigate('/search-results', { state: { query: post.title } });
    setIsFocused(false);
  };

  const clearSearch = () => {
    setQuery('');
    setIsFocused(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher une offre..."
          className="w-full pl-12 pr-10 py-3 bg-[var(--card)] text-[var(--text)] rounded-xl border border-[var(--muted)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--muted)]/10 transition-colors"
          >
            <FaTimes className="text-[var(--muted)] w-4 h-4" />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full mt-2 bg-[var(--card)] border border-[var(--muted)]/20 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={suggestion._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-3 text-[var(--text)] hover:bg-[var(--background)] cursor-pointer transition-colors duration-200 flex items-center gap-3 group"
              >
                <FaSearch className="text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors" />
                <div>
                  <p className="font-medium">{suggestion.title}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {suggestion.category?.name || 'Sans catégorie'}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};