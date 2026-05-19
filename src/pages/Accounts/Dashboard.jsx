import React from "react";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/PageTitle";
import { StatCard } from "../../components/StatCard";
import { BarChart } from "../../components/Charts";
import { dataAPI } from "../../data/mockData";
import { CreditCard, Activity, ArrowRight, TrendingUp } from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();
  const students = dataAPI.getStudents() || [];

  // Calculate dynamic metrics
  const totalOutstanding = students.reduce((acc, stu) => stu.feeStatus !== "Paid" ? acc + stu.feeAmount : acc, 0);
  
  // Calculate collected amount based on default original fee amounts
  const totalCollected = students.reduce((acc, stu) => {
    if (stu.feeStatus === "Paid") {
      // If fully paid, the collected amount is their base fee amount
      const baseFee = stu.id === "STU001" ? 2500 : stu.id === "STU004" ? 2200 : stu.id === "STU005" ? 2200 : 2500;
      return acc + baseFee;
    } else {
      // If pending/overdue, base fee - outstanding balance
      const baseFee = stu.id === "STU002" ? 2500 : stu.id === "STU003" ? 2500 : 2500;
      const paidSoFar = Math.max(0, baseFee - stu.feeAmount);
      return acc + paidSoFar;
    }
  }, 0);

  const totalInvoiced = totalCollected + totalOutstanding;
  const collectedPercentage = Math.round((totalCollected / totalInvoiced) * 100) || 0;
  const overdueCount = students.filter(s => s.feeStatus === "Overdue").length;

  // Chart data
  const feeChartData = [
    { label: "Jan", value: 4500, prefix: "$" },
    { label: "Feb", value: 6200, prefix: "$" },
    { label: "Mar", value: 8900, prefix: "$" },
    { label: "Apr", value: 11000, prefix: "$" },
    { label: "May", value: totalCollected, prefix: "$" }
  ];

  // Simulated activity logs matching fee payments
  const recentFeeActivities = [
    { id: 1, text: "Recorded payment of $2,500 for Aarav Sharma", time: "10 mins ago" },
    { id: 2, text: "Payment of $2,200 received from Diya Roy", time: "2 hours ago" },
    { id: 3, text: "Recorded cash payment of $1,200 for Kabir Mehta", time: "1 day ago" }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Title */}
      <PageTitle
        title="Finance & Fees Dashboard"
        breadcrumbs={[{ label: "Accounts" }, { label: "Dashboard" }]}
      />

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Fees Collected"
          value={`$${totalCollected.toLocaleString()}`}
          icon="CreditCard"
          trend="+12.4%"
          trendType="positive"
          description="May term statements"
          gradient="emerald"
        />
        <StatCard
          title="Outstanding Balance"
          value={`$${totalOutstanding.toLocaleString()}`}
          icon="CreditCard"
          trend="Needs attention"
          trendType="neutral"
          description="Pending student invoices"
          gradient="rose"
        />
        <StatCard
          title="Collection Rate"
          value={`${collectedPercentage}%`}
          icon="TrendingUp"
          trend={`+${Math.round(collectedPercentage - 80)}%`}
          trendType="positive"
          description="Progress towards target"
          gradient="indigo"
        />
        <StatCard
          title="Overdue Accounts"
          value={overdueCount}
          icon="Users"
          trend={`${overdueCount > 0 ? "High priority" : "Clear"}`}
          trendType={overdueCount > 0 ? "negative" : "positive"}
          description="Require payment emails"
          gradient="amber"
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Fee Collection Progression Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm lg:col-span-2 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">Fee Collection Trend</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Monthly collection totals for current term</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-xl">
              USD ($)
            </span>
          </div>
          <BarChart data={feeChartData} height={220} />
        </div>

        {/* Quick Action & Activity Panel */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Quick Action Navigation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm transition-colors duration-300">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">Financial Actions</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-5">Access accounts ledger and logs</p>
            <button
              onClick={() => navigate("/accounts/fees")}
              className="w-full flex items-center justify-between p-4 bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/40 rounded-2xl transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">Fees Ledger</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Record payments & view receipts</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex-1 transition-colors duration-300">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-50 dark:border-slate-800 pb-3">Finance Activity Logs</h4>
            <div className="space-y-4">
              {recentFeeActivities.map((act) => (
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
    </div>
  );
};
