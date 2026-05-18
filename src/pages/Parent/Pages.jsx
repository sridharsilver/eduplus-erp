import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { dataAPI } from "../../data/mockData";
import { Clock, Calendar, ShieldAlert, CreditCard, Printer, Eye } from "lucide-react";
import { useToast } from "../../components/Toast";
import { Modal } from "../../components/Modal";

export const ParentPages = ({ activePage = "attendance" }) => {
  const [student, setStudent] = useState(null);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    // Load Child STU001 (Aarav Sharma)
    const stu = dataAPI.getStudentById("STU001");
    setStudent(stu);

    if (activePage === "attendance") {
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
    } else if (activePage === "homework") {
      setData(dataAPI.getHomework().filter(h => h.class === "Grade 10-A"));
    } else if (activePage === "fees") {
      // Just Aarav's fee profile
      setData([stu]);
    } else if (activePage === "timetable") {
      setData(dataAPI.getTimetableForClass("Grade 10-A"));
    } else if (activePage === "notices") {
      setData(dataAPI.getNotices());
    }
  }, [activePage]);

  const handleOpenDetail = (hw) => {
    setSelectedItem(hw);
    setIsDetailOpen(true);
  };

  const handleOpenReceipt = (stuItem) => {
    setSelectedItem(stuItem);
    setIsReceiptOpen(true);
  };

  const handleSimulatePayment = (stuItem) => {
    if (stuItem.feeStatus === "Paid") {
      showToast("Fee is already fully paid!", "info");
      return;
    }

    dataAPI.updateStudent(stuItem.id, { feeStatus: "Paid", attendanceRate: stuItem.attendanceRate });
    setStudent(dataAPI.getStudentById("STU001"));
    setData([dataAPI.getStudentById("STU001")]);
    showToast(`Simulation complete: Received $${stuItem.feeAmount} online fee payment! Receipt generated.`, "success");
  };

  const getPageTitle = () => {
    switch (activePage) {
      case "attendance": return "Child Attendance Log";
      case "homework": return "Child Assignments Ledger";
      case "fees": return "Child Tuition Statements";
      case "timetable": return "Child Weekly Timetable";
      case "notices": return "School Board Announcements";
      default: return "Portal Module";
    }
  };

  if (!student) return null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {ToastComponent}
      <PageTitle
        title={getPageTitle()}
        breadcrumbs={[{ label: "Parent" }, { label: getPageTitle() }]}
      />

      {/* RENDER CHILD ATTENDANCE LOG */}
      {activePage === "attendance" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm max-w-2xl transition-colors duration-300">
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">Daily Attendance records</h4>
          <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 text-left">
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
                      No attendance logs recorded for Aarav Sharma yet.
                    </td>
                  </tr>
                ) : (
                  data.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{log.date}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border
                          ${log.status === "Present" ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400" : "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-100 dark:border-rose-900/40 dark:text-rose-400"}`}>
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

      {/* RENDER CHILD HOMEWORK LIST */}
      {activePage === "homework" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((hw) => (
            <div key={hw.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between transition-colors duration-300">
              <div>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <span className="text-[9px] font-bold bg-indigo-50 border border-indigo-150 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {hw.subject}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">{hw.class}</span>
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

      {/* RENDER FEES STATEMENTS */}
      {activePage === "fees" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm lg:col-span-2 space-y-4 transition-colors duration-300">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Current Term Statements</h4>
            {data.map((stuItem) => (
              <div key={stuItem.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-50 dark:border-slate-800 rounded-2xl gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">First Term Tuition Fee</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Net Amount Due: <span className="font-extrabold text-slate-600 dark:text-slate-400">${stuItem.feeAmount}</span></p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 border rounded-full uppercase
                    ${stuItem.feeStatus === "Paid" ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/60 dark:text-emerald-450" : "bg-rose-50 border-rose-100 text-rose-650 dark:bg-rose-950/20 dark:border-rose-100 dark:border-rose-900/60 dark:text-rose-405"}`}>
                    {stuItem.feeStatus}
                  </span>
                  
                  {stuItem.feeStatus !== "Paid" ? (
                    <button
                      onClick={() => handleSimulatePayment(stuItem)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                    >
                      Pay Online
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenReceipt(stuItem)}
                      className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 h-fit transition-colors duration-300">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Billing Support</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
              If you experience payment verification issues, contact accounts at: <span className="font-bold text-slate-707 dark:text-slate-300">accounts@school.com</span>
            </p>
          </div>
        </div>
      )}

      {/* RENDER CHILD TIMETABLE */}
      {activePage === "timetable" && (
        <div className="space-y-4">
          {Object.keys(data).map((day) => (
            <div key={day} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 transition-colors duration-300">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-50 dark:border-slate-800 pb-2 capitalize">{day}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {data[day].map((period, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 p-3 rounded-xl flex flex-col justify-between gap-2.5 transition-colors duration-300">
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/60 dark:text-indigo-400 px-1.5 py-0.5 rounded-full">
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

      {/* RENDER NOTICES */}
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
                    ${n.priority === "High" ? "bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400" : "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-400"}`}>
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

      {/* Homework Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedItem?.subject ? "Homework Details" : "Announcement bulletin"}
        size="md"
      >
        {selectedItem && (
          <div className="space-y-5 text-left animate-fade-in-up">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold bg-indigo-50 border border-indigo-150 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {selectedItem.subject || selectedItem.category}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-105 leading-tight mt-2">{selectedItem.title}</h3>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-650 dark:text-slate-300 leading-relaxed font-medium">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2">Instructions</p>
              <p className="whitespace-pre-line">{selectedItem.description || selectedItem.content}</p>
            </div>

            {selectedItem.dueDate && (
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-405">
                <span>Due Date:</span>
                <span className="text-rose-600 dark:text-rose-455 font-bold">{selectedItem.dueDate}</span>
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

      {/* Invoice Receipt Modal */}
      <Modal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="Official School Payment Invoice"
        size="md"
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-2 shadow-md">
                🎓
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">EduPulse Central Academy</h3>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">MG Road, Pune • Affiliation #10412</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase">Invoiced To:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm block mt-0.5">{selectedItem.name}</span>
                <span className="text-slate-400 dark:text-slate-500 block mt-0.5">{selectedItem.class} • Roll #{selectedItem.rollNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase">Receipt Logs:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold block mt-0.5">REC-{selectedItem.id}</span>
                <span className="text-slate-400 dark:text-slate-500 block mt-0.5">Date: {new Date().toISOString().split("T")[0]}</span>
              </div>
            </div>

            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 grid grid-cols-3 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800">
                <span>Fee Description</span>
                <span className="text-center">Status</span>
                <span className="text-right">Total Amount</span>
              </div>
              <div className="p-3 grid grid-cols-3 font-semibold text-slate-707 dark:text-slate-300 items-center">
                <span>First Term Tuition Charges</span>
                <span className="text-center">
                  <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400`}>
                    {selectedItem.feeStatus}
                  </span>
                </span>
                <span className="text-right font-bold text-slate-900 dark:text-slate-100">${selectedItem.feeAmount}</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-slate-50/60 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Aggregate Net Paid:</span>
              <span className="text-lg font-black text-slate-900 dark:text-slate-100">${selectedItem.feeAmount}</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { window.print(); }}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-950 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Dismiss Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
