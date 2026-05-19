import React from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";

export const MobileBottomNav = ({ role = "admin", onOpenMoreDrawer }) => {
  // Mobile menus are optimized: 4 priority tabs + 1 "More" tab or specific quick tabs
  const mobileMenus = {
    admin: [
      { path: "/admin/dashboard", label: "Home", icon: "LayoutDashboard" },
      { path: "/admin/students", label: "Students", icon: "Users" },
      { path: "/admin/attendance", label: "Attendance", icon: "CalendarCheck" },
      { path: "/admin/notices", label: "Notices", icon: "Megaphone" }
    ],
    student: [
      { path: "/student/dashboard", label: "Home", icon: "LayoutDashboard" },
      { path: "/student/homework", label: "Homework", icon: "BookOpen" },
      { path: "/student/attendance", label: "Attendance", icon: "CalendarCheck" },
      { path: "/student/notices", label: "Notices", icon: "Megaphone" }
    ],
    parent: [
      { path: "/parent/dashboard", label: "Home", icon: "LayoutDashboard" },
      { path: "/parent/attendance", label: "Attendance", icon: "CalendarCheck" },
      { path: "/parent/fees", label: "Fees", icon: "CreditCard" },
      { path: "/parent/notices", label: "Notices", icon: "Megaphone" }
    ],
    teacher: [
      { path: "/teacher/dashboard", label: "Home", icon: "LayoutDashboard" },
      { path: "/teacher/attendance", label: "Attendance", icon: "CalendarCheck" },
      { path: "/teacher/homework", label: "Homework", icon: "BookOpen" },
      { path: "/teacher/exams", label: "Grading", icon: "FileSpreadsheet" }
    ],
    accounts: [
      { path: "/accounts/dashboard", label: "Home", icon: "LayoutDashboard" },
      { path: "/accounts/fees", label: "Fees", icon: "CreditCard" }
    ]
  };

  const currentTabs = mobileMenus[role] || mobileMenus.admin;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 shadow-2xl z-40 lg:hidden safe-padding-bottom flex items-center justify-around h-16 px-2 transition-colors duration-300">
      {currentTabs.map((tab) => {
        const IconComponent = Icons[tab.icon] || Icons.HelpCircle;

        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all text-xs font-semibold
              ${isActive 
                ? "text-indigo-600 dark:text-indigo-400 scale-105" 
                : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350"}`}
          >
            <IconComponent className="w-5.5 h-5.5 stroke-[2] mb-0.5" />
            <span className="text-[10px] tracking-wide leading-none">{tab.label}</span>
          </NavLink>
        );
      })}

      {/* ADMIN OR STUDENT "MORE" OPTION */}
      <button
        onClick={onOpenMoreDrawer}
        className="flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 text-xs font-semibold cursor-pointer"
      >
        <Icons.Menu className="w-5.5 h-5.5 stroke-[2] mb-0.5" />
        <span className="text-[10px] tracking-wide leading-none">More</span>
      </button>
    </nav>
  );
};
