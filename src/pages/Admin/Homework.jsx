import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { Modal } from "../../components/Modal";
import { FormInput, FormSelect, FormTextarea } from "../../components/FormElements";
import { useToast } from "../../components/Toast";
import { dataAPI } from "../../data/mockData";
import { BookOpen, Plus, Eye, Calendar, UploadCloud, User } from "lucide-react";

export const Homework = () => {
  const [homeworkList, setHomeworkList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedHw, setSelectedHw] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filters
  const [filterSubject, setFilterSubject] = useState("");
  const [filterClass, setFilterClass] = useState("");

  // Form Fields
  const [formData, setFormData] = useState({
    subject: "Mathematics",
    title: "",
    description: "",
    dueDate: "",
    class: "",
    attachment: ""
  });

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    setHomeworkList(dataAPI.getHomework());
    const list = dataAPI.getClasses();
    setClasses(list);
    if (list.length > 0) {
      setFormData(prev => ({ ...prev, class: list[0] }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.class) {
      showToast("Please add or select a class first!", "error");
      return;
    }
    const newHw = dataAPI.addHomework({
      ...formData,
      teacher: "Mrs. Meenakshi Sen" // mock creator
    });
    setHomeworkList(dataAPI.getHomework());
    setIsAddOpen(false);
    showToast(`Successfully assigned homework: ${newHw.title}!`, "success");
    setFormData({
      subject: "Mathematics",
      title: "",
      description: "",
      dueDate: "",
      class: classes[0] || "",
      attachment: ""
    });
  };

  const handleViewDetail = (hw) => {
    setSelectedHw(hw);
    setIsDetailOpen(true);
  };

  const filteredHw = homeworkList.filter((hw) => {
    const matchSub = filterSubject ? hw.subject === filterSubject : true;
    const matchClass = filterClass ? hw.class === filterClass : true;
    return matchSub && matchClass;
  });

  const currentRole = localStorage.getItem("ep_role") || "admin";
  const roleLabel = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);

  return (
    <div className="space-y-6">
      {ToastComponent}
      <PageTitle
        title="Homework Assignments"
        breadcrumbs={[{ label: roleLabel }, { label: "Homework" }]}
        actions={[
          {
            label: "Create Assignment",
            icon: Plus,
            variant: "primary",
            onClick: () => setIsAddOpen(true)
          }
        ]}
      />

      {/* Filters header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm transition-colors duration-300">
        <FormSelect
          placeholder="Filter by Subject"
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          options={[
            { label: "Mathematics", value: "Mathematics" },
            { label: "Science", value: "Science" },
            { label: "English Literature", value: "English Literature" }
          ]}
        />
        <FormSelect
          placeholder="Filter by Class"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          options={classes.map(c => ({ label: c, value: c }))}
        />
      </div>

      {/* Homework Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
        {filteredHw.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 dark:text-slate-500 font-bold transition-colors duration-300">
            No homework assignments found for the selected criteria.
          </div>
        ) : (
          filteredHw.map((hw) => (
            <div key={hw.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between transition-colors duration-300">
              <div>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <span className="text-[10px] font-bold bg-indigo-50 border border-indigo-150 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {hw.subject}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{hw.class}</span>
                </div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-base leading-tight mb-2 truncate" title={hw.title}>
                  {hw.title}
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {hw.description}
                </p>
              </div>

              <div className="border-t border-slate-50 dark:border-slate-800 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  Due: {hw.dueDate}
                </div>
                <button
                  onClick={() => handleViewDetail(hw)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-150 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Homework Drawer */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Assign New Homework"
        type="drawer"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <FormInput
            label="Assignment Title"
            name="title"
            placeholder="E.g. Exercise 4.2: Quadratic Equations"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              options={[
                { label: "Mathematics", value: "Mathematics" },
                { label: "Science", value: "Science" },
                { label: "English Literature", value: "English Literature" }
              ]}
              required
            />
            <FormSelect
              label="Assigned Class"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              options={classes.map(c => ({ label: c, value: c }))}
              required
            />
          </div>

          <FormInput
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={handleInputChange}
            required
          />

          <FormTextarea
            label="Assignment Instructions"
            name="description"
            placeholder="Provide detail steps on completing this worksheet..."
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            required
          />

          {/* Touch friendly file upload placeholder UI */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Attachments</label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/10 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/20 flex flex-col items-center">
              <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />
              <p className="text-xs font-bold text-slate-750 dark:text-slate-200">Click to upload worksheet attachment</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wide">PDF, DOCX, ZIP up to 10MB</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/10 text-sm md:text-base pt-2"
          >
            Assign Homework Task
          </button>
        </form>
      </Modal>

      {/* Homework Detail Dialog */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Assignment Details View"
        size="md"
      >
        {selectedHw && (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold bg-indigo-50 border border-indigo-150 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedHw.subject}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight mt-2">{selectedHw.title}</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{selectedHw.class}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <User className="w-4 h-4 text-slate-400" />
                <span>Assigned By: <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedHw.teacher}</span></span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Deadline: <span className="text-rose-600 dark:text-rose-400 font-bold">{selectedHw.dueDate}</span></span>
              </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2">Instructions</p>
              <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                {selectedHw.description}
              </p>
            </div>

            {selectedHw.attachment && (
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between bg-white dark:bg-slate-900 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold">
                    📄
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[160px]">{selectedHw.attachment}</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">Attachment File</p>
                  </div>
                </div>
                <button
                  onClick={() => showToast(`Simulated download of ${selectedHw.attachment}`, "success")}
                  className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                >
                  Download File
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
