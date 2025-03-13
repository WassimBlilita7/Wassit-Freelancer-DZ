/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/CategoryPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCategories, getAllPosts } from '@/api/api';
import { PostCard } from '@/components/posts/PostCard';
import { Category, PostData } from '@/types';
import toast from 'react-hot-toast';

export const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les catégories
        const categories = await fetchCategories();
        const foundCategory = categories.find((cat) => cat.slug === slug);
        setCategory(foundCategory || null);

        // Charger tous les posts et filtrer par catégorie
        const allPosts = await getAllPosts();
        const filteredPosts = allPosts.filter((post) =>
          post.category?.slug === slug // Vérifie si la catégorie existe dans le post
        );
        setPosts(filteredPosts);
      } catch (error) {
        toast.error('Erreur lors du chargement des données');
        setPosts([]);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Catégorie non trouvée
        </h1>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {category.name}
        </h1>

        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} isFreelancer={false} onDelete={function (): void {
                    throw new Error('Function not implemented.');
                } } />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Aucune offre trouvée dans cette catégorie.
          </p>
        )}
      </div>
    </section>
  );
};