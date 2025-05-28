// src/components/profile/ProfileHeader.tsx
import { motion } from "framer-motion";
import { FaUserCircle, FaGithub, FaLinkedin } from "react-icons/fa";

interface ProfileHeaderProps {
  username: string;
  profilePicture?: string; // URL de la photo renvoyée par le backend
  isFreelancer: boolean;
  github?: string;
  linkedIn?: string;
}

export const ProfileHeader = ({ username, profilePicture, isFreelancer, github, linkedIn }: ProfileHeaderProps) => {
  return (
    <div className="relative bg-[var(--card)] h-72 rounded-t-2xl shadow-xl overflow-hidden">
      {/* Couverture avec SVG */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]"
      >
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            fillOpacity="0.8"
            d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            className="text-white"
          />
        </svg>
      </motion.div>

      {/* Conteneur pour photo et username */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end p-6">
        {/* Photo de profil */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mr-6"
        >
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={`${username}'s profile`}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-[var(--background)] shadow-lg object-cover"
              onError={(e) => {
                console.error("Erreur de chargement de la photo dans ProfileHeader:", profilePicture);
                e.currentTarget.src = "/default-profile.png"; // Image par défaut
              }}
            />
          ) : (
            <FaUserCircle className="w-28 h-28 md:w-36 md:h-36 text-[var(--muted)] border-4 border-[var(--background)] rounded-full shadow-lg" />
          )}
        </motion.div>

        {/* Username et rôle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col justify-end"
        >
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{username}</h1>
            {isFreelancer && (
              <span className="ml-2 px-2 py-1 rounded bg-[var(--primary)] text-white text-xs font-semibold">Freelancer</span>
            )}
          </div>
          <p className="text-sm md:text-base text-white/80 drop-shadow-md">
            {/* Réseaux sociaux */}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-white hover:text-black dark:hover:text-[var(--primary)] transition-colors">
                <FaGithub className="h-6 w-6" />
              </a>
            )}
            {linkedIn && (
              <a href={linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors">
                <FaLinkedin className="h-6 w-6" />
              </a>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
};