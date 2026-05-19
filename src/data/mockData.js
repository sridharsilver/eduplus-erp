// High-Fidelity Mock Database for EduPulse ERP

// Initialize mock data in localStorage to persist simple additions/edits during session
const defaultStudents = [
  {
    id: "STU001",
    name: "Aarav Sharma",
    avatar: "https://images.unsplash.com/photo-1597003890212-47cd68fc3649?w=150",
    class: "Grade 10-A",
    rollNumber: "12",
    gender: "Male",
    dob: "2010-04-12",
    bloodGroup: "O+",
    email: "aarav.sharma@school.com",
    phone: "+91 98765 43210",
    parentName: "Rajesh Sharma",
    parentRelation: "Father",
    parentPhone: "+91 98765 43211",
    parentEmail: "rajesh.sharma@gmail.com",
    address: "12, Rose Villa, MG Road, Pune",
    attendanceRate: 94.5,
    feeStatus: "Paid",
    feeAmount: 2500,
    feeDue: "2026-06-01"
  },
  {
    id: "STU002",
    name: "Ananya Iyer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    class: "Grade 10-A",
    rollNumber: "15",
    gender: "Female",
    dob: "2010-09-24",
    bloodGroup: "A+",
    email: "ananya.iyer@school.com",
    phone: "+91 98765 43212",
    parentName: "Srinivasan Iyer",
    parentRelation: "Father",
    parentPhone: "+91 98765 43213",
    parentEmail: "srini.iyer@gmail.com",
    address: "45, Temple View St, Chennai",
    attendanceRate: 98.2,
    feeStatus: "Pending",
    feeAmount: 2500,
    feeDue: "2026-06-01"
  },
  {
    id: "STU003",
    name: "Kabir Mehta",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    class: "Grade 10-B",
    rollNumber: "08",
    gender: "Male",
    dob: "2010-11-05",
    bloodGroup: "B+",
    email: "kabir.mehta@school.com",
    phone: "+91 98765 43214",
    parentName: "Vikram Mehta",
    parentRelation: "Father",
    parentPhone: "+91 98765 43215",
    parentEmail: "vikram.mehta@gmail.com",
    address: "78, Marine Drive, Mumbai",
    attendanceRate: 88.0,
    feeStatus: "Overdue",
    feeAmount: 2500,
    feeDue: "2026-05-10"
  },
  {
    id: "STU004",
    name: "Diya Roy",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    class: "Grade 9-A",
    rollNumber: "04",
    gender: "Female",
    dob: "2011-02-18",
    bloodGroup: "AB+",
    email: "diya.roy@school.com",
    phone: "+91 98765 43216",
    parentName: "Pranab Roy",
    parentRelation: "Father",
    parentPhone: "+91 98765 43217",
    parentEmail: "pranab.roy@gmail.com",
    address: "9B, Ballygunge Circular Rd, Kolkata",
    attendanceRate: 91.3,
    feeStatus: "Paid",
    feeAmount: 2200,
    feeDue: "2026-06-01"
  },
  {
    id: "STU005",
    name: "Reyansh Patel",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    class: "Grade 9-A",
    rollNumber: "22",
    gender: "Male",
    dob: "2011-07-30",
    bloodGroup: "O-",
    email: "reyansh.patel@school.com",
    phone: "+91 98765 43218",
    parentName: "Dinesh Patel",
    parentRelation: "Father",
    parentPhone: "+91 98765 43219",
    parentEmail: "dinesh.patel@gmail.com",
    address: "102, GIDC Residency, Ahmedabad",
    attendanceRate: 95.8,
    feeStatus: "Paid",
    feeAmount: 2200,
    feeDue: "2026-06-01"
  }
];

