import fs from 'fs';
import path from 'path';
import { 
  Student, 
  Teacher, 
  LiveClass, 
  RecordedClass, 
  AttendanceRecord, 
  Program, 
  NotificationItem, 
  Certificate, 
  ProgressReport,
  MadrasaSettings
} from './types';

interface DatabaseData {
  students: Student[];
  teachers: Teacher[];
  liveClasses: LiveClass[];
  recordedClasses: RecordedClass[];
  attendance: AttendanceRecord[];
  programs: Program[];
  notifications: NotificationItem[];
  certificates: Certificate[];
  progressReports: ProgressReport[];
  settings: MadrasaSettings;
}

const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'tarbiyah_db.json');

const INITIAL_DATA: DatabaseData = {
  students: [],
  teachers: [],
  liveClasses: [],
  recordedClasses: [],
  attendance: [],
  programs: [],
  notifications: [],
  certificates: [],
  progressReports: [],
  settings: {
    madrasaName: 'നൂറുൽ ഹുദാ ഇസ്ലാമിക് മദ്റസ',
    principalName: '',
    address: 'കേരളം',
    phone: '7559950633',
    email: '',
    description: '',
    admissionYear: new Date().getFullYear().toString(),
    whatsappNumber: '7559950633',
    websiteUrl: ''
  }
};

// Ensure directory and load or initialize data
function loadDatabase(): DatabaseData {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Falling back to in-memory initial data:", err);
    return INITIAL_DATA;
  }
}

function saveDatabase(data: DatabaseData): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to save database file:", err);
  }
}

