import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { StatCard } from "../../components/StatCard";
import { dataAPI } from "../../data/mockData";
import { BookOpen, Calendar, Clock, Megaphone, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [homeworkList, setHomeworkList] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    // Load student "STU001" (Aarav Sharma) as default
    setStudent(dataAPI.getStudentById("STU001"));
    setHomeworkList(dataAPI.getHomework().filter(h => h.class === "Grade 10-A"));
    setNotices(dataAPI.getNotices());
  }, []);

  if (!student) return null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome Title */}
      <PageTitle
        title={`Welcome back, ${student.name}!`}
        breadcrumbs={[{ label: "Student" }, { label: "Dashboard" }]}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Attendance Rate"
          value={`${student.attendanceRate}%`}
          icon="CalendarCheck"
          trend="Above Avg"
          trendType="positive"
          description="Requirement: 85%"
          gradient="emerald"
        />
        <StatCard
          title="Pending Homework"
          value={homeworkList.length}
          icon="BookOpen"
          trend={`${homeworkList.length} Tasks`}
          trendType="neutral"
          description="Due this week"
          gradient="indigo"
        />
        <StatCard
          title="Term Fee Status"
          value={student.feeStatus}
          icon="CreditCard"
          trend={`$${student.feeAmount}`}
          trendType={student.feeStatus === "Paid" ? "positive" : "negative"}
          description={student.feeStatus === "Paid" ? "All settled" : "Due: June 01"}
          gradient={student.feeStatus === "Paid" ? "emerald" : "amber"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Homework list widget */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between transition-colors duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3 mb-4">
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Pending Worksheets</h4>
              <button
                onClick={() => navigate("/student/homework")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
              >
                All Assignments
              </button>
            </div>
            
            <div className="space-y-3.5">
              {homeworkList.map((hw) => (
                <div
                  key={hw.id}
                  onClick={() => navigate("/student/homework")}
                  className="flex items-center justify-between p-3.5 border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-80 rounded-2xl cursor-pointer transition-all gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold">
                      📝
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{hw.title}</p>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{hw.subject}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-rose-500 dark:text-rose-405 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-0.5 animate-pulse">
                    <Clock className="w-3 h-3 animate-none" />
                    Due: {hw.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* School Notices Widget */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3 mb-4">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Latest Bulletins</h4>
            <button
              onClick={() => navigate("/student/notices")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
            >
              See All
            </button>
          </div>
          <div className="space-y-3">
            {notices.slice(0, 3).map((n) => (
              <div
                key={n.id}
                onClick={() => navigate("/student/notices")}
                className="p-3 border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-80 rounded-2xl cursor-pointer transition-all flex flex-col gap-1 min-w-0"
              >
                <div className="flex justify-between items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none flex-1">{n.title}</span>
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border flex-shrink-0
                    ${n.priority === "High" ? "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/60 text-rose-600 dark:text-rose-405" : "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400"}`}>
                    {n.priority}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate leading-tight w-full">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
