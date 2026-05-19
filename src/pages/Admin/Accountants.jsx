import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { FormInput, FormSelect } from "../../components/FormElements";
import { useToast } from "../../components/Toast";
import { dataAPI } from "../../data/mockData";
import { CreditCard, Plus, Eye, Edit2, Trash2 } from "lucide-react";

export const Accountants = () => {
  const [accountants, setAccountants] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedAccountant, setSelectedAccountant] = useState(null);

  // Form Field States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    joiningDate: "",
    avatar: ""
  });

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    setAccountants(dataAPI.getAccountants());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newAcc = dataAPI.addAccountant(formData);
    setAccountants(dataAPI.getAccountants());
    setIsAddOpen(false);
    showToast(`Registered accountant: ${newAcc.name} successfully!`, "success");
    resetForm();
  };

  const handleEditClick = (acc) => {
    setSelectedAccountant(acc);
    setFormData({ ...acc });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dataAPI.updateAccountant(selectedAccountant.id, formData);
    setAccountants(dataAPI.getAccountants());
    setIsEditOpen(false);
    showToast(`Updated accountant details for: ${formData.name}`, "success");
    resetForm();
  };

  const handleDeleteClick = (acc) => {
    if (window.confirm(`Are you sure you want to remove accountant ${acc.name}?`)) {
      dataAPI.deleteAccountant(acc.id);
      setAccountants(dataAPI.getAccountants());
      showToast(`Removed accountant record for: ${acc.name}`, "warning");
    }
  };

  const handleViewProfile = (acc) => {
    setSelectedAccountant(acc);
    setIsProfileOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      joiningDate: "",
      avatar: ""
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Image size must be less than 2MB!", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatar: "" }));
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
    { key: "email", label: "Email Address", sortable: true },
    { key: "phone", label: "Contact Phone", sortable: false },
    { key: "joiningDate", label: "Joining Date", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span className="text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-400 px-2 py-0.5 rounded-full">
          {row.status}
        </span>
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
        title="Accounts Staff Registry"
        breadcrumbs={[{ label: "Admin" }, { label: "Accountants" }]}
        actions={[
          {
            label: "Add Accountant",
            icon: Plus,
            variant: "primary",
            onClick: () => { resetForm(); setIsAddOpen(true); }
          }
        ]}
      />

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <DataTable
          columns={columns}
          data={accountants}
          rowActions={tableActions}
          searchPlaceholder="Search accounts staff..."
          searchKey="name"
          pageSize={5}
        />
      </div>

      {/* Add Accountant Drawer */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register New Accountant"
        type="drawer"
      >
        <form onSubmit={handleAddSubmit} className="space-y-5">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Accountant Information</h4>
            
            {/* Profile Photo Upload */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
              <div className="relative flex-shrink-0">
                <img
                  src={formData.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Profile Photo</p>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all shadow-sm">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-450 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">PNG, JPG or GIF. Max 2MB</p>
              </div>
            </div>

            <FormInput label="Full Name" name="name" placeholder="E.g. Amit Mehta" value={formData.name} onChange={handleInputChange} required />
            <FormInput label="Email Address" name="email" type="email" placeholder="accounts@school.com" value={formData.email} onChange={handleInputChange} required />
            <FormInput label="Contact Phone" name="phone" placeholder="+91 99999 88888" value={formData.phone} onChange={handleInputChange} required />
            <FormInput label="Date of Joining" type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} required />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/10 text-sm md:text-base pt-2"
          >
            Register Accountant Record
          </button>
        </form>
      </Modal>

      {/* Edit Accountant Drawer */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Accountant Record"
        type="drawer"
      >
        <form onSubmit={handleEditSubmit} className="space-y-5">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Accountant Information</h4>
            
            {/* Profile Photo Upload */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
              <div className="relative flex-shrink-0">
                <img
                  src={formData.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Profile Photo</p>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all shadow-sm">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-450 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">PNG, JPG or GIF. Max 2MB</p>
              </div>
            </div>

            <FormInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            <FormInput label="Contact Phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
            <FormInput label="Date of Joining" type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} required />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/10 text-sm md:text-base pt-2"
          >
            Save Accountant Modifications
          </button>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Accountant Staff Profile"
        size="md"
      >
        {selectedAccountant && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 dark:border-slate-800">
              <img src={selectedAccountant.avatar} alt="" className="w-24 h-24 rounded-3xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm mb-3" />
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{selectedAccountant.name}</h3>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider">{selectedAccountant.id} • Accounts Department</p>
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                <span className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 px-2.5 py-1 rounded-full text-slate-500 dark:text-slate-400">
                  Joined: {selectedAccountant.joiningDate || "N/A"}
                </span>
                <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-150 dark:border-emerald-900/40 px-2.5 py-1 rounded-full text-emerald-600 dark:text-emerald-400">
                  Status: Active
                </span>
              </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">Portfolio Details</h4>
              <div className="space-y-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-550">Work Email:</span><span className="text-slate-800 dark:text-slate-200 font-bold">{selectedAccountant.email}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0"><span className="text-slate-400 dark:text-slate-550">Contact Phone:</span><span className="text-slate-800 dark:text-slate-200">{selectedAccountant.phone}</span></div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
