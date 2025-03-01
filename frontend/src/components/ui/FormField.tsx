// src/components/ui/FormField.tsx
import { ChangeEvent } from "react";
import { CustomTextField } from "../common/CustomTextField";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: "user" | "email" | "password";
  required?: boolean;
  disabled?: boolean;
}

export const FormField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  required = false,
  disabled = false,
}: FormFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-lg font-medium" style={{ color: "var(--text)" }}>
      {label} {required && <span style={{ color: "var(--error)" }}>*</span>}
    </label>
    <CustomTextField
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      icon={icon}
      required={required}
      disabled={disabled}
    />
  </div>
);