const defaultTeachers = [
  {
    id: "TCH001",
    name: "Mrs. Meenakshi Sen",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    subject: "Mathematics",
    email: "meenakshi.sen@school.com",
    phone: "+91 91234 56780",
    classes: ["Grade 10-A", "Grade 10-B", "Grade 9-A"],
    joiningDate: "2018-06-01",
    qualification: "M.Sc. in Mathematics, B.Ed.",
    status: "Active"
  },
  {
    id: "TCH002",
    name: "Mr. David Miller",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    subject: "Science",
    email: "david.miller@school.com",
    phone: "+91 91234 56781",
    classes: ["Grade 10-A", "Grade 9-A"],
    joiningDate: "2020-08-15",
    qualification: "Ph.D. in Physics, M.Ed.",
    status: "Active"
  },
  {
    id: "TCH003",
    name: "Ms. Shalini Gupta",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    subject: "English Literature",
    email: "shalini.gupta@school.com",
    phone: "+91 91234 56782",
    classes: ["Grade 10-B", "Grade 9-A"],
    joiningDate: "2021-04-10",
    qualification: "M.A. in English, B.Ed.",
    status: "Active"
  }
];

const defaultHomework = [
  {
    id: "HW001",
    subject: "Mathematics",
    teacher: "Mrs. Meenakshi Sen",
    title: "Quadratic Equations Practice Sheet",
    description: "Solve Exercise 4.2 in the workbook and complete the online assessment questions 1-10.",
    dueDate: "2026-05-24",
    class: "Grade 10-A",
    attachment: "quadratic_eq_sheet.pdf",
    submissions: 22,
    status: "Active"
  },
  {
    id: "HW002",
    subject: "Science",
    teacher: "Mr. David Miller",
    title: "Refraction Lab Report",
    description: "Submit the lab observation details along with ray diagrams for glass slab refraction experiment.",
    dueDate: "2026-05-26",
    class: "Grade 10-A",
    attachment: "refraction_lab_template.docx",
    submissions: 18,
    status: "Active"
  },
  {
    id: "HW003",
    subject: "English Literature",
    teacher: "Ms. Shalini Gupta",
    title: "Character Sketch: Julius Caesar",
    description: "Write a detailed critical evaluation of Brutus' conflict between personal loyalty and civic responsibility.",
    dueDate: "2026-05-22",
    class: "Grade 10-B",
    attachment: "brutus_character_guidelines.pdf",
    submissions: 12,
    status: "Active"
  }
];

const defaultNotices = [
  {
    id: "NOT001",
    title: "Annual Sports Meet 2026 Schedule",
    content: "The Annual Sports Meet will be held between June 12 and June 15. Track registration forms must be submitted to physical education teachers by May 30.",
    date: "2026-05-18",
    category: "Event",
    priority: "High",
    postedBy: "Principal's Office"
  },
  {
    id: "NOT002",
    title: "Final Term Examinations Update",
    content: "Please find the official datesheet for the upcoming Final Term examinations. Regular classes will wrap up by May 28, followed by study leaves.",
    date: "2026-05-16",
    category: "Exam",
    priority: "High",
    postedBy: "Controller of Exams"
  },
  {
    id: "NOT003",
    title: "Eco-Club Plantation Drive",
    content: "To support environmental preservation, the Eco-Club is hosting a tree plantation drive around the campus on May 24. Volunteers register with Ms. Shalini.",
    date: "2026-05-14",
    category: "Co-curricular",
    priority: "Medium",
    postedBy: "Eco-Club Coordinator"
  }
];

const defaultAttendance = {
  // Key format: "CLASS_DATE" e.g., "Grade 10-A_2026-05-19"
  "Grade 10-A_2026-05-18": [
    { studentId: "STU001", status: "Present" },
    { studentId: "STU002", status: "Present" }
  ],
  "Grade 10-A_2026-05-19": [
    { studentId: "STU001", status: "Present" },
    { studentId: "STU002", status: "Absent" }
  ],
  "Grade 10-B_2026-05-19": [
    { studentId: "STU003", status: "Present" }
  ],
  "Grade 9-A_2026-05-19": [
    { studentId: "STU004", status: "Present" },
    { studentId: "STU005", status: "Present" }
  ]
};

