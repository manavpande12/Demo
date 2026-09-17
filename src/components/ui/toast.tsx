"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { usePlant, ToastItem } from "../../context/PlantContext";
import { cn } from "../../utils/cn";

export function ToastContainer() {
  const { toasts, dismissToast } = usePlant();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
  };

  const borders = {
    success: "border-emerald-200 bg-white shadow-lg",
    warning: "border-amber-200 bg-white shadow-lg",
    error: "border-rose-200 bg-white shadow-lg",
    info: "border-blue-200 bg-white shadow-lg",
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl bg-white text-slate-900 transition-all animate-in slide-in-from-bottom-2 fade-in duration-200",
        borders[toast.type]
      )}
    >
      {icons[toast.type]}
      <div className="flex-1 pr-1">
        <p className="text-xs font-bold text-slate-900">{toast.title}</p>
        {toast.description && (
          <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}