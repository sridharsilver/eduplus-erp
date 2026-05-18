import React from "react";
import { Link } from "react-router-dom";

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 px-4 py-12 relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8 text-center animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-indigo-500/20 mb-4">
            🎓
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            EduPulse<span className="text-indigo-600">ERP</span>
          </h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
            Next-Gen School Management Platform
          </p>
        </div>

        {/* Card wrap */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/50 glass-panel animate-fade-in-up">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs font-medium text-slate-400 mt-8">
          © {new Date().getFullYear()} EduPulse Inc. All rights reserved. Optimized for Capacitor WebView.
        </p>
      </div>
    </div>
  );
};