export const db = {
  // Students
  getStudents: (): Student[] => {
    return loadDatabase().students;
  },
  getStudentById: (id: string): Student | undefined => {
    return loadDatabase().students.find(s => s.id === id);
  },
  getStudentByMobile: (mobile: string): Student | undefined => {
    return loadDatabase().students.find(s => s.mobileNumber.trim() === mobile.trim());
  },
  createStudent: (studentData: Omit<Student, 'id' | 'createdAt' | 'registrationStatus' | 'currentSurah' | 'currentAyah' | 'hifzJuzCompleted' | 'currentLevel' | 'attendanceRate'>): { success: boolean; student?: Student; error?: string } => {
    const data = loadDatabase();
    // Unique mobile number check rule
    const existing = data.students.find(s => s.mobileNumber.trim() === studentData.mobileNumber.trim());
    if (existing) {
      return { success: false, error: "One mobile number can register only once. This number is already in use." };
    }

    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now().toString().slice(-6)}`,
      registrationStatus: 'pending', // Default is Pending
      enrollmentDate: new Date().toISOString(),
      currentLevel: 'Beginner',
      currentSurah: 1,
      currentAyah: 1,
      hifzJuzCompleted: 0,
      attendanceRate: 0,
      createdAt: new Date().toISOString()
    };

    data.students.push(newStudent);
    saveDatabase(data);
    return { success: true, student: newStudent };
  },
  updateStudentStatus: (id: string, status: 'approved' | 'rejected'): boolean => {
    const data = loadDatabase();
    const student = data.students.find(s => s.id === id);
    if (!student) return false;
    student.registrationStatus = status;

    // Add notification
    data.notifications.unshift({
      id: `notif-${Date.now().toString().slice(-6)}`,
      title: status === 'approved' ? "Registration Approved! 🎉" : "Registration Update",
      message: status === 'approved' 
        ? `Salam ${student.fullName}, your registration for Tarbiyah Islamic Education has been approved. You may now login and attend classes.`
        : `Salam ${student.fullName}, your registration application could not be approved at this time. Please contact administration.`,
      type: "system",
      targetRole: "student",
      studentId: student.id,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    saveDatabase(data);
    return true;
  },
  updateStudent: (id: string, updates: Partial<Student>): Student | null => {
    const data = loadDatabase();
    const index = data.students.findIndex(s => s.id === id);
    if (index === -1) return null;
    data.students[index] = { ...data.students[index], ...updates };
    saveDatabase(data);
    return data.students[index];
  },
  deleteStudent: (id: string): boolean => {
    const data = loadDatabase();
    const prevLen = data.students.length;
    data.students = data.students.filter(s => s.id !== id);
    if (data.students.length !== prevLen) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // Teachers
  getTeachers: (): Teacher[] => {
    return loadDatabase().teachers;
  },
  createTeacher: (teacherData: Omit<Teacher, 'id' | 'createdAt'>): Teacher => {
    const data = loadDatabase();
    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };
    data.teachers.push(newTeacher);
    saveDatabase(data);
    return newTeacher;
  },

  // Live Classes
  getLiveClasses: (): LiveClass[] => {
    return loadDatabase().liveClasses;
  },
  createLiveClass: (classData: Omit<LiveClass, 'id'>): LiveClass => {
    const data = loadDatabase();
    const newClass: LiveClass = {
      ...classData,
      id: `live-${Date.now().toString().slice(-6)}`,
    };
    data.liveClasses.push(newClass);

    // Send broadcast notification
    data.notifications.unshift({
      id: `notif-${Date.now().toString().slice(-6)}`,
      title: `New Live Class Scheduled: ${newClass.title}`,
      message: `Ustadh ${newClass.teacherName || 'ഉസ്താദ്'} will conduct ${newClass.title} via ${(newClass.provider || 'google_meet').toUpperCase()} at ${new Date(newClass.startTime).toLocaleString()}.`,
      type: "class_reminder",
      targetRole: "all",
      isRead: false,
      createdAt: new Date().toISOString()
    });

    saveDatabase(data);
    return newClass;
  },
  deleteLiveClass: (id: string): boolean => {
    const data = loadDatabase();
    const prev = data.liveClasses.length;
    data.liveClasses = data.liveClasses.filter(c => c.id !== id);
    if (data.liveClasses.length !== prev) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // Recorded Classes
  getRecordedClasses: (): RecordedClass[] => {
    return loadDatabase().recordedClasses;
  },
  createRecordedClass: (recordedData: Omit<RecordedClass, 'id' | 'viewsCount' | 'createdAt'>): RecordedClass => {
    const data = loadDatabase();
    const newRecord: RecordedClass = {
      ...recordedData,
      id: `rec-${Date.now().toString().slice(-6)}`,
      viewsCount: 1,
      createdAt: new Date().toISOString()
    };
    data.recordedClasses.unshift(newRecord);
    saveDatabase(data);
    return newRecord;
  },
  deleteRecordedClass: (id: string): boolean => {
    const data = loadDatabase();
    const prev = data.recordedClasses.length;
    data.recordedClasses = data.recordedClasses.filter(c => c.id !== id);
    if (data.recordedClasses.length !== prev) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // Attendance
  getAttendance: (): AttendanceRecord[] => {
    return loadDatabase().attendance;
  },
  deleteAttendance: (id: string): boolean => {
    const data = loadDatabase();
    const prev = data.attendance.length;
    data.attendance = data.attendance.filter(a => a.id !== id);
    if (data.attendance.length !== prev) {
      saveDatabase(data);
      return true;
    }
    return false;
  },
  markAttendance: (record: Omit<AttendanceRecord, 'id'>): AttendanceRecord => {
    const data = loadDatabase();
    const existingIndex = data.attendance.findIndex(
      a => a.studentId === record.studentId && a.date === record.date
    );

    let resultRecord: AttendanceRecord;
    if (existingIndex >= 0) {
      data.attendance[existingIndex] = { ...data.attendance[existingIndex], ...record };
      resultRecord = data.attendance[existingIndex];
    } else {
      resultRecord = {
        ...record,
        id: `att-${Date.now().toString().slice(-6)}`
      };
      data.attendance.unshift(resultRecord);
    }

    // Recalculate student attendance rate
    const studentRecords = data.attendance.filter(a => a.studentId === record.studentId);
    const presentCount = studentRecords.filter(a => a.status === 'present' || a.status === 'late').length;
    const rate = Math.round((presentCount / studentRecords.length) * 100 * 10) / 10;
    
    const std = data.students.find(s => s.id === record.studentId);
    if (std) {
      std.attendanceRate = rate;
    }

    saveDatabase(data);
    return resultRecord;
  },

  // Programs & Musabaqa
  getPrograms: (): Program[] => {
    return loadDatabase().programs;
  },
  createProgram: (prog: Omit<Program, 'id'>): Program => {
    const data = loadDatabase();
    const newProg: Program = {
      ...prog,
      id: `prg-${Date.now().toString().slice(-6)}`,
      registeredStudentIds: []
    };
    data.programs.push(newProg);
    saveDatabase(data);
    return newProg;
  },
  participateProgram: (programId: string, studentId: string): boolean => {
    const data = loadDatabase();
    const prog = data.programs.find(p => p.id === programId);
    if (!prog) return false;
    if (!prog.registeredStudentIds) prog.registeredStudentIds = [];
    if (!prog.registeredStudentIds.includes(studentId)) {
      prog.registeredStudentIds.push(studentId);
      saveDatabase(data);
    }
    return true;
  },

  // Notifications
  getNotifications: (studentId?: string): NotificationItem[] => {
    const data = loadDatabase();
    if (!studentId) return data.notifications;
    return data.notifications.filter(n => n.targetRole === 'all' || n.studentId === studentId);
  },
  markNotificationRead: (id: string): void => {
    const data = loadDatabase();
    const notif = data.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      saveDatabase(data);
    }
  },

  // Certificates
  getCertificates: (): Certificate[] => {
    return loadDatabase().certificates;
  },
  getCertificatesByStudent: (studentId: string): Certificate[] => {
    return loadDatabase().certificates.filter(c => c.studentId === studentId);
  },
  createCertificate: (certData: Omit<Certificate, 'id' | 'verificationCode' | 'qrCodeData'>): Certificate => {
    const data = loadDatabase();
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const verificationCode = `TRB-VERIF-${randomHex}`;
    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now().toString().slice(-6)}`,
      verificationCode,
      qrCodeData: `https://tarbiyah.edu/verify/${verificationCode}`
    };
    data.certificates.push(newCert);
    saveDatabase(data);
    return newCert;
  },

  // Reports
  getProgressReports: (): ProgressReport[] => {
    return loadDatabase().progressReports;
  },
  getStudentReport: (studentId: string): ProgressReport | undefined => {
    return loadDatabase().progressReports.find(r => r.studentId === studentId);
  },

  // Madrasa Settings
  getSettings: (): MadrasaSettings => {
    const data = loadDatabase();
    const defaults: MadrasaSettings = {
      madrasaName: 'നൂറുൽ ഹുദാ ഇസ്ലാമിക് മദ്റസ',
      principalName: '',
      address: 'കേരളം',
      phone: '7559950633',
      email: '',
      description: '',
      admissionYear: new Date().getFullYear().toString(),
      whatsappNumber: '7559950633',
      websiteUrl: ''
    };
    return { ...defaults, ...(data.settings || {}) };
  },
  updateSettings: (settings: MadrasaSettings): MadrasaSettings => {
    const data = loadDatabase();
    data.settings = settings;
    saveDatabase(data);
    return settings;
  }
};
