// src/components/ui/ImageUpload.tsx
import { useState, useCallback } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export const ImageUpload = ({ onChange, disabled }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  }, [onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-base font-medium flex items-center" style={{ color: "var(--text)" }}>
        <FaImage className="mr-2" style={{ color: "var(--accent)" }} /> Image
      </label>
      <motion.div
        className={`w-full p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all ${preview ? "border-[var(--muted)]" : "border-[var(--muted)]/50 hover:border-[var(--accent)]"}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        style={{ backgroundColor: "var(--card)" }}
      >
        {preview ? (
          <div className="relative w-full max-w-md">
            <img src={preview} alt="Preview" className="w-full h-auto rounded-lg shadow-md" style={{ maxHeight: "200px", objectFit: "cover" }} />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-[var(--error)] rounded-full text-white"
              disabled={disabled}
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <>
            <FaImage className="text-3xl mb-2" style={{ color: "var(--muted)" }} />
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Glissez et déposez une image ou cliquez pour sélectionner
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              disabled={disabled}
              id="image-upload"
            />
            <label htmlFor="image-upload" className="mt-2 cursor-pointer">
              <span className="text-[var(--primary)] hover:underline">Choisir un fichier</span>
            </label>
          </>
        )}
      </motion.div>
    </div>
  );
};