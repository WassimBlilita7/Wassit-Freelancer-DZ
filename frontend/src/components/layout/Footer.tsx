// src/components/layout/Footer.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '@/api/api';
import { Category } from '@/types';
import { FooterLogo } from './FooterLogo';
import { FooterSocialLinks } from './FooterSocialLinks';

export const Footer = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        console.log("Catégories récupérées :", data); // Log pour vérification
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  return (
    <footer className="py-8" style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
              Freelancer DZ
            </h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Plateforme algérienne pour connecter freelances et clients.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
              Catégories
            </h3>
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category._id}>
                    <button
                      onClick={() => navigate(`/category/${category._id}`)}
                      className="text-sm transition-colors duration-200 hover:text-[var(--secondary)]"
                      style={{ color: 'var(--text)' }}
                    >
                      {category.name}
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-sm" style={{ color: 'var(--muted)' }}>
                  Chargement...
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
              Liens Utiles
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-sm transition-colors duration-200 hover:text-[var(--secondary)]"
                  style={{ color: 'var(--text)' }}
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/all-posts')}
                  className="text-sm transition-colors duration-200 hover:text-[var(--secondary)]"
                  style={{ color: 'var(--text)' }}
                >
                  Offres
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-sm transition-colors duration-200 hover:text-[var(--secondary)]"
                  style={{ color: 'var(--text)' }}
                >
                  Profil
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 flex flex-col md:flex-row items-center justify-between border-t" style={{ borderColor: 'var(--muted)' }}>
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <FooterLogo />
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              © {new Date().getFullYear()} Freelancer DZ. Tous droits réservés.
            </p>
          </div>
          <FooterSocialLinks />
        </div>
      </div>
    </footer>
  );
};