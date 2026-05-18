import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { StatCard } from "../../components/StatCard";
import { dataAPI } from "../../data/mockData";
import { BookOpen, Calendar, Clock, Megaphone, CheckCircle2, ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [homeworkCount, setHomeworkCount] = useState(0);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const classList = dataAPI.getClasses();
    setClasses(classList);

    // Dynamic metrics
    const totalStudents = dataAPI.getStudents().length;
    setStudentsCount(totalStudents);

    const totalHw = dataAPI.getHomework().length;
    setHomeworkCount(totalHw);

    setNotices(dataAPI.getNotices());
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageTitle
        title="Faculty Dashboard"
        breadcrumbs={[{ label: "Teacher" }, { label: "Dashboard" }]}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Classes"
          value={classes.length}
          icon="GraduationCap"
          trend={`${classes.length} Sections`}
          trendType="neutral"
          description="Grades and sections"
          gradient="indigo"
        />
        <StatCard
          title="Student Directory"
          value={studentsCount}
          icon="Users"
          trend="Active Registry"
          trendType="positive"
          description="Total enrolled pupils"
          gradient="emerald"
        />
        <StatCard
          title="Worksheets Assigned"
          value={homeworkCount}
          icon="BookOpen"
          trend={`${homeworkCount} Sheets`}
          trendType="neutral"
          description="Homework tasks created"
          gradient="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes quick management list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4 transition-colors duration-300">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">My Leads & Classes</h4>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Curriculum</span>
          </div>

          <div className="space-y-3.5">
            {classes.map((cls) => (
              <div
                key={cls}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-50 dark:border-slate-800 rounded-2xl gap-4 hover:shadow-sm transition-all bg-slate-50/50 dark:bg-slate-800/50"
              >
                <div>
                  <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm leading-none">{cls}</h5>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Lead Tutor Assigned</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/teacher/attendance")}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Attendance
                  </button>
                  <button
                    onClick={() => navigate("/teacher/homework")}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-150 dark:border-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer bg-white dark:bg-slate-900"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Homework
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices Board */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Bulletins Feed</h4>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Notices</span>
          </div>

          <div className="space-y-3">
            {notices.slice(0, 3).map((n) => (
              <div
                key={n.id}
                className="p-3 border border-slate-50 dark:border-slate-800 rounded-2xl flex flex-col gap-1 hover:bg-slate-50 dark:hover:bg-slate-80 transition-all cursor-pointer min-w-0"
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
