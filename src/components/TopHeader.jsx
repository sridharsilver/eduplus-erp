import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, Menu, LogOut, Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export const TopHeader = ({ role = "admin", onOpenMobileDrawer, onToggleDesktopSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Simulated notifications
  const notifications = [
    { id: 1, title: "New Homework Assigned", detail: "Science Quadratic Equations due tomorrow", unread: true },
    { id: 2, title: "Sports Meet Registration", detail: "Signups are open until May 30", unread: false },
    { id: 3, title: "Fee Receipt Generated", detail: "Transaction ref #20412 complete", unread: false }
  ];

  const handleLogout = () => {
    localStorage.removeItem("ep_role");
    localStorage.removeItem("ep_user");
    navigate("/");
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case "admin": return "bg-indigo-50 border-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-300";
      case "student": return "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-300";
      case "parent": return "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300";
      default: return "bg-slate-50 border-slate-100 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300";
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-6 flex items-center justify-between shadow-sm transition-colors duration-300">
      {/* Left section: Breadcrumbs & Drawer toggle */}
      <div className="flex items-center gap-3">
        {/* Toggle mobile sidebar */}
        <button
          onClick={onOpenMobileDrawer}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden transition-all cursor-pointer"
        >
          <Menu className="w-5.5 h-5.5 text-slate-500 dark:text-slate-400" />
        </button>

        {/* Brand visual (Mobile only) */}
        <div className="flex items-center gap-2 lg:hidden">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-base">
            🎓
          </span>
          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 tracking-tight">
            EduPulse
          </span>
        </div>

        {/* Global Search (Desktop only) */}
        <div className="relative w-64 md:w-80 hidden md:block">
          <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none w-4 h-4 text-slate-400 dark:text-slate-500 my-auto" />
          <input
            type="text"
            placeholder="Search students, marks, logs..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl py-2 pl-10 pr-4 text-xs font-medium placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
        </div>
      </div>

      {/* Right section: Profile & Theme Switcher */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Role badge */}
        <span className={`text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getRoleBadgeColor()}`}>
          {role}
        </span>

        {/* Dynamic 3-Way Theme Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowThemeDropdown(!showThemeDropdown)}
            className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all cursor-pointer relative"
            title="Toggle Theme"
          >
            {theme === "light" && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === "dark" && <Moon className="w-4 h-4 text-indigo-400" />}
            {theme === "system" && <Laptop className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
          </button>

          {showThemeDropdown && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowThemeDropdown(false)} />
              <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-40 py-1.5 animate-fade-in-up">
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

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-40 py-2 animate-fade-in-up">
                <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Notifications</span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 cursor-pointer">Mark all read</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer border-b border-slate-50/50 dark:border-slate-800/50 last:border-0 ${n.unread ? "bg-indigo-50/30 dark:bg-indigo-950/10" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{n.title}</p>
                        {n.unread && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />}
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{n.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Avatar Profile Trigger */}
        <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-800 pl-4">
          <img
            src={
              role === "admin" 
                ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" 
                : role === "teacher" 
                ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
                : "https://images.unsplash.com/photo-1597003890212-47cd68fc3649?w=150"
            }
            alt="Profile Avatar"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-50/50 dark:ring-indigo-950/20"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
              {role === "admin" ? "Sridhar Silver" : role === "student" ? "Aarav Sharma" : "Rajesh Sharma"}
            </p>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 leading-none">
              {role === "admin" ? "School Director" : role === "student" ? "Roll #12 (10-A)" : "Guardian"}
            </p>
          </div>

          {/* Quick Logout (Mobile top only) */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer lg:hidden"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