const defaultTimetable = {
  "Grade 10-A": {
    Monday: [
      { period: "1", time: "08:30 - 09:15", subject: "Mathematics", teacher: "Mrs. Meenakshi Sen" },
      { period: "2", time: "09:15 - 10:00", subject: "Science", teacher: "Mr. David Miller" },
      { period: "3", time: "10:00 - 10:45", subject: "English Literature", teacher: "Ms. Shalini Gupta" },
      { period: "4", time: "11:00 - 11:45", subject: "History", teacher: "Mr. Sanjay Rawat" },
      { period: "5", time: "11:45 - 12:30", subject: "Computer Applications", teacher: "Mrs. Preeti Verma" }
    ],
    Tuesday: [
      { period: "1", time: "08:30 - 09:15", subject: "Science", teacher: "Mr. David Miller" },
      { period: "2", time: "09:15 - 10:00", subject: "Mathematics", teacher: "Mrs. Meenakshi Sen" },
      { period: "3", time: "10:00 - 10:45", subject: "Geography", teacher: "Mr. Sanjay Rawat" },
      { period: "4", time: "11:00 - 11:45", subject: "English Literature", teacher: "Ms. Shalini Gupta" },
      { period: "5", time: "11:45 - 12:30", subject: "Physical Education", teacher: "Mr. John Davis" }
    ],
    Wednesday: [
      { period: "1", time: "08:30 - 09:15", subject: "Mathematics", teacher: "Mrs. Meenakshi Sen" },
      { period: "2", time: "09:15 - 10:00", subject: "Science", teacher: "Mr. David Miller" },
      { period: "3", time: "10:00 - 10:45", subject: "English Literature", teacher: "Ms. Shalini Gupta" },
      { period: "4", time: "11:00 - 11:45", subject: "History", teacher: "Mr. Sanjay Rawat" },
      { period: "5", time: "11:45 - 12:30", subject: "Art & Craft", teacher: "Mrs. Anjali Roy" }
    ],
    Thursday: [
      { period: "1", time: "08:30 - 09:15", subject: "Science", teacher: "Mr. David Miller" },
      { period: "2", time: "09:15 - 10:00", subject: "Mathematics", teacher: "Mrs. Meenakshi Sen" },
      { period: "3", time: "10:00 - 10:45", subject: "Geography", teacher: "Mr. Sanjay Rawat" },
      { period: "4", time: "11:00 - 11:45", subject: "English Literature", teacher: "Ms. Shalini Gupta" },
      { period: "5", time: "11:45 - 12:30", subject: "Computer Applications", teacher: "Mrs. Preeti Verma" }
    ],
    Friday: [
      { period: "1", time: "08:30 - 09:15", subject: "Mathematics", teacher: "Mrs. Meenakshi Sen" },
      { period: "2", time: "09:15 - 10:00", subject: "Science", teacher: "Mr. David Miller" },
      { period: "3", time: "10:00 - 10:45", subject: "English Literature", teacher: "Ms. Shalini Gupta" },
      { period: "4", time: "11:00 - 11:45", subject: "Library Hour", teacher: "Ms. Shalini Gupta" },
      { period: "5", time: "11:45 - 12:30", subject: "Weekly Quiz/Debate", teacher: "Mr. Sanjay Rawat" }
    ]
  },
  "Grade 10-B": {
    Monday: [
      { period: "1", time: "08:30 - 09:15", subject: "English Literature", teacher: "Ms. Shalini Gupta" },
      { period: "2", time: "09:15 - 10:00", subject: "Mathematics", teacher: "Mrs. Meenakshi Sen" },
      { period: "3", time: "10:00 - 10:45", subject: "Science", teacher: "Mr. David Miller" },
      { period: "4", time: "11:00 - 11:45", subject: "Computer Applications", teacher: "Mrs. Preeti Verma" },
      { period: "5", time: "11:45 - 12:30", subject: "History", teacher: "Mr. Sanjay Rawat" }
    ]
  }
};

const defaultExams = [
  {
    id: "EX001",
    name: "First Term Examination",
    term: "Term 1",
    dates: "Oct 12 - Oct 20, 2025",
    status: "Completed"
  },
  {
    id: "EX002",
    name: "Mid Term Assessment",
    term: "Term 1",
    dates: "Dec 15 - Dec 22, 2025",
    status: "Completed"
  },
  {
    id: "EX003",
    name: "Final Examinations 2026",
    term: "Term 2",
    dates: "June 05 - June 15, 2026",
    status: "Upcoming"
  }
];

