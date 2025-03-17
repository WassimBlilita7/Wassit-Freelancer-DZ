/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useSearchPosts.ts
import { useState, useEffect } from 'react';
import { searchPosts, getAllPosts } from '../api/api';
import { PostData } from '../types'; // Votre type existant
import toast from 'react-hot-toast';

export const useSearchPosts = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PostData[]>([]);
  const [results, setResults] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState<PostData[]>([]);

  // Charger tous les posts pour les suggestions
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getAllPosts();
        setAllPosts(posts);
      } catch (error) {
        console.error('Erreur lors du chargement des posts:', error);
      }
    };
    fetchPosts();
  }, []);

  // Mettre à jour les suggestions pendant la saisie
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }
    const filtered = allPosts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limiter à 5 suggestions
    setSuggestions(filtered);
  }, [query, allPosts]);

  // Effectuer la recherche complète
  const performSearch = async () => {
    if (query.trim() === '') {
      toast.error('Veuillez entrer un terme de recherche');
      return;
    }
    setLoading(true);
    try {
      const response = await searchPosts({ title: query });
      setResults(response.posts);
      setSuggestions([]);
    } catch (error) {
      toast.error('Erreur lors de la recherche');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { query, setQuery, suggestions, results, loading, performSearch };
};