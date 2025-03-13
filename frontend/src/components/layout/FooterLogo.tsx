// src/components/layout/FooterLogo.tsx
import Logo from '../../assets/logo/logo-transparent-svg.svg';

export const FooterLogo = () => {
  return (
    <div className="flex items-center">
      <img
        src={Logo}
        alt="Freelancer DZ Logo"
        className="h-8 w-auto object-contain"
      />
    </div>
  );
};