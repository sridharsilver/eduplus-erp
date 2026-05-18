import React from "react";
import * as Icons from "lucide-react";

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendType = "neutral", // "positive" | "negative" | "neutral"
  description,
  gradient = "indigo" // "indigo" | "emerald" | "amber" | "rose" | "slate"
}) => {
  const IconComponent = Icons[icon] || Icons.HelpCircle;

  const gradients = {
    indigo: "from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40",
    emerald: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40",
    amber: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-450 border-amber-100 dark:border-amber-900/40",
    rose: "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/40",
    slate: "from-slate-500/10 to-zinc-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
  };

  const trendColors = {
    positive: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50",
    negative: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50",
    neutral: "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800"
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">{title}</span>
        <div className={`p-3 rounded-xl bg-gradient-to-br border ${gradients[gradient]}`}>
          <IconComponent className="w-5 h-5 stroke-[2.25]" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-2">
          {value}
        </h3>
        <div className="flex items-center gap-2">
          {trend && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-0.5 ${trendColors[trendType]}`}>
              {trendType === "positive" && "↑"}
              {trendType === "negative" && "↓"}
              {trend}
            </span>
          )}
          {description && (
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{description}</span>
          )}
        </div>
      </div>
    </div>
  );
};
