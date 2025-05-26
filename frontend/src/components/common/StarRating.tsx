import React, { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  editable?: boolean;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, editable = false, size = 40 }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Note">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`transition-transform duration-150 ${editable ? "hover:scale-125 focus:scale-125" : ""}`}
          style={{ background: "none", border: "none", padding: 0, cursor: editable ? "pointer" : "default" }}
          onClick={() => editable && onRatingChange && onRatingChange(star)}
          onMouseEnter={() => editable && setHovered(star)}
          onMouseLeave={() => editable && setHovered(null)}
          aria-label={`Donner ${star} étoile${star > 1 ? "s" : ""}`}
          aria-checked={rating === star}
          tabIndex={editable ? 0 : -1}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={(hovered !== null ? star <= hovered : star <= rating) ? "#FFC107" : "#E0E0E0"}
            stroke="#FFC107"
            strokeWidth="1"
            className="drop-shadow-md transition-colors duration-200"
          >
            <polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18 5.5,22 7,14.5 2,9.5 9,9" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default StarRating; 