const defaultResults = {
  // Key format: "STUDENT_ID"
  "STU001": [
    { examId: "EX001", examName: "First Term Examination", subject: "Mathematics", marks: 92, maxMarks: 100, grade: "A+" },
    { examId: "EX001", examName: "First Term Examination", subject: "Science", marks: 88, maxMarks: 100, grade: "A" },
    { examId: "EX001", examName: "First Term Examination", subject: "English Literature", marks: 85, maxMarks: 100, grade: "A" },
    { examId: "EX001", examName: "First Term Examination", subject: "Social Science", marks: 91, maxMarks: 100, grade: "A+" },
    { examId: "EX001", examName: "First Term Examination", subject: "Computer Applications", marks: 98, maxMarks: 100, grade: "A+" }
  ],
  "STU002": [
    { examId: "EX001", examName: "First Term Examination", subject: "Mathematics", marks: 96, maxMarks: 100, grade: "A+" },
    { examId: "EX001", examName: "First Term Examination", subject: "Science", marks: 94, maxMarks: 100, grade: "A+" },
    { examId: "EX001", examName: "First Term Examination", subject: "English Literature", marks: 90, maxMarks: 100, grade: "A+" },
    { examId: "EX001", examName: "First Term Examination", subject: "Social Science", marks: 87, maxMarks: 100, grade: "A" },
    { examId: "EX001", examName: "First Term Examination", subject: "Computer Applications", marks: 95, maxMarks: 100, grade: "A+" }
  ],
  "STU003": [
    { examId: "EX001", examName: "First Term Examination", subject: "Mathematics", marks: 72, maxMarks: 100, grade: "B" },
    { examId: "EX001", examName: "First Term Examination", subject: "Science", marks: 68, maxMarks: 100, grade: "C+" },
    { examId: "EX001", examName: "First Term Examination", subject: "English Literature", marks: 74, maxMarks: 100, grade: "B" },
    { examId: "EX001", examName: "First Term Examination", subject: "Social Science", marks: 70, maxMarks: 100, grade: "B" },
    { examId: "EX001", examName: "First Term Examination", subject: "Computer Applications", marks: 82, maxMarks: 100, grade: "A" }
  ]
};

const defaultAccountants = [
  {
    id: "ACC001",
    name: "Amit Mehta",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    email: "accounts@school.com",
    phone: "+91 99999 88888",
    joiningDate: "2024-01-15",
    status: "Active"
  }
];

const defaultPaymentHistoryLogs = [
  { id: "TXN10401", name: "Aarav Sharma", class: "Grade 10-A", amount: 2500, date: "2026-05-12", method: "Online Card", accountant: "Amit Mehta", proof: "" },
  { id: "TXN10402", name: "Diya Roy", class: "Grade 9-A", amount: 2200, date: "2026-05-15", method: "Net Banking", accountant: "Amit Mehta", proof: "" },
  { id: "TXN10403", name: "Reyansh Patel", class: "Grade 9-A", amount: 2200, date: "2026-05-18", method: "UPI Transfer", accountant: "Amit Mehta", proof: "" }
];

// Local storage init utility
const defaultClasses = ["Grade 10-A", "Grade 10-B", "Grade 9-A"];

const initStorage = () => {
  if (!localStorage.getItem("ep_students")) {
    localStorage.setItem("ep_students", JSON.stringify(defaultStudents));
  }
  if (!localStorage.getItem("ep_teachers")) {
    localStorage.setItem("ep_teachers", JSON.stringify(defaultTeachers));
  }
  if (!localStorage.getItem("ep_homework")) {
    localStorage.setItem("ep_homework", JSON.stringify(defaultHomework));
  }
  if (!localStorage.getItem("ep_notices")) {
    localStorage.setItem("ep_notices", JSON.stringify(defaultNotices));
  }
  if (!localStorage.getItem("ep_attendance")) {
    localStorage.setItem("ep_attendance", JSON.stringify(defaultAttendance));
  }
  if (!localStorage.getItem("ep_results")) {
    localStorage.setItem("ep_results", JSON.stringify(defaultResults));
  }
  if (!localStorage.getItem("ep_classes")) {
    localStorage.setItem("ep_classes", JSON.stringify(defaultClasses));
  }
  if (!localStorage.getItem("ep_timetable")) {
    localStorage.setItem("ep_timetable", JSON.stringify(defaultTimetable));
  }
  if (!localStorage.getItem("ep_accountants")) {
    localStorage.setItem("ep_accountants", JSON.stringify(defaultAccountants));
  }
  if (!localStorage.getItem("ep_payment_logs")) {
    localStorage.setItem("ep_payment_logs", JSON.stringify(defaultPaymentHistoryLogs));
  }
};

