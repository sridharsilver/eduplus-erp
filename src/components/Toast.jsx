import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export const Toast = ({
  message,
  type = "success", // "success" | "error" | "info" | "warning"
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const configs = {
    success: {
      bg: "bg-emerald-50 border-emerald-100",
      icon: CheckCircle,
      iconColor: "text-emerald-500",
      text: "text-emerald-800"
    },
    error: {
      bg: "bg-rose-50 border-rose-100",
      icon: AlertCircle,
      iconColor: "text-rose-500",
      text: "text-rose-800"
    },
    info: {
      bg: "bg-indigo-50 border-indigo-100",
      icon: Info,
      iconColor: "text-indigo-500",
      text: "text-indigo-800"
    },
    warning: {
      bg: "bg-amber-50 border-amber-100",
      icon: AlertCircle,
      iconColor: "text-amber-500",
      text: "text-amber-800"
    }
  };

  const current = configs[type] || configs.success;
  const IconComponent = current.icon;

  return (
    <div className={`fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 border rounded-2xl shadow-lg glass-panel animate-fade-in-up max-w-sm ${current.bg}`}>
      <IconComponent className={`w-5 h-5 flex-shrink-0 ${current.iconColor}`} />
      <span className={`text-xs font-semibold pr-4 leading-tight ${current.text}`}>
        {message}
      </span>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 rounded-lg p-0.5 hover:bg-slate-100 transition-all cursor-pointer ml-auto"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// Global Toast Container / Helper Hook mockup
export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ message, type, duration });
  };

  const ToastComponent = toast ? (
    <Toast
      message={toast.message}
      type={toast.type}
      duration={toast.duration}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showToast, ToastComponent };
};
