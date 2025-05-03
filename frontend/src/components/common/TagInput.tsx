import { useState, useEffect } from "react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput = ({ value, onChange, placeholder = "Ajoutez des compétences" }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>(value);

  useEffect(() => {
    setTags(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === "," || e.key === " ") && inputValue.trim().length > 0) {
      e.preventDefault();
      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
      onChange(newTags);
      setInputValue("");
    }
  };

  const handleDelete = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onChange(newTags);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-[var(--primary)] text-white px-2 py-1 rounded-full text-sm flex items-center"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleDelete(index)}
              className="ml-2 text-white hover:text-red-300 focus:outline-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-[var(--background)] text-[var(--text)] rounded-lg border border-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 transition-all duration-200"
      />
    </div>
  );
};