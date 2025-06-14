import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  isActive = false,
}: {
  icon: ReactNode;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <button
      className={`p-2 rounded-full hover:bg-white transition-colors ${isActive ? "bg-white" : "bg-transparent"}`}
      onClick={onClick}
      aria-label="Icon Button"
    >
      {icon}
    </button>
  );
}
