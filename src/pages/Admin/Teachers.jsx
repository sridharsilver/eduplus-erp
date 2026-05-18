import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { FormInput, FormSelect } from "../../components/FormElements";
import { useToast } from "../../components/Toast";
import { dataAPI } from "../../data/mockData";
import { GraduationCap, Plus, Eye, Edit2, Trash2, CheckCircle2 } from "lucide-react";

export const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Form Field States
  const [formData, setFormData] = useState({
    name: "",
    subject: "Mathematics",
    email: "",
    phone: "",
    joiningDate: "",
    qualification: "",
    classes: [] // e.g. ["Grade 10-A"]
  });

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    setTeachers(dataAPI.getTeachers());
    setClasses(dataAPI.getClasses());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassCheckboxChange = (classVal, checked) => {
    setFormData((prev) => {
      const currentClasses = [...prev.classes];
      if (checked) {
        currentClasses.push(classVal);
      } else {
        const index = currentClasses.indexOf(classVal);
        if (index > -1) currentClasses.splice(index, 1);
      }
      return { ...prev, classes: currentClasses };
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newTeacher = dataAPI.addTeacher(formData);
    setTeachers(dataAPI.getTeachers());
    setIsAddOpen(false);
    showToast(`Registered teacher: ${newTeacher.name} successfully!`, "success");
    resetForm();
  };

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({ ...teacher });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dataAPI.updateTeacher(selectedTeacher.id, formData);
    setTeachers(dataAPI.getTeachers());
    setIsEditOpen(false);
    showToast(`Updated teacher details for: ${formData.name}`, "success");
    resetForm();
  };

  const handleDeleteClick = (teacher) => {
    if (window.confirm(`Are you sure you want to remove teacher ${teacher.name}?`)) {
      dataAPI.deleteTeacher(teacher.id);
      setTeachers(dataAPI.getTeachers());
      showToast(`Removed teacher record for: ${teacher.name}`, "warning");
    }
  };

  const handleViewProfile = (teacher) => {
    setSelectedTeacher(teacher);
    setIsProfileOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "Mathematics",
      email: "",
      phone: "",
      joiningDate: "",
      qualification: "",
      classes: []
    });
  };

  // Table Columns config
  const columns = [
    {
      key: "name",
      label: "Name & ID",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt="" className="w-9 h-9 rounded-xl object-cover border border-slate-100 dark:border-slate-800" />
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{row.name}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{row.id}</p>
          </div>
        </div>
      )
    },
    { key: "subject", label: "Core Subject", sortable: true },
    { key: "qualification", label: "Qualification", sortable: false },
    {
      key: "classes",
      label: "Assigned Classes",
      sortable: false,
      render: (row) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.classes.map((cls, idx) => (
            <span key={idx} className="text-[9px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400 px-1.5 py-0.5 rounded-full">
              {cls}
            </span>
          ))}
        </div>
      )
    }
  ];

  const tableActions = [
    { label: "View Profile", icon: Eye, onClick: handleViewProfile },
    { label: "Edit Details", icon: Edit2, onClick: handleEditClick },
    { label: "Delete", icon: Trash2, onClick: handleDeleteClick, variant: "danger" }
  ];

  return (
    <div className="space-y-6">
      {ToastComponent}
      <PageTitle
        title="Teacher Faculty Registry"
        breadcrumbs={[{ label: "Admin" }, { label: "Teachers" }]}
        actions={[
          {
            label: "Add Teacher",
            icon: Plus,
            variant: "primary",
            onClick: () => { resetForm(); setIsAddOpen(true); }
          }
        ]}
      />

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <DataTable
          columns={columns}
          data={teachers}
          rowActions={tableActions}
          searchPlaceholder="Search faculty members..."
          searchKey="name"
          pageSize={5}
        />
      </div>

      {/* Add Teacher Drawer */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register New Faculty"
        type="drawer"
      >
        <form onSubmit={handleAddSubmit} className="space-y-5">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Faculty Information</h4>
            <FormInput label="Full Name" name="name" placeholder="E.g. Mr. Robert Greene" value={formData.name} onChange={handleInputChange} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Core Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                options={[
                  { label: "Mathematics", value: "Mathematics" },
                  { label: "Science", value: "Science" },
                  { label: "English Literature", value: "English Literature" },
                  { label: "History", value: "History" },
                  { label: "Computer Applications", value: "Computer Applications" }
                ]}
                required
              />
              <FormInput label="Academic Qualification" name="qualification" placeholder="E.g. Ph.D. in Math, M.Ed." value={formData.qualification} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Faculty Email" name="email" type="email" placeholder="robert@school.com" value={formData.email} onChange={handleInputChange} required />
              <FormInput label="Contact Phone" name="phone" placeholder="+91 99999 55555" value={formData.phone} onChange={handleInputChange} required />
            </div>
            <FormInput label="Date of Joining" type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} required />
          </div>

          <div className="space-y-3 pt-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-305">Assign Classes</label>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none mb-2">Check the classes this teacher will lead</p>
            <div className="grid grid-cols-3 gap-3">
              {classes.map((cVal) => {
                const isChecked = formData.classes.includes(cVal);
                return (
                  <div
                    key={cVal}
                    onClick={() => handleClassCheckboxChange(cVal, !isChecked)}
                    className={`py-3 px-2 border rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all text-xs font-semibold
                      ${isChecked
                        ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-400"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                  >
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />}
                    {cVal}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/10 text-sm md:text-base pt-2"
          >
            Register Faculty Record
          </button>
        </form>
      </Modal>

      {/* Edit Teacher Drawer */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Faculty Record"
        type="drawer"
      >
        <form onSubmit={handleEditSubmit} className="space-y-5">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Faculty Information</h4>
            <FormInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Core Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                options={[
                  { label: "Mathematics", value: "Mathematics" },
                  { label: "Science", value: "Science" },
                  { label: "English Literature", value: "English Literature" },
                  { label: "History", value: "History" },
                  { label: "Computer Applications", value: "Computer Applications" }
                ]}
              />
              <FormInput label="Academic Qualification" name="qualification" value={formData.qualification} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Faculty Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              <FormInput label="Contact Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
          </div>

          <div className="space-y-3 pt-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-305">Modify Assigned Classes</label>
            <div className="grid grid-cols-3 gap-3">
              {classes.map((cVal) => {
                const isChecked = formData.classes.includes(cVal);
                return (
                  <div
                    key={cVal}
                    onClick={() => handleClassCheckboxChange(cVal, !isChecked)}
                    className={`py-3 px-2 border rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all text-xs font-semibold
                      ${isChecked
                        ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-400"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                  >
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />}
                    {cVal}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/10 text-sm md:text-base pt-2"
          >
            Save Faculty Modifications
          </button>
        </form>
      </Modal>

      {/* View Teacher Details Dialog */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Faculty High-Fidelity Profile"
        size="md"
      >
        {selectedTeacher && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 dark:border-slate-800">
              <img src={selectedTeacher.avatar} alt="" className="w-24 h-24 rounded-3xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm mb-3" />
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{selectedTeacher.name}</h3>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider">{selectedTeacher.id} • Department Lead</p>
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                <span className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 px-2.5 py-1 rounded-full text-slate-500 dark:text-slate-400">
                  Joined: {selectedTeacher.joiningDate || "N/A"}
                </span>
                <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-150 dark:border-emerald-900/40 px-2.5 py-1 rounded-full text-emerald-600 dark:text-emerald-400">
                  Status: Active
                </span>
              </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">Faculty Portfolio</h4>
              <div className="space-y-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-550">Core Subject:</span><span className="text-slate-800 dark:text-slate-200 font-bold">{selectedTeacher.subject}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0 flex-col gap-0.5"><span className="text-slate-400 dark:text-slate-550">Credentials:</span><span className="text-slate-800 dark:text-slate-200">{selectedTeacher.qualification}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-550">Work Email:</span><span className="text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{selectedTeacher.email}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-550">Phone:</span><span className="text-slate-800 dark:text-slate-200">{selectedTeacher.phone}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0 flex-col gap-1.5">
                  <span className="text-slate-400 dark:text-slate-500">Assigned Classes:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedTeacher.classes.map((c, i) => (
                      <span key={i} className="text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
