import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FlowInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FlowInput({
  label,
  error,
  className,
  ...props
}: FlowInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-label uppercase tracking-widest text-primary-soft">
        {label}
      </label>
      <input
        className={cn(
          "bg-transparent border-b-4 border-primary-soft text-primary text-base px-0 py-2 outline-none focus:border-primary transition-colors placeholder:text-surface-high rounded-none",
          error && "border-red-400",
          className,
        )}
        {...props}
      />
      {error && (
        <span className="text-label uppercase tracking-widest text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}
