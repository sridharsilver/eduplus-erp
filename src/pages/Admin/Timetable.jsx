import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { FormSelect } from "../../components/FormElements";
import { dataAPI } from "../../data/mockData";
import { Clock, Users, BookOpen, User } from "lucide-react";

export const Timetable = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [viewType, setViewType] = useState("class"); // "class" | "teacher"

  const weeklySchedule = dataAPI.getTimetableForClass(selectedClass);
  const teachers = dataAPI.getTeachers();

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    const list = dataAPI.getClasses();
    setClasses(list);
    if (list.length > 0) {
      setSelectedClass(list[0]);
    }
  }, []);

  // Filter Schedule based on Teacher across all classes if viewType is "teacher"
  const getTeacherSchedule = () => {
    if (!selectedTeacher) return {};
    const teacherName = teachers.find(t => t.id === selectedTeacher)?.name || "";
    const timetable = dataAPI.getTimetableForClass("Grade 10-A"); // main timetable
    const filtered = {};

    weekdays.forEach(day => {
      if (timetable[day]) {
        filtered[day] = timetable[day].filter(period => period.teacher === teacherName);
      } else {
        filtered[day] = [];
      }
    });

    return filtered;
  };

  const activeSchedule = viewType === "class" ? weeklySchedule : getTeacherSchedule();

  return (
    <div className="space-y-6">
      <PageTitle
        title="Timetable Scheduler"
        breadcrumbs={[{ label: "Admin" }, { label: "Timetable" }]}
      />

      {/* Selector controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm transition-colors duration-300">
        <div className="flex items-center border border-slate-100 dark:border-slate-800 rounded-xl p-1 bg-slate-50 dark:bg-slate-950 self-start">
          <button
            onClick={() => { setViewType("class"); setSelectedTeacher(""); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer
              ${viewType === "class" ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-800" : "text-slate-400 dark:text-slate-500"}`}
          >
            <Users className="w-4 h-4" />
            Class Schedule
          </button>
          <button
            onClick={() => { setViewType("teacher"); setSelectedTeacher(teachers[0]?.id || ""); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer
              ${viewType === "teacher" ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-800" : "text-slate-400 dark:text-slate-500"}`}
          >
            <User className="w-4 h-4" />
            Teacher Schedule
          </button>
        </div>

        <div className="w-full md:w-64">
          {viewType === "class" ? (
            <FormSelect
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              options={classes.map(c => ({ label: c, value: c }))}
              placeholder=""
            />
          ) : (
            <FormSelect
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              options={teachers.map(t => ({ label: t.name, value: t.id }))}
              placeholder=""
            />
          )}
        </div>
      </div>

      {/* Timetable Grid View */}
      <div className="space-y-4">
        {weekdays.map((day) => {
          const dayPeriods = activeSchedule[day] || [];
          return (
            <div key={day} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors duration-300">
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">{day}</h4>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {dayPeriods.length} Periods Scheduled
                </span>
              </div>

              {dayPeriods.length === 0 ? (
                <div className="py-6 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                  No active periods scheduled for this day.
                </div>
              ) : (
                /* Periodic grid details */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {dayPeriods.map((period, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/60 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/20 rounded-xl p-4 transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold bg-indigo-50 border border-indigo-150 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Period {period.period}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                          <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          {period.time}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm leading-snug group-hover:text-indigo-900 dark:group-hover:text-indigo-400 transition-colors">
                          {period.subject}
                        </h5>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 leading-none flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {period.teacher}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
