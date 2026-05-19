import React from "react";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/PageTitle";
import { StatCard } from "../../components/StatCard";
import { BarChart, LineChart } from "../../components/Charts";
import { dataAPI } from "../../data/mockData";
import { PlusCircle, CalendarCheck, Megaphone, ArrowRight, UserCheck, Activity, Award } from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();
  
  // Load aggregate metrics from mock database
  const students = dataAPI.getStudents();
  const teachers = dataAPI.getTeachers();
  const notices = dataAPI.getNotices();
  const paymentLogs = dataAPI.getPaymentLogs();

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const avgAttendance = 93.6; // Aggregate mock value
  const totalCollectedFees = "12,400"; // Mock sum

  // Chart data
  const feeChartData = [
    { label: "Jan", value: 4500, prefix: "$" },
    { label: "Feb", value: 6200, prefix: "$" },
    { label: "Mar", value: 8900, prefix: "$" },
    { label: "Apr", value: 11000, prefix: "$" },
    { label: "May", value: 12400, prefix: "$" }
  ];

  const attendanceChartData = [
    { label: "Mon", value: 92 },
    { label: "Tue", value: 95 },
    { label: "Wed", value: 94 },
    { label: "Thu", value: 91 },
    { label: "Fri", value: 96 }
  ];

  // Activities list
  const recentActivities = [
    ...paymentLogs.slice(0, 3).map((log) => ({
      id: log.id,
      text: `${log.accountant || "Accountant"} logged fee payment of $${log.amount} for ${log.name} (${log.class})`,
      time: log.date,
      type: "fee"
    })),
    { id: "act-2", text: "Mrs. Meenakshi posted Mathematics Homework", time: "1 hour ago", type: "homework" },
    { id: "act-3", text: "Grade 10-A daily attendance recorded successfully", time: "3 hours ago", type: "attendance" },
    { id: "act-4", text: "Principal posted Annual Sports notice", time: "Yesterday", type: "notice" }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Title */}
      <PageTitle
        title="Admin Overview Dashboard"
        breadcrumbs={[{ label: "Admin" }, { label: "Dashboard" }]}
      />

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon="Users"
          trend="+4.2%"
          trendType="positive"
          description="from last month"
          gradient="indigo"
        />
        <StatCard
          title="Total Teachers"
          value={totalTeachers}
          icon="GraduationCap"
          trend="Stable"
          trendType="neutral"
          description="Active staff members"
          gradient="slate"
        />
        <StatCard
          title="Avg Attendance"
          value={`${avgAttendance}%`}
          icon="CalendarCheck"
          trend="+1.2%"
          trendType="positive"
          description="Weekly average rate"
          gradient="emerald"
        />
        <StatCard
          title="Fees Collected"
          value={`$${totalCollectedFees}`}
          icon="CreditCard"
          trend="+15.8%"
          trendType="positive"
          description="May statements"
          gradient="amber"
        />
      </div>

      {/* Interactive Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Collection Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">Monthly Fee Collection</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Revenue details for current term</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-xl">
              USD ($)
            </span>
          </div>
          <BarChart data={feeChartData} height={200} />
        </div>

        {/* Attendance Rates Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">Student Attendance Analytics</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Daily present rate for this week</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-xl">
              Rate (%)
            </span>
          </div>
          <LineChart data={attendanceChartData} height={200} />
        </div>
      </div>

      {/* Quick Action Bar + Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions (Touch friendly) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">Administrative Actions</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-4">Launch tools or register members</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/admin/students")}
              className="flex flex-col items-center justify-center p-3 border border-slate-100 dark:border-slate-800/60 hover:border-indigo-100 dark:hover:border-indigo-900/60 rounded-2xl hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 text-center transition-all cursor-pointer gap-2"
            >
              <PlusCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Register Student</span>
            </button>
            <button
              onClick={() => navigate("/admin/teachers")}
              className="flex flex-col items-center justify-center p-3 border border-slate-100 dark:border-slate-800/60 hover:border-indigo-100 dark:hover:border-indigo-900/60 rounded-2xl hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 text-center transition-all cursor-pointer gap-2"
            >
              <PlusCircle className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Register Teacher</span>
            </button>
            <button
              onClick={() => navigate("/admin/attendance")}
              className="flex flex-col items-center justify-center p-3 border border-slate-100 dark:border-slate-800/60 hover:border-indigo-100 dark:hover:border-indigo-900/60 rounded-2xl hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 text-center transition-all cursor-pointer gap-2"
            >
              <CalendarCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Mark Attendance</span>
            </button>
            <button
              onClick={() => navigate("/admin/notices")}
              className="flex flex-col items-center justify-center p-3 border border-slate-100 dark:border-slate-800/60 hover:border-indigo-100 dark:hover:border-indigo-900/60 rounded-2xl hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 text-center transition-all cursor-pointer gap-2"
            >
              <Megaphone className="w-6 h-6 text-amber-600 dark:text-amber-455" />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Post Notice</span>
            </button>
          </div>
        </div>

        {/* Notices list widgets */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-slate-800 pb-3">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">Sticky Notice Board</h4>
            <button
              onClick={() => navigate("/admin/notices")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
            >
              All Notices
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
            {notices.map((n) => (
              <div
                key={n.id}
                onClick={() => navigate("/admin/notices")}
                className="p-3 border border-slate-50 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer flex flex-col gap-1.5 min-w-0"
              >
                <div className="flex justify-between items-start gap-2 min-w-0">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight truncate flex-1">{n.title}</span>
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border flex-shrink-0
                    ${n.priority === "High" 
                      ? "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400" 
                      : "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400"}`}>
                    {n.priority}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight truncate w-full">{n.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent logs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm transition-colors duration-300">
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-50 dark:border-slate-800 pb-3">Recent Activity Logs</h4>
          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex gap-3 items-start">
                <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 mt-0.5">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">{act.text}</p>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
