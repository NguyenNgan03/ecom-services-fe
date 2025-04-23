"use client";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

const Alert = ({
  type = "info",
  title,
  message,
  onClose,
  className = "",
  showIcon = true,
}) => {
  const types = {
    info: {
      containerClass: "bg-blue-50 border-blue-400 text-blue-700",
      icon: <Info className="h-5 w-5 text-blue-400" />,
    },
    success: {
      containerClass: "bg-green-50 border-green-400 text-green-700",
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
    },
    warning: {
      containerClass: "bg-yellow-50 border-yellow-400 text-yellow-700",
      icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
    },
    error: {
      containerClass: "bg-red-50 border-red-400 text-red-700",
      icon: <AlertCircle className="h-5 w-5 text-red-400" />,
    },
  };

  return (
    <div
      className={`border-l-4 p-4 ${types[type].containerClass} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">{types[type].icon}</div>
        )}
        <div className="flex-1">
          {title && <p className="font-medium">{title}</p>}
          {message && <p className="text-sm">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
