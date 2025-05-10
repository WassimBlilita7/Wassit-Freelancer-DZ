// src/components/ui/SkillsInput.tsx
import { useState, KeyboardEvent } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
}

export const SkillsInput = ({ skills, onChange, disabled }: SkillsInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const trimmedSkill = inputValue.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill) && skills.length < 10) {
      const newSkills = [...skills, trimmedSkill];
      onChange(newSkills);
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((skill) => skill !== skillToRemove);
    onChange(newSkills);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ajouter une compétence..."
          className="flex-1 p-3 rounded-lg border-2 border-[var(--muted)]/50 focus:border-[var(--profile-header-start)] focus:ring-2 focus:ring-[var(--profile-header-start)]/30 transition-all"
          style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
          disabled={disabled || skills.length >= 10}
        />
        <button
          type="button"
          onClick={addSkill}
          disabled={disabled || !inputValue.trim() || skills.length >= 10}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPlus />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary)]/20 text-[var(--primary)] rounded-full text-sm font-medium"
            >
              <span>{skill}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-[var(--primary)] hover:text-[var(--error)] transition-colors"
                >
                  <FaTimes size={12} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {skills.length >= 10 && (
        <p className="text-sm text-[var(--error)]">
          Maximum 10 compétences atteint
        </p>
      )}
    </div>
  );
};