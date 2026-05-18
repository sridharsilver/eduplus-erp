import React, { useState } from "react";

// DYNAMIC RESPONSIVE SVG BAR CHART
export const BarChart = ({ data = [], height = 200 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.value)) * 1.15 || 100;
  
  return (
    <div className="w-full flex flex-col">
      <div className="relative flex items-end justify-between w-full px-2" style={{ height: `${height}px` }}>
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="w-full border-t border-slate-100 dark:border-slate-800/60 h-0" />
          <div className="w-full border-t border-slate-100 dark:border-slate-800/60 h-0" />
          <div className="w-full border-t border-slate-100 dark:border-slate-800/60 h-0" />
          <div className="w-full border-t border-slate-200/60 dark:border-slate-800 h-0" />
        </div>

        {/* Bars */}
        {data.map((item, idx) => {
          const barHeightPercentage = (item.value / maxVal) * 100;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group relative z-10 mx-1.5 md:mx-3 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {hoveredIdx === idx && (
                <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md z-20 whitespace-nowrap animate-fade-in-up">
                  {item.prefix || ""}{item.value.toLocaleString()}{item.suffix || ""}
                </div>
              )}
              {/* Actual Bar with Rounded Tops and Gradients */}
              <div
                style={{ height: `${Math.max(barHeightPercentage, 5)}%` }}
                className={`w-full max-w-[28px] md:max-w-[40px] rounded-t-lg transition-all duration-300 relative overflow-hidden
                  ${hoveredIdx === idx ? "bg-indigo-650 dark:bg-indigo-500 shadow-lg shadow-indigo-500/20 scale-x-105" : "bg-indigo-500/80 dark:bg-indigo-600/70"}`}
              >
                {/* Visual Glass Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20" />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* X Axis Labels */}
      <div className="flex justify-between items-center mt-3 px-2 border-t border-slate-100 dark:border-slate-800 pt-2">
        {data.map((item, idx) => (
          <span key={idx} className="flex-1 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

// DYNAMIC RESPONSIVE SVG LINE CHART
export const LineChart = ({ data = [], height = 200 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.value)) * 1.05 || 100;
  const minVal = Math.min(...data.map(d => d.value)) * 0.95 || 0;
  const range = maxVal - minVal || 1;

  // Calculate SVG Coordinates
  const svgWidth = 500;
  const svgHeight = height;
  const paddingX = 30;
  const paddingY = 20;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const points = data.map((item, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((item.value - minVal) / range) * chartHeight;
    return { x, y, val: item.value, label: item.label };
  });

  // Construct SVG Path
  const linePath = points.reduce((path, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, "");

  // Construct Area Path for Elegant Gradient Fills
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : "";

  return (
    <div className="w-full flex flex-col">
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%" preserveAspectRatio="none" className="overflow-visible">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} className="stroke-slate-100 dark:stroke-slate-800/60" strokeWidth="1" />
          <line x1={paddingX} y1={paddingY + chartHeight / 2} x2={svgWidth - paddingX} y2={paddingY + chartHeight / 2} className="stroke-slate-100 dark:stroke-slate-800/60" strokeWidth="1" />
          <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1.5" />

          {/* Area Fill */}
          {areaPath && <path d={areaPath} fill="url(#lineGrad)" />}

          {/* Line Path */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              className="stroke-indigo-600 dark:stroke-indigo-400"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points / Interactivity */}
          {points.map((p, idx) => (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Highlight Circle on Hover */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === idx ? 8 : 4.5}
                className={`transition-all duration-150 ${hoveredIdx === idx ? "fill-indigo-650 dark:fill-indigo-400" : "fill-white dark:fill-slate-900"} stroke-indigo-600 dark:stroke-indigo-400`}
                strokeWidth={hoveredIdx === idx ? 3.5 : 2.5}
              />
            </g>
          ))}
        </svg>

        {/* Dynamic HTML Tooltip Overlay over SVG */}
        {hoveredIdx !== null && (
          <div
            style={{
              position: "absolute",
              left: `${(points[hoveredIdx].x / svgWidth) * 100}%`,
              top: `${(points[hoveredIdx].y / svgHeight) * 100 - 18}%`,
              transform: "translate(-50%, -100%)"
            }}
            className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md z-20 whitespace-nowrap animate-fade-in-up"
          >
            {points[hoveredIdx].val}%
          </div>
        )}
      </div>

      {/* Axis Labels */}
      <div className="flex justify-between items-center mt-3 px-3.5 border-t border-slate-100 dark:border-slate-800 pt-2">
        {data.map((item, idx) => (
          <span key={idx} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};
