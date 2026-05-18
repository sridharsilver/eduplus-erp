import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { Modal } from "../../components/Modal";
import { FormInput, FormSelect, FormTextarea } from "../../components/FormElements";
import { useToast } from "../../components/Toast";
import { dataAPI } from "../../data/mockData";
import { Megaphone, Plus, Eye, Calendar, User, Tag } from "lucide-react";

export const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    priority: "Medium"
  });

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    setNotices(dataAPI.getNotices());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newNotice = dataAPI.addNotice({
      ...formData,
      postedBy: "Principal's Office"
    });
    setNotices(dataAPI.getNotices());
    setIsAddOpen(false);
    showToast(`Notice posted: ${newNotice.title}`, "success");
    setFormData({
      title: "",
      content: "",
      category: "General",
      priority: "Medium"
    });
  };

  const handleViewDetail = (notice) => {
    setSelectedNotice(notice);
    setIsDetailOpen(true);
  };

  const getPriorityStyles = (prio) => {
    switch (prio) {
      case "High": return "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400";
      case "Medium": return "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/60 text-amber-700 dark:text-amber-400";
      default: return "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-400";
    }
  };

  return (
    <div className="space-y-6">
      {ToastComponent}
      <PageTitle
        title="Notice Board & Announcements"
        breadcrumbs={[{ label: "Admin" }, { label: "Notices" }]}
        actions={[
          {
            label: "Post Announcement",
            icon: Plus,
            variant: "primary",
            onClick: () => setIsAddOpen(true)
          }
        ]}
      />

      {/* Grid List of Notices */}
      <div className="space-y-4 stagger-load">
        {notices.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 dark:text-slate-500 font-bold transition-colors duration-300">
            No notices are currently posted.
          </div>
        ) : (
          notices.map((n) => (
            <div
              key={n.id}
              onClick={() => handleViewDetail(n)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full uppercase tracking-wider ${getPriorityStyles(n.priority)}`}>
                    {n.priority} Priority
                  </span>
                  <span className="text-[9px] font-bold bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {n.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 ml-auto md:ml-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {n.date}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-base leading-snug">
                  {n.title}
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2 leading-relaxed">
                  {n.content}
                </p>
              </div>

              <div className="flex items-center justify-end border-t border-slate-50 dark:border-slate-800 md:border-0 pt-3 md:pt-0">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-0.5">
                  Read Full Notice
                  <Eye className="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Announcement Drawer */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Post New Announcement"
        type="drawer"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <FormInput
            label="Notice Title"
            name="title"
            placeholder="E.g. Mid-Term Examination Datesheet"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Announcement Type"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={[
                { label: "General Notice", value: "General" },
                { label: "Academic Event", value: "Event" },
                { label: "Examination Updates", value: "Exam" },
                { label: "Co-curricular Activities", value: "Co-curricular" }
              ]}
              required
            />
            <FormSelect
              label="Urgency Priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              options={[
                { label: "High Priority", value: "High" },
                { label: "Medium Priority", value: "Medium" },
                { label: "Low Priority", value: "Low" }
              ]}
              required
            />
          </div>

          <FormTextarea
            label="Detailed Announcement Content"
            name="content"
            placeholder="Provide all relevant dates, steps, guidelines, or details..."
            value={formData.content}
            onChange={handleInputChange}
            rows={5}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/10 text-sm md:text-base pt-2"
          >
            Publish Announcement notice
          </button>
        </form>
      </Modal>

      {/* Notice Detail Dialog */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="School Announcement details"
        size="md"
      >
        {selectedNotice && (
          <div className="space-y-5 text-left animate-fade-in-up">
            <div className="space-y-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full uppercase tracking-wider ${getPriorityStyles(selectedNotice.priority)}`}>
                  {selectedNotice.priority} Urgency
                </span>
                <span className="text-[9px] font-bold bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedNotice.category}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-snug">{selectedNotice.title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Posted By: <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedNotice.postedBy}</span></span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Published Date: <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedNotice.date}</span></span>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold whitespace-pre-line">
                {selectedNotice.content}
              </p>
            </div>

            <button
              onClick={() => setIsDetailOpen(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm"
            >
              Acknowledge Announcement
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
