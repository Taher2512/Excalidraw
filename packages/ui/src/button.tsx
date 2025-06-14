"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant: "primary" | "outlined" | "secondary";
  size: "lg" | "sm";
  onClick?: () => void;
}

export const Button = ({ variant, size, className, children }: ButtonProps) => {
  return (
    <button
      className={`${className} ${
        variant == "primary"
          ? "bg-blue-500 text-white"
          : variant == "secondary"
            ? "bg-gray-200 text-gray-800"
            : "bg-transparent border border-blue-500 text-blue-500"
      } ${size == "lg" ? "px-6 py-3 text-lg" : "px-4 py-2 text-sm"} rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
      onClick={() => alert(`Hello from your app!`)}
    >
      {children}
    </button>
  );
};
