// src/components/profile/ProfileInfo.tsx
import { motion } from "framer-motion";
import { FaBriefcase, FaGlobe, FaInfoCircle, FaTools, FaUser, FaUserCircle, FaGithub, FaLinkedin } from "react-icons/fa";
import { ProfileData } from "../../types";

interface ProfileInfoProps {
  profile: ProfileData;
  isFreelancer: boolean;
}

export const ProfileInfo = ({ profile, isFreelancer }: ProfileInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[var(--card)]/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-[var(--muted)]/30 mt-8 max-w-3xl mx-auto"
    >
      {/* En-tête avec photo */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold flex items-center bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
          <FaInfoCircle className="mr-3" style={{ color: "var(--accent)" }} /> À propos
        </h2>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-14 h-14 rounded-full border-2 border-[var(--primary)] shadow-lg object-cover transform hover:scale-110 transition-transform duration-300"
              onError={(e) => (e.currentTarget.src = "/default-profile.png")}
            />
          ) : (
            <FaUserCircle className="w-14 h-14 text-[var(--muted)]" />
          )}
        </motion.div>
      </div>

      {/* Contenu des informations */}
      <div className="grid gap-6 text-[var(--text)]">
        {/* Nom complet */}
        {(profile.firstName || profile.lastName) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 p-4 bg-[var(--background)]/50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <FaUser className="text-2xl" style={{ color: "var(--primary)" }} />
            <div>
              <span className="text-sm text-[var(--muted)] uppercase tracking-wide">Nom</span>
              <p className="text-lg font-medium">{profile.firstName || ""} {profile.lastName || ""}</p>
            </div>
          </motion.div>
        )}

        {/* Bio */}
        {profile.bio && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-4 p-4 bg-[var(--background)]/50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <FaInfoCircle className="text-2xl mt-1" style={{ color: "var(--secondary)" }} />
            <div>
              <span className="text-sm text-[var(--muted)] uppercase tracking-wide">Bio</span>
              <p className="text-lg">{profile.bio}</p>
            </div>
          </motion.div>
        )}

        {/* Compétences (uniquement pour les freelancers) */}
        {isFreelancer && profile.skills && profile.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-[var(--background)]/50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-3">
              <FaTools className="text-2xl" style={{ color: "var(--success)" }} />
              <span className="text-sm text-[var(--muted)] uppercase tracking-wide">Compétences</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="bg-[var(--primary)]/20 text-[var(--primary)] px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-[var(--primary)]/30 transition-all"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Entreprise */}
        {profile.companyName && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 p-4 bg-[var(--background)]/50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <FaBriefcase className="text-2xl" style={{ color: "var(--accent)" }} />
            <div>
              <span className="text-sm text-[var(--muted)] uppercase tracking-wide">Entreprise</span>
              <p className="text-lg font-medium">{profile.companyName}</p>
            </div>
          </motion.div>
        )}

        {/* Site web */}
        {profile.webSite && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 p-4 bg-[var(--background)]/50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <FaGlobe className="text-2xl" style={{ color: "var(--error)" }} />
            <div>
              <span className="text-sm text-[var(--muted)] uppercase tracking-wide">Site web</span>
              <a
                href={profile.webSite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[var(--primary)] hover:text-[var(--secondary)] transition-colors"
              >
                {profile.webSite}
              </a>
            </div>
          </motion.div>
        )}

        {/* Réseaux sociaux (uniquement pour les freelancers) */}
        {isFreelancer && (profile.github || profile.linkedIn) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="p-4 bg-[var(--background)]/50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-3">
              <FaGlobe className="text-2xl" style={{ color: "var(--primary)" }} />
              <span className="text-sm text-[var(--muted)] uppercase tracking-wide">Réseaux sociaux</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {profile.github && (
                <motion.a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-2 text-[var(--text)] hover:text-[var(--primary)] transition-colors"
                >
                  <FaGithub className="text-2xl" />
                  <span>GitHub</span>
                </motion.a>
              )}
              {profile.linkedIn && (
                <motion.a
                  href={profile.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-center gap-2 text-[var(--text)] hover:text-[var(--primary)] transition-colors"
                >
                  <FaLinkedin className="text-2xl" />
                  <span>LinkedIn</span>
                </motion.a>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};