import React, { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  type = "dialog", // "dialog" | "drawer"
  size = "md" // "sm" | "md" | "lg" | "xl"
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  // Drawer Layout: Slides from right on desktop, from bottom on mobile
  if (type === "drawer") {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        <div className="absolute inset-0 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
            <div className="w-screen max-w-2xl transform transition-all duration-300 ease-in-out">
              <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-slate-900 shadow-2xl animate-slide-in-right transition-colors duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10 transition-colors duration-300">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100" id="slide-over-title">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="rounded-xl p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Body */}
                <div className="relative flex-1 px-6 py-6 bg-slate-50/50 dark:bg-slate-950/20">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dialog Layout: Standard central popup modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Dialog Frame */}
      <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 w-full ${sizes[size]} transform transition-all duration-300 ease-out animate-fade-in-up z-10 overflow-hidden transition-colors duration-300`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10 transition-colors duration-300">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-6 max-h-[75vh] overflow-y-auto bg-slate-50/30 dark:bg-slate-950/20">
          {children}
        </div>
      </div>
    </div>
  );
};
