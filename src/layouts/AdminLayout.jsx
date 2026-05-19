import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, NavLink, Navigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { TopHeader } from "../components/TopHeader";
import { MobileBottomNav } from "../components/MobileBottomNav";
import { Modal } from "../components/Modal";
import * as Icons from "lucide-react";

export const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const savedRole = localStorage.getItem("ep_role");

  // Close mobile drawer on route changes
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [location.pathname]);

  // Synchronous checks to avoid flashing unauthorized content
  if (!savedRole) {
    return <Navigate to="/" replace />;
  }

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const routePrefix = pathSegments[0];
  const validRoles = ["admin", "student", "parent", "teacher", "accounts"];

  if (validRoles.includes(routePrefix) && routePrefix !== savedRole) {
    return <Navigate to={`/${savedRole}/dashboard`} replace />;
  }

  const role = savedRole;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Full links configurations for the Mobile "More" Drawer based on roles
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
    accounts: [
      { path: "/accounts/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { path: "/accounts/fees", label: "Fees Management", icon: "CreditCard" }
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
    ]
  };

  const currentMenu = menuConfigs[role] || menuConfigs.admin;

  const handleLogout = () => {
    localStorage.removeItem("ep_role");
    localStorage.removeItem("ep_user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Desktop Left Sidebar */}
      <Sidebar
        role={role}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main Dashboard Space */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out pb-20 lg:pb-0 w-full min-w-0 overflow-x-hidden
          ${isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}`}
      >
        {/* Sticky Header */}
        <TopHeader
          role={role}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          onToggleDesktopSidebar={toggleSidebar}
        />

        {/* Content Box */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-[1600px] mx-auto w-full min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Menu */}
      <MobileBottomNav
        role={role}
        onOpenMoreDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Slide-out mobile drawer when "More" is clicked */}
      <Modal
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title="Application Navigation"
        type="drawer"
      >
        <div className="flex flex-col justify-between h-[calc(100vh-140px)]">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-3">All Modules</p>
            <div className="grid grid-cols-2 gap-2">
              {currentMenu.map((item) => {
                const IconComponent = Icons[item.icon] || Icons.HelpCircle;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-200 gap-1.5
                      ${isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold"
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                  >
                    <IconComponent className="w-5 h-5 stroke-[2]" />
                    <span className="text-[10px] leading-tight font-semibold tracking-wide">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Drawer logout footer */}
          <div className="border-t border-slate-200/60 dark:border-slate-800 pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/40 font-semibold text-sm transition-all cursor-pointer"
            >
              <Icons.LogOut className="w-4 h-4" />
              Sign Out from ERP
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
