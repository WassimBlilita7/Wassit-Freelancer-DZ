import React from 'react';
import Lottie from 'lottie-react';
import emptyAnimation from '../assets/lottie/notFound.json';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] p-8">
      <div className="w-80 h-80">
        <Lottie animationData={emptyAnimation} loop={true} />
      </div>
      <h1 className="text-3xl font-bold text-[var(--primary)] mt-6 mb-2">Oups ! Page introuvable</h1>
      <p className="text-[var(--muted)] mb-6 text-center max-w-md">
        La page que vous cherchez n'existe pas ou a été déplacée.<br />
        Vérifiez l'URL ou revenez à l'accueil.
      </p>
    </div>
  );
};

export default NotFoundPage; 