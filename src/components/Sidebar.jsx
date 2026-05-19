import React from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";

export const Sidebar = ({ role = "admin", isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define sidebar navigation configuration based on role
  const menuConfigs = {
    admin: [
      { path: "/admin/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { path: "/admin/students", label: "Students", icon: "Users" },
      { path: "/admin/teachers", label: "Teachers", icon: "GraduationCap" },
      { path: "/admin/attendance", label: "Attendance", icon: "CalendarCheck" },
      { path: "/admin/fees", label: "Fees Management", icon: "CreditCard" },
      { path: "/admin/homework", label: "Homework", icon: "BookOpen" },
      { path: "/admin/notices", label: "Notice Board", icon: "Megaphone" },
      { path: "/admin/timetable", label: "Timetable", icon: "Clock" },
      { path: "/admin/exams", label: "Exams & Results", icon: "FileSpreadsheet" }
    ],
    student: [
      { path: "/student/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { path: "/student/homework", label: "My Homework", icon: "BookOpen" },
      { path: "/student/attendance", label: "My Attendance", icon: "CalendarCheck" },
      { path: "/student/results", label: "Exam Results", icon: "FileSpreadsheet" },
      { path: "/student/timetable", label: "Class Timetable", icon: "Clock" },
      { path: "/student/notices", label: "Notices", icon: "Megaphone" }
    ],
    parent: [
      { path: "/parent/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { path: "/parent/attendance", label: "Child Attendance", icon: "CalendarCheck" },
      { path: "/parent/homework", label: "Child Homework", icon: "BookOpen" },
      { path: "/parent/fees", label: "Fee Statements", icon: "CreditCard" },
      { path: "/parent/timetable", label: "Weekly Schedule", icon: "Clock" },
      { path: "/parent/notices", label: "School Notices", icon: "Megaphone" }
    ],
    teacher: [
      { path: "/teacher/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { path: "/teacher/attendance", label: "Mark Attendance", icon: "CalendarCheck" },
      { path: "/teacher/homework", label: "Add Homework", icon: "BookOpen" },
      { path: "/teacher/exams", label: "Enter Marks", icon: "FileSpreadsheet" }
    ],
    accounts: [
      { path: "/accounts/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { path: "/accounts/fees", label: "Fees Management", icon: "CreditCard" }
    ]
  };

  const activeMenu = menuConfigs[role] || menuConfigs.admin;

  const handleLogout = () => {
    // Simulated logout
    localStorage.removeItem("ep_role");
    localStorage.removeItem("ep_user");
    navigate("/");
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-slate-900 text-slate-300 border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 ease-in-out hidden lg:flex overflow-x-hidden
        ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Brand Header */}
      <div>
        <div className={`h-16 px-6 border-b border-slate-800/80 flex items-center justify-between`}>
          <Link to={`/${role}/dashboard`} className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg shadow-indigo-500/20">
              🎓
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-base tracking-tight text-white animate-fade-in-up">
                EduPulse<span className="text-indigo-500">ERP</span>
              </span>
            )}
          </Link>
          <button
            onClick={onToggle}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            {isCollapsed ? <Icons.ChevronRight className="w-5 h-5" /> : <Icons.ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Scrollable Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-140px)]">
          {activeMenu.map((item) => {
            const IconComponent = Icons[item.icon] || Icons.HelpCircle;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
              >
                <IconComponent className={`w-5 h-5 stroke-[2] flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                
                {/* Tooltip on collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-20 bg-slate-950 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-slate-800 shadow-xl">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Footer Section */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-semibold rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer group relative`}
        >
          <Icons.LogOut className="w-5 h-5 stroke-[2] flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
          
          {/* Tooltip on collapsed state */}
          {isCollapsed && (
            <div className="absolute left-20 bg-slate-950 text-rose-400 text-xs font-bold px-3 py-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-slate-800 shadow-xl">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
