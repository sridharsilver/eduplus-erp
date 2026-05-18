import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { FormSelect, FormInput } from "../../components/FormElements";
import { useToast } from "../../components/Toast";
import { dataAPI } from "../../data/mockData";
import { CalendarCheck, Save, Users, UserX, CheckCircle, XCircle } from "lucide-react";

export const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // { studentId: "Present" | "Absent" }
  const { showToast, ToastComponent } = useToast();

  // Load initial classes list
  useEffect(() => {
    const list = dataAPI.getClasses();
    setClasses(list);
    if (list.length > 0) {
      setSelectedClass(list[0]);
    }
  }, []);

  // Load students for active class
  useEffect(() => {
    if (!selectedClass) return;
    const classStudents = dataAPI.getStudents().filter(s => s.class === selectedClass);
    setStudents(classStudents);

    // Load active records
    const existing = dataAPI.getAttendanceForClassAndDate(selectedClass, selectedDate);
    const initialRecords = {};

    classStudents.forEach(stu => {
      const match = existing.find(r => r.studentId === stu.id);
      initialRecords[stu.id] = match ? match.status : "Present"; // default present
    });

    setAttendanceRecords(initialRecords);
  }, [selectedClass, selectedDate]);

  const handleToggle = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = () => {
    if (!selectedClass) return;
    const studentRecords = Object.keys(attendanceRecords).map(id => ({
      studentId: id,
      status: attendanceRecords[id]
    }));

    dataAPI.saveAttendance(selectedClass, selectedDate, studentRecords);
    showToast(`Attendance for ${selectedClass} successfully saved!`, "success");
  };

  // Metrics
  const total = students.length;
  const presentCount = Object.values(attendanceRecords).filter(v => v === "Present").length;
  const absentCount = total - presentCount;
  const percent = total > 0 ? Math.round((presentCount / total) * 100) : 100;

  // Mock Monthly Attendance Logs (Simulating grid)
  const daysInMonth = Array.from({ length: 15 }, (_, i) => String(i + 1).padStart(2, "0"));

  const currentRole = localStorage.getItem("ep_role") || "admin";
  const roleLabel = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {ToastComponent}
      <PageTitle
        title="Attendance Ledger"
        breadcrumbs={[{ label: roleLabel }, { label: "Attendance" }]}
      />

      {/* Class and Date Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm items-end transition-colors duration-300">
        <FormSelect
          label="Target Class"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          options={classes.map(c => ({ label: c, value: c }))}
        />
        <FormInput
          label="Date of Attendance"
          type="date"
          value={selectedDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-500/10 text-sm cursor-pointer h-12"
        >
          <Save className="w-4 h-4" />
          Save Daily Sheet
        </button>
      </div>

      {/* Overview stats cards - Optimized for tight mobile screens */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-2.5 sm:p-4 text-center transition-colors duration-300">
          <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Total Students</p>
          <p className="text-lg sm:text-2xl font-black text-slate-800 dark:text-slate-200 mt-1 sm:mt-1.5 leading-none">{total}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-2.5 sm:p-4 text-center transition-colors duration-300">
          <p className="text-[8px] sm:text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Present</p>
          <p className="text-lg sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1 sm:mt-1.5 leading-none">{presentCount}</p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl p-2.5 sm:p-4 text-center transition-colors duration-300">
          <p className="text-[8px] sm:text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none">Absent</p>
          <p className="text-lg sm:text-2xl font-black text-rose-700 dark:text-rose-400 mt-1 sm:mt-1.5 leading-none">{absentCount}</p>
        </div>
      </div>

      {/* Main Checklist to Mark Attendance (Mobile-first responsive cards + list layouts) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4 transition-colors duration-300">
        <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
          <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Users className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-500" />
            Checklist ({percent}% Present)
          </h4>
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{selectedDate}</span>
        </div>

        {students.length === 0 ? (
          <div className="py-12 text-center text-sm font-semibold text-slate-400 dark:text-slate-550">
            No students are currently registered in this class.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {students.map((stu) => {
              const status = attendanceRecords[stu.id] || "Present";
              return (
                <div
                  key={stu.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-2xl gap-3 transition-all bg-slate-50/20 dark:bg-slate-800/10"
                >
                  <div className="flex items-center gap-3">
                    <img src={stu.avatar} alt="" className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                    <div className="text-left">
                      <p className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-tight">{stu.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5 sm:mt-1">ID: {stu.id} • Roll #{stu.rollNumber}</p>
                    </div>
                  </div>

                  {/* Adaptive present/absent triggers */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleToggle(stu.id, "Present")}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer h-10 sm:h-auto
                        ${status === "Present"
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/10"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-400 dark:text-slate-450 hover:text-slate-650 dark:hover:text-slate-200"}`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Present
                    </button>
                    <button
                      onClick={() => handleToggle(stu.id, "Absent")}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer h-10 sm:h-auto
                        ${status === "Absent"
                          ? "bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-500/10"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-400 dark:text-slate-450 hover:text-slate-650 dark:hover:text-slate-200"}`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Attendance Sheet (Grid design with visual swipe assistants) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">Monthly Student Summary</h4>
          <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 px-2 py-0.5 rounded-full uppercase tracking-wider self-start sm:self-auto flex items-center gap-1">
            Swipe Right to View History ➡️
          </span>
        </div>
        <p className="text-xs text-slate-450 dark:text-slate-500 font-medium leading-relaxed">
          Historical overview of attendance rates in current month (1-15 days logs summary)
        </p>

        <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl scrollbar-thin">
          <table className="min-w-[760px] divide-y divide-slate-100 dark:divide-slate-800 table-fixed text-left text-xs font-bold">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-slate-500 dark:text-slate-400 uppercase w-40">Student</th>
                {daysInMonth.map(d => (
                  <th key={d} className="px-2 py-3 text-slate-500 dark:text-slate-400 text-center w-10">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {students.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 truncate font-extrabold">{stu.name}</td>
                  {daysInMonth.map(d => {
                    // Simulate random patterns based on student attendanceRate
                    const isPresent = stu.attendanceRate > 90 ? Math.random() > 0.08 : Math.random() > 0.22;
                    return (
                      <td key={d} className="px-2 py-3 text-center">
                        <span className={`w-2.5 h-2.5 rounded-full inline-block
                          ${isPresent ? "bg-emerald-500 shadow-sm shadow-emerald-400/20" : "bg-rose-500 shadow-sm shadow-rose-550/20"}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
