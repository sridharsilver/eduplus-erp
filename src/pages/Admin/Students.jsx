import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { FormInput, FormSelect, FormTextarea } from "../../components/FormElements";
import { useToast } from "../../components/Toast";
import { dataAPI } from "../../data/mockData";
import { Users, Grid, List, Search, Plus, Eye, Edit2, Trash2, ShieldAlert } from "lucide-react";

export const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // "list" | "grid"
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isClassesOpen, setIsClassesOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Dynamic Class Addition States
  const [newClassVal, setNewClassVal] = useState("");
  
  // Filters
  const [filterClass, setFilterClass] = useState("");
  const [filterFeeStatus, setFilterFeeStatus] = useState("");

  // Form Field States
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    rollNumber: "",
    gender: "Male",
    dob: "",
    bloodGroup: "O+",
    email: "",
    phone: "",
    parentName: "",
    parentRelation: "Father",
    parentPhone: "",
    parentEmail: "",
    address: "",
    feeStatus: "Pending",
    feeAmount: 2500
  });

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    setStudents(dataAPI.getStudents());
    const classList = dataAPI.getClasses();
    setClasses(classList);
    
    // Set default class in form data if available
    if (classList.length > 0) {
      setFormData(prev => ({ ...prev, class: classList[0] }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.class) {
      showToast("Please select or add a class/grade first!", "error");
      return;
    }
    const newStudent = dataAPI.addStudent(formData);
    setStudents(dataAPI.getStudents());
    setIsAddOpen(false);
    showToast(`Registered student: ${newStudent.name} successfully!`, "success");
    resetForm();
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setFormData({ ...student });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dataAPI.updateStudent(selectedStudent.id, formData);
    setStudents(dataAPI.getStudents());
    setIsEditOpen(false);
    showToast(`Updated student profile: ${formData.name}`, "success");
    resetForm();
  };

  const handleDeleteClick = (student) => {
    if (window.confirm(`Are you sure you want to remove student ${student.name}?`)) {
      dataAPI.deleteStudent(student.id);
      setStudents(dataAPI.getStudents());
      showToast(`Removed student record for: ${student.name}`, "warning");
    }
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
  };

  // Add Dynamic Class
  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClassVal.trim()) {
      showToast("Class name cannot be empty!", "error");
      return;
    }
    const formatted = newClassVal.trim();
    dataAPI.addClass(formatted);
    const list = dataAPI.getClasses();
    setClasses(list);
    showToast(`Successfully added new class: ${formatted}!`, "success");
    setNewClassVal("");
  };

  // Delete Class
  const handleDeleteClass = (cls) => {
    if (window.confirm(`Are you sure you want to delete ${cls}? Any students assigned to it will remain but won't match filter selections.`)) {
      dataAPI.deleteClass(cls);
      setClasses(dataAPI.getClasses());
      showToast(`Removed class: ${cls}`, "warning");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      class: classes[0] || "",
      rollNumber: "",
      gender: "Male",
      dob: "",
      bloodGroup: "O+",
      email: "",
      phone: "",
      parentName: "",
      parentRelation: "Father",
      parentPhone: "",
      parentEmail: "",
      address: "",
      feeStatus: "Pending",
      feeAmount: 2500
    });
  };

  // Filter Logic
  const filteredStudents = students.filter((stu) => {
    const matchClass = filterClass ? stu.class === filterClass : true;
    const matchFee = filterFeeStatus ? stu.feeStatus === filterFeeStatus : true;
    return matchClass && matchFee;
  });

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
    { key: "class", label: "Class", sortable: true },
    { key: "rollNumber", label: "Roll #", sortable: true },
    {
      key: "attendanceRate",
      label: "Attendance",
      sortable: true,
      render: (row) => (
        <span className={`font-bold ${row.attendanceRate > 90 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
          {row.attendanceRate}%
        </span>
      )
    },
    {
      key: "feeStatus",
      label: "Fee Status",
      sortable: true,
      render: (row) => {
        const colors = {
          Paid: "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-400",
          Pending: "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-400",
          Overdue: "bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/60 dark:text-rose-450"
        };
        return (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[row.feeStatus]}`}>
            {row.feeStatus}
          </span>
        );
      }
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
        title="Student Registry"
        breadcrumbs={[{ label: "Admin" }, { label: "Students" }]}
        actions={[
          {
            label: "Manage Classes",
            icon: Users,
            variant: "secondary",
            onClick: () => { setIsClassesOpen(true); }
          },
          {
            label: "Add Student",
            icon: Plus,
            variant: "primary",
            onClick: () => { resetForm(); setIsAddOpen(true); }
          }
        ]}
      />

      {/* Grid vs List toggle and Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm transition-colors duration-300">
        <div className="flex flex-wrap items-center gap-3">
          <FormSelect
            placeholder="All Classes"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            options={classes.map(c => ({ label: c, value: c }))}
          />
          <FormSelect
            placeholder="All Fees Status"
            value={filterFeeStatus}
            onChange={(e) => setFilterFeeStatus(e.target.value)}
            options={[
              { label: "Paid", value: "Paid" },
              { label: "Pending", value: "Pending" },
              { label: "Overdue", value: "Overdue" }
            ]}
          />
        </div>
        <div className="flex items-center border border-slate-100 dark:border-slate-800 rounded-xl p-1 bg-slate-50 dark:bg-slate-800 self-end md:self-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg cursor-pointer transition-all ${viewMode === "list" ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-400 dark:text-slate-500"}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg cursor-pointer transition-all ${viewMode === "grid" ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-400 dark:text-slate-500"}`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content display based on viewMode */}
      {viewMode === "list" ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-colors duration-300">
          <DataTable
            columns={columns}
            data={filteredStudents}
            rowActions={tableActions}
            searchPlaceholder="Search by name..."
            searchKey="name"
            pageSize={5}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 dark:text-slate-500 font-bold transition-colors duration-300">
              No student records matched the active filters.
            </div>
          ) : (
            filteredStudents.map((stu) => (
              <div key={stu.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between transition-colors duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={stu.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border border-slate-50 dark:border-slate-800 shadow-inner" />
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-200 leading-tight">{stu.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide uppercase mt-0.5">{stu.id} • Roll #{stu.rollNumber}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider
                    ${stu.feeStatus === "Paid" ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-400" : stu.feeStatus === "Pending" ? "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-400" : "bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/60 dark:text-rose-400"}`}>
                    {stu.feeStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-50 dark:border-slate-800 py-3 my-4 bg-slate-50/50 dark:bg-slate-800/40 p-2.5 rounded-xl font-semibold text-slate-500 dark:text-slate-400">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Class</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{stu.class}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Attendance Rate</span>
                    <span className={`font-bold ${stu.attendanceRate > 90 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>{stu.attendanceRate}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleViewProfile(stu)}
                    className="px-3 py-1.5 border border-slate-150 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEditClick(stu)}
                    className="p-1.5 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(stu)}
                    className="p-1.5 border border-rose-50 dark:border-rose-900/30 rounded-lg text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Dynamic Classes Drawer Manager */}
      <Modal
        isOpen={isClassesOpen}
        onClose={() => setIsClassesOpen(false)}
        title="Manage Grades & Sections"
        type="drawer"
      >
        <div className="space-y-6">
          <form onSubmit={handleAddClass} className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Add New Class</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Grade 11-A"
                value={newClassVal}
                onChange={(e) => setNewClassVal(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all h-11"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 rounded-xl transition-all shadow-md shadow-indigo-500/10 text-xs cursor-pointer h-11 flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Current Classes</h4>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {classes.map((cls) => (
                <div key={cls} className="flex items-center justify-between p-3 border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{cls}</span>
                  <button
                    onClick={() => handleDeleteClass(cls)}
                    className="p-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Register Student Drawer */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register New Student"
        type="drawer"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Student Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
              <FormInput label="Roll Number" name="rollNumber" placeholder="25" value={formData.rollNumber} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Assigned Class"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                options={classes.map(c => ({ label: c, value: c }))}
                required
              />
              <FormSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" }
                ]}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleInputChange} required />
              <FormSelect
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                options={[
                  { label: "O+", value: "O+" },
                  { label: "A+", value: "A+" },
                  { label: "B+", value: "B+" },
                  { label: "AB+", value: "AB+" },
                  { label: "O-", value: "O-" }
                ]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Student Email" name="email" type="email" placeholder="john.doe@school.com" value={formData.email} onChange={handleInputChange} />
              <FormInput label="Student Phone" name="phone" placeholder="+91 99999 88888" value={formData.phone} onChange={handleInputChange} />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Parent Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Guardian Name" name="parentName" placeholder="Alex Doe" value={formData.parentName} onChange={handleInputChange} required />
              <FormSelect
                label="Relation"
                name="parentRelation"
                value={formData.parentRelation}
                onChange={handleInputChange}
                options={[
                  { label: "Father", value: "Father" },
                  { label: "Mother", value: "Mother" },
                  { label: "Guardian", value: "Guardian" }
                ]}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Guardian Phone" name="parentPhone" placeholder="+91 99999 77777" value={formData.parentPhone} onChange={handleInputChange} required />
              <FormInput label="Guardian Email" name="parentEmail" type="email" placeholder="alex.doe@gmail.com" value={formData.parentEmail} onChange={handleInputChange} />
            </div>
            <FormTextarea label="Residential Address" name="address" placeholder="123, Green Meadows..." value={formData.address} onChange={handleInputChange} rows={2} />
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Fee Configuration</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Initial Fee Status"
                name="feeStatus"
                value={formData.feeStatus}
                onChange={handleInputChange}
                options={[
                  { label: "Paid", value: "Paid" },
                  { label: "Pending", value: "Pending" }
                ]}
              />
              <FormInput label="Term Fee Amount ($)" name="feeAmount" type="number" value={formData.feeAmount} onChange={handleInputChange} required />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/10 text-sm md:text-base pt-2"
          >
            Register Student Record
          </button>
        </form>
      </Modal>

      {/* Edit Student Drawer */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Student Profile Details"
        type="drawer"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Student Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
              <FormInput label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Class"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                options={classes.map(c => ({ label: c, value: c }))}
              />
              <FormSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" }
                ]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
              <FormSelect
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                options={[
                  { label: "O+", value: "O+" },
                  { label: "A+", value: "A+" },
                  { label: "B+", value: "B+" },
                  { label: "AB+", value: "AB+" }
                ]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Student Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              <FormInput label="Student Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Parent Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Guardian Name" name="parentName" value={formData.parentName} onChange={handleInputChange} required />
              <FormSelect
                label="Relation"
                name="parentRelation"
                value={formData.parentRelation}
                onChange={handleInputChange}
                options={[
                  { label: "Father", value: "Father" },
                  { label: "Mother", value: "Mother" },
                  { label: "Guardian", value: "Guardian" }
                ]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Guardian Phone" name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} required />
              <FormInput label="Guardian Email" name="parentEmail" type="email" value={formData.parentEmail} onChange={handleInputChange} />
            </div>
            <FormTextarea label="Address" name="address" value={formData.address} onChange={handleInputChange} rows={2} />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/10 text-sm md:text-base pt-2"
          >
            Save Profile Modifications
          </button>
        </form>
      </Modal>

      {/* View Student Profile Dialog */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Student High-Fidelity Profile"
        size="lg"
      >
        {selectedStudent && (
          <div className="space-y-6">
            {/* Header section with photo placeholder */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <img src={selectedStudent.avatar} alt="" className="w-24 h-24 rounded-3xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm" />
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{selectedStudent.name}</h3>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider">{selectedStudent.id} • Roll #{selectedStudent.rollNumber}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                  <span className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400">
                    {selectedStudent.class}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-150 dark:border-emerald-900/40 px-2 py-0.5 rounded-full text-emerald-600 dark:text-emerald-400">
                    Attendance: {selectedStudent.attendanceRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Profile specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student specifications */}
              <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">Student Details</h4>
                <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-500">Gender:</span><span className="text-slate-800 dark:text-slate-200">{selectedStudent.gender || "N/A"}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-500">Date of Birth:</span><span className="text-slate-800 dark:text-slate-200">{selectedStudent.dob || "N/A"}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-500">Blood Group:</span><span className="text-slate-800 dark:text-slate-200">{selectedStudent.bloodGroup || "N/A"}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-500">Email:</span><span className="text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{selectedStudent.email || "N/A"}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-500">Phone:</span><span className="text-slate-800 dark:text-slate-200">{selectedStudent.phone || "N/A"}</span></div>
                </div>
              </div>

              {/* Parent Details section */}
              <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">Parent / Guardian Information</h4>
                <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-500">Guardian Name:</span><span className="text-slate-800 dark:text-slate-200">{selectedStudent.parentName || "N/A"}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-500">Relation:</span><span className="text-slate-800 dark:text-slate-200">{selectedStudent.parentRelation || "N/A"}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-500">Phone:</span><span className="text-slate-800 dark:text-slate-200">{selectedStudent.parentPhone || "N/A"}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-500">Email:</span><span className="text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{selectedStudent.parentEmail || "N/A"}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0 flex-col"><span className="text-slate-400 dark:text-slate-500 mb-0.5">Address:</span><span className="text-slate-800 dark:text-slate-200 leading-normal text-left">{selectedStudent.address || "N/A"}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
