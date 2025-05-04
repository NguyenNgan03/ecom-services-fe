"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({
  rating = 0,
  onChange,
  editable = false,
  size = "medium",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6",
  };

  const starClass = sizeClasses[size] || sizeClasses.medium;

  const handleMouseOver = (index) => {
    if (editable) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  const handleClick = (index) => {
    if (editable && onChange) {
      onChange(index);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          className={`${starClass} ${
            editable ? "cursor-pointer" : ""
          } text-yellow-400`}
          fill={(hoverRating || rating) >= index ? "currentColor" : "none"}
          onMouseOver={() => handleMouseOver(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default StarRating;
