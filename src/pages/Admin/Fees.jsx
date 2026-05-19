import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageTitle } from "../../components/PageTitle";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { useToast } from "../../components/Toast";
import { FormInput, FormSelect } from "../../components/FormElements";
import { dataAPI } from "../../data/mockData";
import { CreditCard, Eye, Printer, Award, ArrowUpRight } from "lucide-react";

export const Fees = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  // Payment Form States
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Online Card");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const [paymentHistoryLogs, setPaymentHistoryLogs] = useState([
    { id: "TXN10401", name: "Aarav Sharma", class: "Grade 10-A", amount: 2500, date: "2026-05-12", method: "Online Card" },
    { id: "TXN10402", name: "Diya Roy", class: "Grade 9-A", amount: 2200, date: "2026-05-15", method: "Net Banking" },
    { id: "TXN10403", name: "Reyansh Patel", class: "Grade 9-A", amount: 2200, date: "2026-05-18", method: "UPI Transfer" }
  ]);

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    setStudents(dataAPI.getStudents());
  }, []);

  const handleOpenReceipt = (student) => {
    setSelectedStudent(student);
    setIsReceiptOpen(true);
  };

  const handleOpenPayment = (student) => {
    if (student.feeStatus === "Paid") {
      showToast("Fee is already completely paid!", "info");
      return;
    }
    setSelectedStudent(student);
    setPaymentAmount(student.feeAmount);
    setPaymentMethod("Online Card");
    setPaymentRef("");
    setPaymentDate(new Date().toISOString().split("T")[0]);
    setPaymentError("");
    setIsPaymentOpen(true);
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const amount = Number(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setPaymentError("Please enter a valid positive payment amount.");
      return;
    }

    if (amount > selectedStudent.feeAmount) {
      setPaymentError(`Payment amount cannot exceed the outstanding balance of $${selectedStudent.feeAmount}.`);
      return;
    }

    setPaymentError("");

    const remainingDue = selectedStudent.feeAmount - amount;
    const newStatus = remainingDue === 0 ? "Paid" : (selectedStudent.feeStatus === "Overdue" ? "Overdue" : "Pending");

    // Update database
    dataAPI.updateStudent(selectedStudent.id, {
      feeAmount: remainingDue,
      feeStatus: newStatus,
      attendanceRate: selectedStudent.attendanceRate
    });

    // Update local state list
    setStudents(dataAPI.getStudents());

    // Generate new Transaction
    const nextTxnNum = 401 + paymentHistoryLogs.length;
    const txnId = `TXN10${nextTxnNum}`;
    const newTxn = {
      id: txnId,
      name: selectedStudent.name,
      class: selectedStudent.class,
      amount: amount,
      date: paymentDate,
      method: paymentMethod + (paymentRef ? ` (${paymentRef})` : "")
    };

    setPaymentHistoryLogs([newTxn, ...paymentHistoryLogs]);
    setIsPaymentOpen(false);
    showToast(`Successfully recorded payment of $${amount} for ${selectedStudent.name}!`, "success");
  };

  // Stats summaries
  const totalOutstanding = students.reduce((acc, stu) => stu.feeStatus !== "Paid" ? acc + stu.feeAmount : acc, 0);
  const totalCollected = students.reduce((acc, stu) => stu.feeStatus === "Paid" ? acc + stu.feeAmount : acc, 0);
  const collectedPercentage = Math.round((totalCollected / (totalCollected + totalOutstanding)) * 100) || 0;

  // Table Columns
  const columns = [
    { key: "name", label: "Student Name", sortable: true, render: (row) => <span className="font-bold text-slate-800 dark:text-slate-200">{row.name}</span> },
    { key: "id", label: "ID", sortable: true },
    { key: "class", label: "Class", sortable: true },
    { key: "feeAmount", label: "Due Amount", sortable: true, render: (row) => <span>${row.feeAmount}</span> },
    {
      key: "feeStatus",
      label: "Status",
      sortable: true,
      render: (row) => {
        const styles = {
          Paid: "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-400",
          Pending: "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-400",
          Overdue: "bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/60 dark:text-rose-450"
        };
        return <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${styles[row.feeStatus]}`}>{row.feeStatus}</span>;
      }
    }
  ];

  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const routePrefix = pathSegments[0] || "admin";
  const capitalizedPrefix = routePrefix.charAt(0).toUpperCase() + routePrefix.slice(1);

  const activeRole = localStorage.getItem("ep_role") || "admin";
  const actions = [
    { label: "View Receipt", icon: Eye, onClick: handleOpenReceipt },
    ...(activeRole === "accounts" 
      ? [{ label: "Record Payment", icon: CreditCard, onClick: handleOpenPayment }] 
      : [])
  ];

  return (
    <div className="space-y-6">
      {ToastComponent}
      <PageTitle
        title="Fees Management Ledger"
        breadcrumbs={[{ label: capitalizedPrefix }, { label: "Fees" }]}
      />

      {/* Aggregate metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm transition-colors duration-300">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Fees Collected</p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-slate-200 mt-2">${totalCollected}</h3>
          <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full mt-2 inline-block">
            {collectedPercentage}% overall collection
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm transition-colors duration-300">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Outstanding Fees</p>
          <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">${totalOutstanding}</h3>
          <span className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-full mt-2 inline-block">
            Needs follow-up emails
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm transition-colors duration-300">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Term Collected Status</p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-slate-200 mt-2">${totalCollected + totalOutstanding}</h3>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full mt-2 inline-block">
            Target projection
          </span>
        </div>
      </div>

      {/* Fees List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main interactive Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm lg:col-span-2 transition-colors duration-300">
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">Student Statements</h4>
          <DataTable
            columns={columns}
            data={students}
            rowActions={actions}
            searchPlaceholder="Search student fees..."
            searchKey="name"
            pageSize={5}
          />
        </div>

        {/* Transaction History log */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-300">
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">Recent Transactions</h4>
            <div className="space-y-4">
              {paymentHistoryLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3 last:border-0">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{log.name}</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">{log.date} • {log.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+${log.amount}</p>
                    <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{log.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-center space-y-2 mt-6">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Aggregate Efficiency</p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div style={{ width: `${collectedPercentage}%` }} className="bg-indigo-600 h-full rounded-full transition-all duration-500" />
            </div>
            <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400">{collectedPercentage}% Invoices Closed</p>
          </div>
        </div>
      </div>

      {/* Payment Receipt Modal */}
      <Modal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="Official School Payment Invoice"
        size="md"
      >
        {selectedStudent && (
          <div className="space-y-6">
            {/* Header branding */}
            <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-2 shadow-md">
                🎓
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">EduPulse Central Academy</h3>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">MG Road, Pune • Board Affiliation #10412</p>
            </div>

            {/* Invoiced to details */}
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase">Invoiced To:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm block mt-0.5">{selectedStudent.name}</span>
                <span className="text-slate-400 dark:text-slate-500 block mt-0.5">{selectedStudent.class} • Roll #{selectedStudent.rollNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase">Receipt Logs:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold block mt-0.5">REC-{selectedStudent.id}</span>
                <span className="text-slate-400 dark:text-slate-500 block mt-0.5">Date: {new Date().toISOString().split("T")[0]}</span>
              </div>
            </div>

            {/* Line items Table */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 grid grid-cols-3 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800">
                <span>Fee Description</span>
                <span className="text-center">Status</span>
                <span className="text-right">Total Amount</span>
              </div>
              <div className="p-3 grid grid-cols-3 font-semibold text-slate-700 dark:text-slate-300 items-center">
                <span>First Term Tuition Charges</span>
                <span className="text-center">
                  <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full
                    ${selectedStudent.feeStatus === "Paid" ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-400" : "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-400"}`}>
                    {selectedStudent.feeStatus}
                  </span>
                </span>
                <span className="text-right font-bold text-slate-900 dark:text-slate-100">${selectedStudent.feeAmount}</span>
              </div>
            </div>

            {/* Footer calculations */}
            <div className="flex justify-between items-center bg-slate-50/60 dark:bg-slate-800/20 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Aggregate Net Paid:</span>
              <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                ${selectedStudent.feeStatus === "Paid" ? selectedStudent.feeAmount : 0}
              </span>
            </div>

            {/* Print/Dismiss actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { window.print(); }}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-950 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Dismiss Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title="Record Student Fee Payment"
        size="md"
      >
        {selectedStudent && (
          <form onSubmit={handleRecordPayment} className="space-y-5">
            {/* Student details panel */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                🎓
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedStudent.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{selectedStudent.class} • Roll #{selectedStudent.rollNumber}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Outstanding</p>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">${selectedStudent.feeAmount}</p>
              </div>
            </div>

            {/* Inputs grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Amount to Pay ($)"
                name="paymentAmount"
                type="number"
                min="0.01"
                step="0.01"
                max={selectedStudent.feeAmount}
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => {
                  setPaymentAmount(e.target.value);
                  setPaymentError("");
                }}
                required
              />

              <FormSelect
                label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                options={[
                  { label: "Online Card", value: "Online Card" },
                  { label: "Net Banking", value: "Net Banking" },
                  { label: "UPI Transfer", value: "UPI Transfer" },
                  { label: "Cash", value: "Cash" }
                ]}
                placeholder=""
                required
              />

              <FormInput
                label="Reference / Receipt #"
                name="paymentRef"
                type="text"
                placeholder="e.g. TXN-98402, CHQ-1049"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
              />

              <FormInput
                label="Payment Date"
                name="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </div>

            {/* Dynamic calculation preview */}
            {paymentAmount && !isNaN(Number(paymentAmount)) && Number(paymentAmount) > 0 && (
              <div className="p-3.5 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/40 dark:border-indigo-900/30 rounded-2xl space-y-1.5 text-xs font-semibold transition-all">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Invoiced Balance:</span>
                  <span className="font-bold">${selectedStudent.feeAmount}</span>
                </div>
                <div className="flex justify-between text-indigo-700 dark:text-indigo-400">
                  <span>Paying:</span>
                  <span className="font-bold">-${Number(paymentAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-800 dark:text-slate-200 border-t border-indigo-100/50 dark:border-indigo-900/30 pt-1.5 font-bold">
                  <span>Outstanding After Payment:</span>
                  <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                    ${(selectedStudent.feeAmount - Number(paymentAmount)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {paymentError && (
              <p className="text-xs font-semibold text-rose-500 text-center animate-shake">{paymentError}</p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPaymentOpen(false)}
                className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-indigo-500/10 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Record Payment
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
