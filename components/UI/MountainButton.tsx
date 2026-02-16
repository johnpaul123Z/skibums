"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MountainButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function MountainButton({
  children,
  onClick,
  variant = "primary",
  className,
  type = "button",
}: MountainButtonProps) {
  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/50",
    secondary:
      "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50",
    outline:
      "border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "px-6 py-3 rounded-xl font-bold transition-all duration-200",
        variants[variant],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
