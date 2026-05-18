import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { dataAPI } from "../../data/mockData";
import { BookOpen, CalendarCheck, Clock, Megaphone, FileSpreadsheet } from "lucide-react";
import { useToast } from "../../components/Toast";
import { Modal } from "../../components/Modal";

export const StudentPages = ({ activePage = "homework" }) => {
  const [student, setStudent] = useState(null);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    // Load default student Aarav Sharma (STU001) details
    const stu = dataAPI.getStudentById("STU001");
    setStudent(stu);

    if (activePage === "homework") {
      setData(dataAPI.getHomework().filter(h => h.class === "Grade 10-A"));
    } else if (activePage === "attendance") {
      const allAttendance = dataAPI.getAttendance();
      const records = [];
      Object.keys(allAttendance).forEach(key => {
        if (key.startsWith("Grade 10-A")) {
          const date = key.split("_")[1];
          const match = allAttendance[key].find(r => r.studentId === "STU001");
          if (match) records.push({ date, status: match.status });
        }
      });
      setData(records.sort((a, b) => b.date.localeCompare(a.date)));
    } else if (activePage === "timetable") {
      setData(dataAPI.getTimetableForClass("Grade 10-A"));
    } else if (activePage === "results") {
      setData(dataAPI.getResultsForStudent("STU001"));
    } else if (activePage === "notices") {
      setData(dataAPI.getNotices());
    }
  }, [activePage]);

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const getPageTitle = () => {
    switch (activePage) {
      case "homework": return "My Homework Worksheets";
      case "attendance": return "My Attendance Tracker";
      case "timetable": return "My Weekly Schedule";
      case "results": return "My Examination Grades";
      case "notices": return "School Board Notices";
      default: return "Portal Module";
    }
  };

  if (!student) return null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {ToastComponent}
      <PageTitle
        title={getPageTitle()}
        breadcrumbs={[{ label: "Student" }, { label: getPageTitle() }]}
      />

      {/* RENDER HOMEWORK SECTION */}
      {activePage === "homework" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((hw) => (
            <div key={hw.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between transition-colors duration-300">
              <div>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <span className="text-[9px] font-bold bg-indigo-50 border border-indigo-150 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {hw.subject}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{hw.class}</span>
                </div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-base leading-tight mb-2 truncate">{hw.title}</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed mb-4">{hw.description}</p>
              </div>
              <div className="border-t border-slate-50 dark:border-slate-800 pt-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Due: {hw.dueDate}
                </span>
                <button
                  onClick={() => handleOpenDetail(hw)}
                  className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RENDER ATTENDANCE SECTION */}
      {activePage === "attendance" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm max-w-2xl transition-colors duration-300">
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">Daily Attendance logs</h4>
          <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Logged Date</th>
                  <th className="px-6 py-3.5">Status Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-bold">
                      No attendance logs recorded for you yet.
                    </td>
                  </tr>
                ) : (
                  data.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{log.date}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border
                          ${log.status === "Present" ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-400" : "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/60 dark:text-rose-405"}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER TIMETABLE SECTION */}
      {activePage === "timetable" && (
        <div className="space-y-4">
          {Object.keys(data).map((day) => (
            <div key={day} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 transition-colors duration-300">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-50 dark:border-slate-800 pb-2 capitalize">{day}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {data[day].map((period, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 p-3 rounded-xl flex flex-col justify-between gap-2.5 transition-colors duration-300">
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400 px-1.5 py-0.5 rounded-full">
                        Period {period.period}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500">{period.time}</span>
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 dark:text-slate-200 text-xs leading-snug">{period.subject}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-none mt-0.5">{period.teacher}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RENDER RESULTS SECTION */}
      {activePage === "results" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm max-w-3xl space-y-6 transition-colors duration-300">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-500/15">
                🎓
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">Official Term Grade Sheet</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">EduPulse Central Registry</p>
              </div>
            </div>
            <div className="text-center sm:text-right text-xs font-semibold text-slate-500 dark:text-slate-405">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{student.name}</p>
              <p className="text-slate-400 dark:text-slate-500 block mt-0.5">{student.class} • Roll #{student.rollNumber}</p>
            </div>
          </div>

          <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 grid grid-cols-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              <span>Subject</span>
              <span className="text-center">Max Score</span>
              <span className="text-center">Score Scored</span>
              <span className="text-right">Grade Badge</span>
            </div>
            {data.map((rep, idx) => (
              <div key={idx} className="p-3.5 grid grid-cols-4 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-50 dark:border-slate-800 last:border-0 items-center">
                <span>{rep.subject}</span>
                <span className="text-center text-slate-400 dark:text-slate-500">{rep.maxMarks}</span>
                <span className="text-center font-bold text-slate-800 dark:text-slate-200">{rep.marks}</span>
                <span className="text-right">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 border rounded-md inline-block
                    ${rep.grade.startsWith("A") ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/60"}`}>
                    {rep.grade}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center bg-slate-50/60 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Aggregate Total Percentage:</span>
            <span className="text-base font-black text-slate-800 dark:text-slate-200">
              {Math.round(data.reduce((acc, r) => acc + r.marks, 0) / data.length)}%
            </span>
          </div>
        </div>
      )}

      {/* RENDER NOTICES SECTION */}
      {activePage === "notices" && (
        <div className="space-y-4">
          {data.map((n) => (
            <div
              key={n.id}
              onClick={() => handleOpenDetail(n)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full uppercase tracking-wider
                    ${n.priority === "High" ? "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400" : "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-400"}`}>
                    {n.priority} Priority
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {n.date}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-base leading-snug">{n.title}</h4>
                <p className="text-xs text-slate-450 dark:text-slate-500 line-clamp-2 leading-relaxed">{n.content}</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-0.5">
                Read Notice
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Details Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem?.title ? "Worksheet Details" : "Notice board bulletin"}
        size="md"
      >
        {selectedItem && (
          <div className="space-y-5 text-left animate-fade-in-up">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold bg-indigo-50 border border-indigo-150 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {selectedItem.subject || selectedItem.category}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight mt-2">{selectedItem.title}</h3>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-650 dark:text-slate-300 leading-relaxed font-medium">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2">Instructions</p>
              <p className="whitespace-pre-line">{selectedItem.description || selectedItem.content}</p>
            </div>

            {selectedItem.dueDate && (
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-405">
                <span>Due Date:</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{selectedItem.dueDate}</span>
              </div>
            )}

            {selectedItem.postedBy && (
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-405">
                <span>Posted By:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedItem.postedBy}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
