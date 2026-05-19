import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export const DataTable = ({
  columns = [], // [{ key, label, sortable, render }]
  data = [],
  rowActions = [], // [{ label, icon, onClick, variant }]
  onRowSelect,
  searchPlaceholder = "Search records...",
  searchKey = "name",
  pageSize = 5,
  extraFilters = null
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Filter Data
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((row) => {
      const val = row[searchKey];
      if (val === undefined || val === null) return false;
      return String(val).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery, searchKey]);

  // Sort Data
  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === undefined || bVal === undefined) return 0;

        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;

  // Sorting Handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newSelections = new Set(paginatedData.map((row) => row.id));
      setSelectedRows(newSelections);
      if (onRowSelect) onRowSelect(Array.from(newSelections));
    } else {
      setSelectedRows(new Set());
      if (onRowSelect) onRowSelect([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    const newSelections = new Set(selectedRows);
    if (checked) {
      newSelections.add(id);
    } else {
      newSelections.delete(id);
    }
    setSelectedRows(newSelections);
    if (onRowSelect) onRowSelect(Array.from(newSelections));
  };

  const getSortIcon = (col) => {
    if (!col.sortable) return null;
    if (sortConfig.key !== col.key) return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-400 dark:text-slate-500" />;
    return sortConfig.direction === "asc" 
      ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-indigo-600 dark:text-indigo-400 font-bold" />
      : <ChevronDown className="w-3.5 h-3.5 ml-1 text-indigo-600 dark:text-indigo-400 font-bold" />;
  };

  return (
    <div className="w-full flex flex-col">
      {/* Top Search bar */}
      <div className="mb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm transition-colors duration-300">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-4 pr-10 text-xs font-semibold placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
        </div>
        {extraFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {extraFilters}
          </div>
        )}
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 whitespace-nowrap">
          Total: {filteredData.length} records
        </div>
      </div>

      {/* Responsive Table for Desktop & Tablet */}
      <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hidden md:block transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 table-fixed">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {/* Checkbox Header */}
                <th className="w-12 px-6 py-3.5 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                    className="rounded text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-900 border-slate-350 dark:border-slate-700 w-4 h-4 cursor-pointer"
                  />
                </th>
                
                {/* Columns */}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && requestSort(col.key)}
                    className={`px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none
                      ${col.sortable ? "cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-300 transition-all" : ""}`}
                  >
                    <div className="flex items-center">
                      {col.label}
                      {getSortIcon(col)}
                    </div>
                  </th>
                ))}

                {/* Actions header */}
                {rowActions.length > 0 && (
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-28">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (rowActions.length > 0 ? 2 : 1)} className="px-6 py-12 text-center text-sm font-semibold text-slate-400 dark:text-slate-500">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                    {/* Checkbox Selection */}
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                        className="rounded text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-900 border-slate-300 dark:border-slate-700 w-4 h-4 cursor-pointer"
                      />
                    </td>

                    {/* Data Cells */}
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm font-semibold text-slate-705 dark:text-slate-300 whitespace-nowrap overflow-hidden text-ellipsis">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}

                    {/* Row Actions */}
                    {rowActions.length > 0 && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold w-28">
                        <div className="flex items-center justify-end gap-1.5">
                          {rowActions.map((act, aIdx) => {
                            const ActionIcon = act.icon;
                            return (
                              <button
                                key={aIdx}
                                onClick={() => act.onClick(row)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer
                                  ${act.variant === "danger"
                                    ? "text-rose-500 border-rose-50 dark:border-rose-950/40 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                    : "text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                                title={act.label}
                              >
                                <ActionIcon className="w-4 h-4" />
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive Collapsed Cards for Mobile Layout */}
      <div className="space-y-4 md:hidden">
        {paginatedData.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center text-sm font-semibold text-slate-400 dark:text-slate-500">
            No matching records found.
          </div>
        ) : (
          paginatedData.map((row) => (
            <div key={row.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 relative transition-colors duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                    className="rounded text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-900 border-slate-300 dark:border-slate-700 w-4 h-4 cursor-pointer"
                  />
                  {/* Primary Render Column */}
                  <div>
                    {columns[0].render ? columns[0].render(row) : <p className="font-bold text-slate-800 dark:text-slate-200">{row[columns[0].key]}</p>}
                  </div>
                </div>

                {/* Mobile actions popup / simple header buttons */}
                {rowActions.length > 0 && (
                  <div className="flex items-center gap-1">
                    {rowActions.map((act, aIdx) => {
                      const ActionIcon = act.icon;
                      return (
                        <button
                          key={aIdx}
                          onClick={() => act.onClick(row)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer
                            ${act.variant === "danger"
                              ? "text-rose-500 border-rose-50 dark:border-rose-950/40 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                              : "text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                          title={act.label}
                        >
                          <ActionIcon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sub Columns Details */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-50 dark:border-slate-800 pt-2 bg-slate-50/50 dark:bg-slate-800/40 p-2 rounded-xl">
                {columns.slice(1).map((col) => (
                  <div key={col.key} className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{col.label}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-350">
                      {col.render ? col.render(row) : row[col.key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm transition-colors duration-300">
          <div className="hidden sm:block text-xs font-semibold text-slate-400 dark:text-slate-500">
            Showing <span className="text-slate-600 dark:text-slate-350 font-bold">{Math.min(currentPage * pageSize - pageSize + 1, sortedData.length)}</span> to{" "}
            <span className="text-slate-600 dark:text-slate-350 font-bold">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{" "}
            <span className="text-slate-600 dark:text-slate-350 font-bold">{sortedData.length}</span> entries
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-150 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer
                    ${currentPage === idx + 1 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10" 
                      : "text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800"}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-150 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
