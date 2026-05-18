import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { StatCard } from "../../components/StatCard";
import { dataAPI } from "../../data/mockData";
import { useNavigate } from "react-router-dom";
import { Calendar, CreditCard, Clock, CheckCircle } from "lucide-react";
import { useToast } from "../../components/Toast";

export const ParentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [homeworkList, setHomeworkList] = useState([]);
  const [notices, setNotices] = useState([]);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    // Load Child "STU001" (Aarav Sharma) details
    setStudent(dataAPI.getStudentById("STU001"));
    setHomeworkList(dataAPI.getHomework().filter(h => h.class === "Grade 10-A"));
    setNotices(dataAPI.getNotices());
  }, []);

  const handleSimulatePayment = () => {
    if (!student) return;
    if (student.feeStatus === "Paid") {
      showToast("Fee is already fully paid!", "info");
      return;
    }

    dataAPI.updateStudent(student.id, { feeStatus: "Paid", attendanceRate: student.attendanceRate });
    setStudent(dataAPI.getStudentById("STU001"));
    showToast(`Simulation complete: Received $${student.feeAmount} online fee payment! Receipt generated.`, "success");
  };

  if (!student) return null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {ToastComponent}
      <PageTitle
        title="Parent Portal"
        breadcrumbs={[{ label: "Parent" }, { label: "Dashboard" }]}
      />

      {/* Child overview header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-850 text-white rounded-3xl p-5 md:p-6 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <img src={student.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover border border-white/20 shadow-lg" />
        <div className="text-center sm:text-left space-y-1">
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest leading-none">Guardian Dashboard</p>
          <h3 className="text-xl font-black tracking-tight">{student.name}</h3>
          <p className="text-xs text-indigo-200/90 font-medium">
            Enrolled Class: <span className="font-bold">{student.class}</span> • Roll Number: <span className="font-bold">{student.rollNumber}</span>
          </p>
        </div>

        <button
          onClick={() => navigate("/parent/attendance")}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs rounded-xl transition-all cursor-pointer sm:ml-auto self-center sm:self-auto"
        >
          View Full History
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Child Attendance Rate"
          value={`${student.attendanceRate}%`}
          icon="CalendarCheck"
          trend="Excellent"
          trendType="positive"
          description="Aggregate percentage rate"
          gradient="emerald"
        />
        <StatCard
          title="Assigned Tasks"
          value={`${homeworkList.length} Tasks`}
          icon="BookOpen"
          trend="In Progress"
          trendType="neutral"
          description="Homework worksheets"
          gradient="indigo"
        />
        <StatCard
          title="Payment Statement"
          value={student.feeStatus}
          icon="CreditCard"
          trend={`$${student.feeAmount}`}
          trendType={student.feeStatus === "Paid" ? "positive" : "negative"}
          description={student.feeStatus === "Paid" ? "Cleared receipt" : "Outstanding invoices"}
          gradient={student.feeStatus === "Paid" ? "emerald" : "rose"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Homework widgets */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between transition-colors duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3 mb-4">
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Child Worksheets</h4>
              <button
                onClick={() => navigate("/parent/homework")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
              >
                Full List
              </button>
            </div>
            
            <div className="space-y-3">
              {homeworkList.map((hw) => (
                <div
                  key={hw.id}
                  onClick={() => navigate("/parent/homework")}
                  className="flex items-center justify-between p-3 border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-80 rounded-2xl cursor-pointer transition-all gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold">
                      📝
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[160px]">{hw.title}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">{hw.subject}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-rose-500 dark:text-rose-405 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    Due: {hw.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick fee bill simulator card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">Fee Statement Summary</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-4">Manage or pay online invoices</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3.5 my-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400 dark:text-slate-500">Tuition Fees:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">${student.feeAmount}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-slate-200/60 dark:border-slate-700 pt-3">
              <span className="font-bold text-slate-500 dark:text-slate-400">Net Due Status:</span>
              <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full uppercase
                ${student.feeStatus === "Paid" ? "bg-emerald-50 border-emerald-150 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-400" : "bg-rose-50 border-rose-150 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/60 dark:text-rose-400"}`}>
                {student.feeStatus}
              </span>
            </div>
          </div>

          {student.feeStatus !== "Paid" ? (
            <button
              onClick={handleSimulatePayment}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-500/10 text-xs cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              Pay Bill (${student.feeAmount})
            </button>
          ) : (
            <button
              onClick={() => navigate("/parent/fees")}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 text-xs cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              Statement Settled
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
