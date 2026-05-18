import React from "react";
import { AlertCircle, Archive, RotateCcw } from "lucide-react";

// SKELETON LOADER
export const LoadingSkeleton = ({ count = 3, type = "table" }) => {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-slate-100/80 rounded-2xl h-44 border border-slate-200/50 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-slate-200 rounded-md" />
              <div className="h-10 w-10 bg-slate-200 rounded-xl" />
            </div>
            <div>
              <div className="h-8 w-20 bg-slate-200 rounded-md mb-2" />
              <div className="h-3 w-36 bg-slate-200 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 bg-slate-100 rounded-xl border border-slate-200/40 w-full" />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border border-slate-100 rounded-xl">
          <div className="h-10 w-10 bg-slate-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
          <div className="h-6 bg-slate-200 rounded w-12" />
        </div>
      ))}
    </div>
  );
};

// EMPTY STATE
export const EmptyState = ({
  title = "No data found",
  description = "There are no records matches in this section at the moment.",
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-100 rounded-2xl shadow-sm">
      <div className="p-4 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-4 transform scale-110">
        <Archive className="w-10 h-10 stroke-[1.5]" />
      </div>
      <h4 className="text-lg font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

// ERROR STATE
export const ErrorState = ({
  title = "Something went wrong",
  description = "We encountered an error while processing your request. Please try refreshing.",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-rose-50/50 border border-rose-100 rounded-2xl">
      <div className="p-3.5 rounded-full bg-rose-100 text-rose-600 mb-4">
        <AlertCircle className="w-8 h-8 stroke-[2]" />
      </div>
      <h4 className="text-base font-bold text-rose-900 mb-1">{title}</h4>
      <p className="text-xs text-rose-600 max-w-xs mb-5 leading-relaxed">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  );
};
