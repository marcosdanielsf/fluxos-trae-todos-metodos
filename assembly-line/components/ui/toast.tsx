"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-md space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (toast.duration! / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [toast.duration]);

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  const colors = {
    success: {
      bg: "bg-[rgb(var(--success))]/10",
      border: "border-[rgb(var(--success))]/20",
      icon: "text-[rgb(var(--success))]",
      progress: "bg-[rgb(var(--success))]",
    },
    error: {
      bg: "bg-[rgb(var(--error))]/10",
      border: "border-[rgb(var(--error))]/20",
      icon: "text-[rgb(var(--error))]",
      progress: "bg-[rgb(var(--error))]",
    },
    warning: {
      bg: "bg-[rgb(var(--warning))]/10",
      border: "border-[rgb(var(--warning))]/20",
      icon: "text-[rgb(var(--warning))]",
      progress: "bg-[rgb(var(--warning))]",
    },
    info: {
      bg: "bg-[rgb(var(--primary))]/10",
      border: "border-[rgb(var(--primary))]/20",
      icon: "text-[rgb(var(--primary))]",
      progress: "bg-[rgb(var(--primary))]",
    },
  };

  const colorClasses = colors[toast.type];

  return (
    <div
      className={cn(
        "pointer-events-auto relative overflow-hidden rounded-xl border shadow-2xl backdrop-blur-sm animate-in slide-in-from-right-full duration-300",
        colorClasses.bg,
        colorClasses.border
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("flex-shrink-0", colorClasses.icon)}>
            {icons[toast.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{toast.title}</p>
            {toast.description && (
              <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
                {toast.description}
              </p>
            )}
            {(toast.action || toast.secondaryAction) && (
              <div className="flex gap-2 mt-3">
                {toast.action && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      toast.action!.onClick();
                      onRemove(toast.id);
                    }}
                  >
                    {toast.action.label}
                  </Button>
                )}
                {toast.secondaryAction && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      toast.secondaryAction!.onClick();
                      onRemove(toast.id);
                    }}
                  >
                    {toast.secondaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 p-1 hover:bg-[rgb(var(--background))]/50 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[rgb(var(--background))]/20">
          <div
            className={cn("h-full transition-all duration-100", colorClasses.progress)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