initStorage();

export const dataAPI = {
  // CLASSES CRUD
  getClasses: () => JSON.parse(localStorage.getItem("ep_classes")) || defaultClasses,
  addClass: (className) => {
    const list = dataAPI.getClasses();
    if (!list.includes(className)) {
      list.push(className);
      localStorage.setItem("ep_classes", JSON.stringify(list));
      
      // Initialize empty timetable slots for new class
      const timetable = JSON.parse(localStorage.getItem("ep_timetable")) || defaultTimetable;
      timetable[className] = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] };
      localStorage.setItem("ep_timetable", JSON.stringify(timetable));
    }
    return className;
  },
  deleteClass: (className) => {
    let list = dataAPI.getClasses();
    list = list.filter(c => c !== className);
    localStorage.setItem("ep_classes", JSON.stringify(list));
  },

  // STUDENTS CRUD
  getStudents: () => JSON.parse(localStorage.getItem("ep_students")),
  getStudentById: (id) => dataAPI.getStudents().find(s => s.id === id),
  addStudent: (student) => {
    const list = dataAPI.getStudents();
    const newStudent = {
      ...student,
      id: student.id || `STU${String(list.length + 1).padStart(3, "0")}`,
      avatar: student.avatar || "https://images.unsplash.com/photo-1597003890212-47cd68fc3649?w=150",
      attendanceRate: Number(student.attendanceRate || 100),
      feeStatus: student.feeStatus || "Pending"
    };
    list.unshift(newStudent);
    localStorage.setItem("ep_students", JSON.stringify(list));
    return newStudent;
  },
  updateStudent: (id, updatedFields) => {
    const list = dataAPI.getStudents();
    const index = list.findIndex(s => s.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...updatedFields };
      localStorage.setItem("ep_students", JSON.stringify(list));
      return list[index];
    }
    return null;
  },
  deleteStudent: (id) => {
    let list = dataAPI.getStudents();
    list = list.filter(s => s.id !== id);
    localStorage.setItem("ep_students", JSON.stringify(list));
  },

  // TEACHERS CRUD
  getTeachers: () => JSON.parse(localStorage.getItem("ep_teachers")),
  getTeacherById: (id) => dataAPI.getTeachers().find(t => t.id === id),
  addTeacher: (teacher) => {
    const list = dataAPI.getTeachers();
    const newTeacher = {
      ...teacher,
      id: teacher.id || `TCH${String(list.length + 1).padStart(3, "0")}`,
      avatar: teacher.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      status: "Active"
    };
    list.unshift(newTeacher);
    localStorage.setItem("ep_teachers", JSON.stringify(list));
    return newTeacher;
  },
  updateTeacher: (id, updatedFields) => {
    const list = dataAPI.getTeachers();
    const index = list.findIndex(t => t.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...updatedFields };
      localStorage.setItem("ep_teachers", JSON.stringify(list));
      return list[index];
    }
    return null;
  },
  deleteTeacher: (id) => {
    let list = dataAPI.getTeachers();
    list = list.filter(t => t.id !== id);
    localStorage.setItem("ep_teachers", JSON.stringify(list));
  },

  // HOMEWORK CRUD
  getHomework: () => JSON.parse(localStorage.getItem("ep_homework")),
  getHomeworkById: (id) => dataAPI.getHomework().find(h => h.id === id),
  addHomework: (hw) => {
    const list = dataAPI.getHomework();
    const newHw = {
      ...hw,
      id: `HW${String(list.length + 1).padStart(3, "0")}`,
      submissions: 0,
      status: "Active"
    };
    list.unshift(newHw);
    localStorage.setItem("ep_homework", JSON.stringify(list));
    return newHw;
  },

  // NOTICES CRUD
  getNotices: () => JSON.parse(localStorage.getItem("ep_notices")),
  getNoticeById: (id) => dataAPI.getNotices().find(n => n.id === id),
  addNotice: (notice) => {
    const list = dataAPI.getNotices();
    const newNotice = {
      ...notice,
      id: `NOT${String(list.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0]
    };
    list.unshift(newNotice);
    localStorage.setItem("ep_notices", JSON.stringify(list));
    return newNotice;
  },

  // ATTENDANCE LOG
  getAttendance: () => JSON.parse(localStorage.getItem("ep_attendance")),
  getAttendanceForClassAndDate: (className, date) => {
    const records = dataAPI.getAttendance();
    const key = `${className}_${date}`;
    return records[key] || [];
  },
  saveAttendance: (className, date, studentRecords) => {
    // studentRecords: [{ studentId, status: "Present"/"Absent" }]
    const records = dataAPI.getAttendance();
    const key = `${className}_${date}`;
    records[key] = studentRecords;
    localStorage.setItem("ep_attendance", JSON.stringify(records));
  },

  // TIMETABLE
  getTimetableForClass: (className) => {
    const timetable = JSON.parse(localStorage.getItem("ep_timetable")) || defaultTimetable;
    return timetable[className] || {};
  },

  // EXAMS & RESULTS
  getExams: () => defaultExams,
  getResultsForStudent: (studentId) => {
    const results = JSON.parse(localStorage.getItem("ep_results")) || {};
    return results[studentId] || [];
  },
  saveResult: (studentId, resultObject) => {
    const results = JSON.parse(localStorage.getItem("ep_results")) || {};
    if (!results[studentId]) {
      results[studentId] = [];
    }
    // Update or add
    const index = results[studentId].findIndex(
      r => r.examId === resultObject.examId && r.subject === resultObject.subject
    );
    if (index > -1) {
      results[studentId][index] = { ...results[studentId][index], ...resultObject };
    } else {
      results[studentId].push(resultObject);
    }
    localStorage.setItem("ep_results", JSON.stringify(results));
  },

  // ACCOUNTANTS CRUD
  getAccountants: () => JSON.parse(localStorage.getItem("ep_accountants")) || defaultAccountants,
  getAccountantById: (id) => dataAPI.getAccountants().find(a => a.id === id),
  addAccountant: (accountant) => {
    const list = dataAPI.getAccountants();
    const newAccountant = {
      ...accountant,
      id: accountant.id || `ACC${String(list.length + 1).padStart(3, "0")}`,
      avatar: accountant.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      joiningDate: accountant.joiningDate || new Date().toISOString().split("T")[0],
      status: "Active"
    };
    list.unshift(newAccountant);
    localStorage.setItem("ep_accountants", JSON.stringify(list));
    return newAccountant;
  },
  updateAccountant: (id, updatedFields) => {
    const list = dataAPI.getAccountants();
    const index = list.findIndex(a => a.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...updatedFields };
      localStorage.setItem("ep_accountants", JSON.stringify(list));
      return list[index];
    }
    return null;
  },
  deleteAccountant: (id) => {
    let list = dataAPI.getAccountants();
    list = list.filter(a => a.id !== id);
    localStorage.setItem("ep_accountants", JSON.stringify(list));
  },

  // PAYMENT LOGS CRUD
  getPaymentLogs: () => JSON.parse(localStorage.getItem("ep_payment_logs")) || defaultPaymentHistoryLogs,
  addPaymentLog: (log) => {
    const list = dataAPI.getPaymentLogs();
    const nextNum = 10401 + list.length;
    const newLog = {
      id: `TXN${nextNum}`,
      ...log
    };
    list.unshift(newLog);
    localStorage.setItem("ep_payment_logs", JSON.stringify(list));
    return newLog;
  }
};
