// src/components/layout/FooterSocialLinks.tsx
import { FaGithub, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';

export const FooterSocialLinks = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/WassimBlilita7', 
      icon: <FaGithub className="w-5 h-5" />,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/wassim_blilita7',
      icon: <FaInstagram className="w-5 h-5" />,
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/wassim.blilita.31',
      icon: <FaFacebook className="w-5 h-5" />,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/mohamed-wassim-blilita-27a01a216/',
      icon: <FaLinkedin className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200"
          style={{
            backgroundColor: 'var(--muted)', 
            color: 'var(--text)', 
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--secondary)')} // Vert au survol
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--muted)')}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};