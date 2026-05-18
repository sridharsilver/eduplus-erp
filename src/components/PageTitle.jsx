import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export const PageTitle = ({ title, breadcrumbs = [], actions = [] }) => {
  const currentRole = localStorage.getItem("ep_role") || "admin";
  const homePath = `/${currentRole}/dashboard`;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8 animate-fade-in-up">
      {/* Left Column */}
      <div>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-4">
            <Link to={homePath} className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center transition-colors">
              <Home className="w-3.5 h-3.5" />
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 font-bold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
          {title}
        </h1>
      </div>

      {/* Action buttons */}
      {actions.length > 0 && (
        <div className="flex items-center gap-3">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={act.onClick}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer shadow-sm hover:shadow-md
                  ${act.variant === "primary" 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {act.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
