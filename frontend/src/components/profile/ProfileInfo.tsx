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
      className="relative bg-gradient-to-br from-[#2770D1] via-[#00B4D8] to-[#C40D6C] dark:from-[#C40D6C] dark:via-[#6C2BD7] dark:to-[#2770D1] p-8 rounded-3xl mt-8 max-w-3xl mx-auto text-white shadow-2xl border border-white/30 backdrop-blur-md overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(39,112,209,0.25)] hover:ring-2 hover:ring-[#00B4D8]/40"
      style={{ boxShadow: "0 8px 32px 0 rgba(39,112,209,0.15)", border: "1.5px solid rgba(255,255,255,0.18)" }}
    >
      {/* Overlay glass effect */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-3xl pointer-events-none" />
      <div className="relative z-10">
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
              className="flex items-center gap-4 p-4 bg-white/20 dark:bg-black/30 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 border border-white/20 backdrop-blur-sm"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.18)" }}
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
              className="flex items-start gap-4 p-4 bg-white/20 dark:bg-black/30 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 border border-white/20 backdrop-blur-sm"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.18)" }}
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
              className="p-4 bg-white/20 dark:bg-black/30 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 border border-white/20 backdrop-blur-sm"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.18)" }}
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
              className="flex items-center gap-4 p-4 bg-white/20 dark:bg-black/30 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 border border-white/20 backdrop-blur-sm"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.18)" }}
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
              className="flex items-center gap-4 p-4 bg-white/20 dark:bg-black/30 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 border border-white/20 backdrop-blur-sm"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.18)" }}
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
        </div>
      </div>
    </motion.div>
  );
};