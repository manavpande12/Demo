import React from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "accent";
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer";

    const sizes = {
      xs: "h-7 px-2.5 text-xs",
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-10 px-5 text-base",
      icon: "h-9 w-9 p-0",
    };

    const variants = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-xs border border-blue-600",
      secondary:
        "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs",
      outline:
        "border border-slate-300 hover:bg-slate-100 text-slate-700 bg-transparent",
      ghost:
        "hover:bg-slate-100 text-slate-600 hover:text-slate-900 bg-transparent",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-xs border border-rose-600",
      success:
        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs border border-emerald-600",
      accent:
        "bg-amber-600 hover:bg-amber-700 text-white shadow-xs border border-amber-600",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, sizes[size], variants[variant], className)}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";