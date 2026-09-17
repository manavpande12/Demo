import React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "running"
    | "idle"
    | "warning"
    | "breakdown"
    | "maintenance"
    | "completed"
    | "inprogress"
    | "scheduled"
    | "urgent"
    | "outline"
    | "neutral";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs font-medium",
    lg: "px-3 py-1 text-sm font-medium",
  };

  const variantClasses = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    running: "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium",
    idle: "bg-slate-100 text-slate-600 border-slate-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200 font-medium",
    breakdown: "bg-rose-50 text-rose-700 border-rose-200 font-medium",
    maintenance: "bg-purple-50 text-purple-700 border-purple-200 font-medium",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium",
    inprogress: "bg-blue-50 text-blue-700 border-blue-200 font-medium",
    scheduled: "bg-indigo-50 text-indigo-700 border-indigo-200",
    urgent: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
    outline: "bg-transparent text-slate-700 border-slate-300",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const dotColor = {
    running: "bg-emerald-500 animate-pulse",
    idle: "bg-slate-400",
    warning: "bg-amber-500 animate-pulse",
    breakdown: "bg-rose-600 animate-pulse",
    maintenance: "bg-purple-500 animate-pulse",
    completed: "bg-emerald-500",
    inprogress: "bg-blue-500 animate-pulse",
    scheduled: "bg-indigo-500",
    urgent: "bg-rose-600 animate-ping",
    default: "bg-slate-400",
    outline: "bg-slate-400",
    neutral: "bg-slate-400",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border font-mono tracking-tight transition-colors select-none",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full inline-block shrink-0", dotColor)} />}
      {children}
    </span>
  );
}