import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { AdminLayout } from "../layouts/AdminLayout";

// Auth Pages
import { Login } from "../pages/Auth/Login";
import { ForgotPassword } from "../pages/Auth/ForgotPassword";

// Admin Pages
import { Dashboard } from "../pages/Admin/Dashboard";
import { Students } from "../pages/Admin/Students";
import { Teachers } from "../pages/Admin/Teachers";
import { Attendance } from "../pages/Admin/Attendance";
import { Fees } from "../pages/Admin/Fees";
import { Homework } from "../pages/Admin/Homework";
import { Notices } from "../pages/Admin/Notices";
import { Timetable } from "../pages/Admin/Timetable";
import { Exams } from "../pages/Admin/Exams";

// Student Pages
import { StudentDashboard } from "../pages/Student/Dashboard";
import { StudentPages } from "../pages/Student/Pages";

// Parent Pages
import { ParentDashboard } from "../pages/Parent/Dashboard";
import { ParentPages } from "../pages/Parent/Pages";

// Teacher Pages
import { TeacherDashboard } from "../pages/Teacher/Dashboard";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin Modules Route Nesting */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="fees" element={<Fees />} />
        <Route path="homework" element={<Homework />} />
        <Route path="notices" element={<Notices />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="exams" element={<Exams />} />
      </Route>

      {/* Student Modules Route Nesting */}
      <Route path="/student" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="homework" element={<StudentPages activePage="homework" />} />
        <Route path="attendance" element={<StudentPages activePage="attendance" />} />
        <Route path="results" element={<StudentPages activePage="results" />} />
        <Route path="timetable" element={<StudentPages activePage="timetable" />} />
        <Route path="notices" element={<StudentPages activePage="notices" />} />
      </Route>

      {/* Parent Modules Route Nesting */}
      <Route path="/parent" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="attendance" element={<ParentPages activePage="attendance" />} />
        <Route path="homework" element={<ParentPages activePage="homework" />} />
        <Route path="fees" element={<ParentPages activePage="fees" />} />
        <Route path="timetable" element={<ParentPages activePage="timetable" />} />
        <Route path="notices" element={<ParentPages activePage="notices" />} />
      </Route>

      {/* Teacher Modules Route Nesting */}
      <Route path="/teacher" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="homework" element={<Homework />} />
        <Route path="exams" element={<Exams />} />
      </Route>

      {/* Catch-all redirects to Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
