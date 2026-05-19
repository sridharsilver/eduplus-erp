import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export const AuthLayout = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-12 relative overflow-hidden transition-colors duration-300">
      
      {/* Floating Theme Selector top-right */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => setShowThemeDropdown(!showThemeDropdown)}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all cursor-pointer relative shadow-sm"
          title="Toggle Theme"
        >
          {theme === "light" && <Sun className="w-4 h-4 text-amber-500" />}
          {theme === "dark" && <Moon className="w-4 h-4 text-indigo-400" />}
          {theme === "system" && <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
        </button>

        {showThemeDropdown && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowThemeDropdown(false)} />
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-40 py-1.5 animate-fade-in-up">
              <button
                onClick={() => { setTheme("light"); setShowThemeDropdown(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition-all cursor-pointer text-left
                  ${theme === "light" ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
              >
                <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
                Light Mode
              </button>
              <button
                onClick={() => { setTheme("dark"); setShowThemeDropdown(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition-all cursor-pointer text-left
                  ${theme === "dark" ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
              >
                <Moon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                Dark Mode
              </button>
              <button
                onClick={() => { setTheme("system"); setShowThemeDropdown(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition-all cursor-pointer text-left
                  ${theme === "system" ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
              >
                <Laptop className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                System Default
              </button>
            </div>
          </>
        )}
      </div>

      {/* Background Graphic Accents */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 dark:bg-indigo-950/25 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-200/30 dark:bg-purple-950/25 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8 text-center animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-indigo-500/20 mb-4">
            🎓
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            EduPulse<span className="text-indigo-600">ERP</span>
          </h2>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            Next-Gen School Management Platform
          </p>
        </div>

        {/* Card wrap */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 glass-panel animate-fade-in-up transition-all duration-300">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs font-medium text-slate-400 dark:text-slate-500 mt-8">
          © {new Date().getFullYear()} EduPulse Inc. All rights reserved. Optimized for Capacitor WebView.
        </p>
      </div>
    </div>
  );
};
