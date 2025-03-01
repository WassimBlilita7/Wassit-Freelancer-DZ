// src/components/ui/SkillsInput.tsx
import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
}

export const SkillsInput = ({ skills, onChange, disabled = false }: SkillsInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      onChange([...skills, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    onChange(skills.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-2">
      <label className="text-lg font-medium" style={{ color: "var(--text)" }}>
        Compétences requises <span style={{ color: "var(--error)" }}>*</span>
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ajouter une compétence"
          className="w-full p-2 rounded-lg border-2 border-[var(--muted)] focus:border-[var(--primary)]"
          style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
          disabled={disabled}
          onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          type="button"
          onClick={handleAddSkill}
          className="p-2 rounded-full bg-[var(--primary)] text-white"
          disabled={disabled}
        >
          <FaPlus />
        </motion.button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center px-3 py-1 rounded-full bg-[var(--secondary)] text-white"
          >
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="ml-2 focus:outline-none"
              disabled={disabled}
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </motion.span>
        ))}
      </div>
    </div>
  );
};