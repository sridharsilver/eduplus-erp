import React, { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle";
import { FormSelect, FormInput } from "../../components/FormElements";
import { useToast } from "../../components/Toast";
import { dataAPI } from "../../data/mockData";
import { FileSpreadsheet, Plus, Save, Award, ClipboardCheck, ArrowRight } from "lucide-react";
import { Modal } from "../../components/Modal";

export const Exams = () => {
  const [activeTab, setActiveTab] = useState("list"); // "list" | "marks" | "report"
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  
  // Marks Entry States
  const [selectedExam, setSelectedExam] = useState("EX001");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [marksData, setMarksData] = useState({}); // { studentId: score }

  // Report Card States
  const [selectedStudentId, setSelectedStudentId] = useState("STU001");
  const [studentReport, setStudentReport] = useState([]);

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    setExams(dataAPI.getExams());
    const list = dataAPI.getStudents();
    setStudents(list);
    if (list.length > 0) setSelectedStudentId(list[0].id);

    const classList = dataAPI.getClasses();
    setClasses(classList);
    if (classList.length > 0) setSelectedClass(classList[0]);
  }, []);

  // Update marks entry list on selections
  useEffect(() => {
    if (!selectedClass) return;
    const classStudents = students.filter(s => s.class === selectedClass);
    const initialMarks = {};
    classStudents.forEach(stu => {
      const results = dataAPI.getResultsForStudent(stu.id);
      const match = results.find(r => r.examId === selectedExam && r.subject === selectedSubject);
      initialMarks[stu.id] = match ? match.marks : "";
    });
    setMarksData(initialMarks);
  }, [selectedExam, selectedClass, selectedSubject, students]);

  // Load report card data
  useEffect(() => {
    if (!selectedStudentId) return;
    const results = dataAPI.getResultsForStudent(selectedStudentId);
    setStudentReport(results);
  }, [selectedStudentId]);

  const handleMarkChange = (studentId, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleSaveMarks = () => {
    if (!selectedClass) return;
    const activeStudents = students.filter(s => s.class === selectedClass);
    activeStudents.forEach(stu => {
      const score = marksData[stu.id];
      if (score !== undefined && score !== "") {
        dataAPI.saveResult(stu.id, {
          examId: selectedExam,
          examName: exams.find(e => e.id === selectedExam)?.name || "Final Exam",
          subject: selectedSubject,
          marks: Number(score),
          maxMarks: 100,
          grade: getGradeFromScore(Number(score))
        });
      }
    });

    showToast(`Successfully entered scores for ${selectedSubject} (${selectedClass})!`, "success");
  };

  const getGradeFromScore = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 40) return "D";
    return "F (Fail)";
  };

  const activeStudentInfo = students.find(s => s.id === selectedStudentId);

  const currentRole = localStorage.getItem("ep_role") || "admin";
  const roleLabel = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);

  return (
    <div className="space-y-6">
      {ToastComponent}
      <PageTitle
        title="Examinations & Grading"
        breadcrumbs={[{ label: roleLabel }, { label: "Examinations" }]}
      />

      {/* Tabs navigation */}
      <div className="flex border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 rounded-2xl shadow-sm max-w-md transition-colors duration-300">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center
            ${activeTab === "list" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
        >
          Active Exams
        </button>
        <button
          onClick={() => setActiveTab("marks")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center
            ${activeTab === "marks" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
        >
          Marks Entry
        </button>
        <button
          onClick={() => setActiveTab("report")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center
            ${activeTab === "report" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
        >
          Report Cards
        </button>
      </div>

      {/* Tab 1: Exams List */}
      {activeTab === "list" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4 animate-fade-in-up transition-colors duration-300">
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">Assigned Assessments Calendar</h4>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">2026 Academic Term</span>
          </div>

          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left text-xs font-semibold text-slate-600">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Exam ID</th>
                  <th className="px-6 py-4">Assessment Name</th>
                  <th className="px-6 py-4">Academic Term</th>
                  <th className="px-6 py-4">Exam Date Range</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {exams.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">{ex.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{ex.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{ex.term}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{ex.dates}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full
                        ${ex.status === "Completed" ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-400" : "bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-400"}`}>
                        {ex.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Marks entry */}
      {activeTab === "marks" && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Form Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm items-end transition-colors duration-300">
            <FormSelect
              label="Select Exam"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              options={exams.map(e => ({ label: e.name, value: e.id }))}
              placeholder=""
            />
            <FormSelect
              label="Target Class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              options={classes.map(c => ({ label: c, value: c }))}
              placeholder=""
            />
            <FormSelect
              label="Core Subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              options={[
                { label: "Mathematics", value: "Mathematics" },
                { label: "Science", value: "Science" },
                { label: "English Literature", value: "English Literature" }
              ]}
              placeholder=""
            />
            <button
              onClick={handleSaveMarks}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-500/10 text-sm cursor-pointer h-12"
            >
              <Save className="w-4 h-4" />
              Save Marks Ledger
            </button>
          </div>

          {/* Student list marking card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4 transition-colors duration-300">
            <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ClipboardCheck className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-500" />
              Grading Sheets ({students.filter(s => s.class === selectedClass).length} Students)
            </h4>

            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              {students.filter(s => s.class === selectedClass).length === 0 ? (
                <div className="py-12 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                  No students matched the active target class filter selection.
                </div>
              ) : (
                <>
                  {/* MOBILE VIEW: Grid list of cards */}
                  <div className="grid grid-cols-1 gap-3 p-3 sm:hidden">
                    {students.filter(s => s.class === selectedClass).map((stu) => (
                      <div
                        key={stu.id}
                        className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-slate-800/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img src={stu.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                          <div className="text-left">
                            <p className="font-extrabold text-slate-800 dark:text-slate-200 text-sm leading-tight">{stu.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">Roll #{stu.rollNumber} • {stu.id}</p>
                          </div>
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Score"
                            value={marksData[stu.id] || ""}
                            onChange={(e) => handleMarkChange(stu.id, e.target.value)}
                            className="w-full text-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 dark:text-slate-200 h-10"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP VIEW: Sleek Table */}
                  <div className="hidden sm:block">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left text-xs font-semibold text-slate-700">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Roll Number</th>
                          <th className="px-6 py-4 w-48 text-center">Score (Max 100)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                        {students.filter(s => s.class === selectedClass).map((stu) => (
                          <tr key={stu.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={stu.avatar} alt="" className="w-9 h-9 rounded-xl object-cover border border-slate-100 dark:border-slate-800" />
                                <div>
                                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{stu.name}</p>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{stu.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">#{stu.rollNumber}</td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="E.g. 85"
                                value={marksData[stu.id] || ""}
                                onChange={(e) => handleMarkChange(stu.id, e.target.value)}
                                className="w-full text-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all rounded-xl py-2 px-3 text-xs font-bold text-slate-800 dark:text-slate-200 h-10"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Report cards */}
      {activeTab === "report" && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm transition-colors duration-300">
            <FormSelect
              label="Select Student Registry"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              options={students.map(s => ({ label: `${s.name} (${s.class})`, value: s.id }))}
              placeholder=""
            />
          </div>

          {activeStudentInfo && (
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6 max-w-2xl mx-auto transition-colors duration-300">
              {/* Header profile template */}
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start border-b border-slate-100 dark:border-slate-800 pb-5 gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <img src={activeStudentInfo.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover border dark:border-slate-800" />
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">{activeStudentInfo.name}</h3>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wide">ID: {activeStudentInfo.id} • Roll #{activeStudentInfo.rollNumber}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">{activeStudentInfo.class}</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <h4 className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">EduPulse Central Academy</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Official Report Transcript</p>
                </div>
              </div>

              {/* Ledger list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 pb-2">Academic Marks Breakdown</h4>
                
                {studentReport.length === 0 ? (
                  <div className="py-12 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                    No academic records / term scores submitted for this student.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {studentReport.map((res, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 border border-slate-50 dark:border-slate-800 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200 text-xs leading-none">{res.subject}</p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">{res.examName}</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold">
                          <span className="text-slate-550 dark:text-slate-400">{res.marks} / {res.maxMarks}</span>
                          <span className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-150 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full text-[10px]">
                            Grade {res.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
