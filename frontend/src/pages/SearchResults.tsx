// src/pages/SearchResults.tsx
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PostCard } from '@/components/posts/PostCard';
import { searchPosts } from '@/api/api';
import { PostData } from '@/types';
import toast from 'react-hot-toast';
import { Loader } from '@/components/common/Loader';

export const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = location.state?.query;
    if (query) {
      setLoading(true);
      searchPosts({ title: query })
        .then((response) => {
          setResults(response.posts);
        })
        .catch(() => {
          toast.error('Erreur lors de la recherche');
          setResults([]);
        })
        .finally(() => setLoading(false));
    }
  }, [location.state]);

  if (loading) return <Loader />;

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Résultats de la recherche pour "{location.state?.query}"
        </h1>
        {results.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((post) => (
              <PostCard key={post._id} post={post} isFreelancer={false} onDelete={function (): void {
                    throw new Error('Function not implemented.');
                } } />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Aucun résultat trouvé pour "{location.state?.query}".
          </p>
        )}
      </div>
    </section>
  );
};