// src/components/common/CustomTextField.tsx
import { InputHTMLAttributes, useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

interface CustomTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  icon: "user" | "email" | "password";
}

export const CustomTextField = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  disabled,
  icon,
  ...rest
}: CustomTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
  const IconComponent = icon === "user" ? FaUser : icon === "email" ? FaEnvelope : FaLock;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <IconComponent
        className="absolute left-3 top-1/2 transform -translate-y-1/2"
        style={{ color: "var(--muted)" }}
      />
      <input
        id={id}
        name={name}
        type={icon === "password" && showPassword ? "text" : type} // Bascule entre text/password
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-10 pr-12 py-4 text-lg rounded-lg border-2 
          bg-[var(--background)] text-[var(--text)] 
          border-[var(--muted)] 
          focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 
          hover:border-[var(--primary)]/70 
          transition-all duration-200 ease-in-out 
          outline-none"
        style={{ color: "var(--text)" }}
        {...rest}
      />
      {icon === "password" && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 
            rounded-full hover:bg-[var(--primary)]/10 transition-colors duration-200"
          style={{ color: "var(--muted)" }}
          disabled={disabled}
        >
          {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
};