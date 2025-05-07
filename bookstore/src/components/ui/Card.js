"use client";

const Card = ({ children, className = "", animate = false, ...props }) => {
  const animationClass = animate
    ? "transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    : "";

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${animationClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`px-6 py-4 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Body = ({ children, className = "", ...props }) => {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Footer = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
