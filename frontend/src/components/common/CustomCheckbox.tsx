// src/components/common/CustomCheckbox.tsx
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa";

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const CustomCheckbox = ({ id, checked, onCheckedChange, disabled }: CustomCheckboxProps) => {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className="group flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all duration-200 ease-in-out 
        data-[state=checked]:bg-[var(--primary)] data-[state=checked]:border-[var(--primary)] 
        data-[state=unchecked]:bg-[var(--background)] data-[state=unchecked]:border-[var(--muted)] 
        hover:border-[var(--primary)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
    >
      <CheckboxPrimitive.Indicator className="text-white">
        <FaCheck className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};