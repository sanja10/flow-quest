"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export function FlowButton({
  children,
  variant = "primary",
  className,
  ...props
}: FlowButtonProps) {
  const variants = {
    primary:
      "bg-primary text-surface border-4 border-primary translate-x-[-4px] translate-y-[-4px] shadow-[4px_4px_0px_#466739] hover:translate-x-0 hover:translate-y-0 hover:shadow-none",
    secondary:
      "bg-transparent text-primary border-4 border-primary translate-x-[-4px] translate-y-[-4px] shadow-[4px_4px_0px_#466739] hover:translate-x-0 hover:translate-y-0 hover:shadow-none",
    danger:
      "bg-transparent text-red-400 border-4 border-red-400 translate-x-[-4px] translate-y-[-4px] shadow-[4px_4px_0px_#7f1d1d] hover:translate-x-0 hover:translate-y-0 hover:shadow-none",
  };

  return (
    <button
      className={cn(
        "text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-none transition-all duration-100 cursor-pointer disabled:opacity-40",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
