import React from "react";
import { Link } from "react-router-dom";

const Button = ({
  to,
  variant = "primary",
  color = "black",
  disabled = false,
  loading = false,
  className = "",
  children,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center px-3 py-2 rounded-lg text-center text-sm md:text-2xl transition";

  const colors = {
    black: {
      primary: "bg-black text-white disabled:bg-gray-300",
    },
    white: {
      primary:
        "bg-white text-black border border-gray-300 hover:bg-gray-100 disabled:bg-gray-300",
    },
    blue: {
      primary: "bg-teal-600 text-white hover:bg-teal-700 disabled:bg-teal-300",
    },
  };

  const style = colors[color]?.[variant] ?? colors.black.primary;

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseStyle} ${style} ${className}`}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`${baseStyle} ${style} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
