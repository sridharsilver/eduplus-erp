import React from "react";

export const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  icon: Icon,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-0.5">
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`block w-full rounded-xl border py-3 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm md:text-base
            ${Icon ? "pl-10" : "pl-4"} pr-4
            ${error ? "border-rose-400 bg-rose-50/20 dark:bg-rose-950/10 focus:border-rose-500" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900"}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-rose-500">{error}</p>}
    </div>
  );
};

export const FormSelect = ({
  label,
  name,
  options = [],
  value,
  onChange,
  error,
  required = false,
  placeholder = "Select an option",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-0.5">
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`block w-full rounded-xl border py-3 px-4 text-slate-800 dark:text-slate-100 dark:bg-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm md:text-base appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat
            ${error ? "border-rose-400 bg-rose-50/20 dark:bg-rose-950/10 focus:border-rose-500" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 text-slate-800 dark:text-slate-100"}`}
          {...props}
        >
          {placeholder && <option value="" className="dark:bg-slate-900">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="dark:bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-rose-500">{error}</p>}
    </div>
  );
};

export const FormTextarea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  rows = 3,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-0.5">
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        <textarea
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className={`block w-full rounded-xl border py-3 px-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm md:text-base
            ${error ? "border-rose-400 bg-rose-50/20 dark:bg-rose-950/10 focus:border-rose-500" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500"}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-rose-500">{error}</p>}
    </div>
  );
};
