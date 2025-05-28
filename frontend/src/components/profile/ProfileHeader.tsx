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
  const hasSocial = !!github || !!linkedIn;
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-6">
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[var(--primary)] shadow-lg">
        {profilePicture ? (
          <img src={profilePicture} alt={username} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-4xl font-bold text-[var(--primary)]">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col items-center md:items-start">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-[var(--text)]">{username}</span>
          {isFreelancer && (
            <span className="ml-2 px-2 py-1 rounded bg-[var(--primary)] text-white text-xs font-semibold">Freelancer</span>
          )}
          {hasSocial && (
            <div className="flex items-center gap-2 ml-3">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="transition-colors hover:text-black dark:hover:text-[var(--primary)] text-gray-700 dark:text-white"
                >
                  <FaGithub className="h-6 w-6" />
                </a>
              )}
              {linkedIn && (
                <a
                  href={linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="transition-colors hover:text-blue-900 dark:hover:text-blue-300 text-blue-700 dark:text-blue-400"
                >
                  <FaLinkedin className="h-6 w-6" />
                </a>
              )}
            </div>
          )}
        </div>
        <div className="text-[var(--muted)] text-sm">@{username}</div>
      </div>
    </div>
  );
};