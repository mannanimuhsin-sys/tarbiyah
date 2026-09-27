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
  ProgressReport 
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
}

const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'tarbiyah_db.json');

const INITIAL_DATA: DatabaseData = {
  students: [
    {
      id: "std-001",
      fullName: "Zayd Muhammad",
      mobileNumber: "9876543210",
      password: "password123",
      gender: "male",
      age: 12,
      address: "Baitul Noor, Kozhikode, Kerala",
      parentName: "Muhammad Farooq",
      parentMobile: "9876543211",
      registrationStatus: "approved",
      enrollmentDate: "2026-01-15T09:00:00Z",
      currentLevel: "Intermediate",
      currentSurah: 18,
      currentAyah: 45,
      hifzJuzCompleted: 6,
      attendanceRate: 94.5,
      avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-01-15T09:00:00Z"
    },
    {
      id: "std-002",
      fullName: "Fatimah Zahra",
      mobileNumber: "9876543220",
      password: "password123",
      gender: "female",
      age: 10,
      address: "Al-Falah Villa, Malappuram, Kerala",
      parentName: "Abdul Rahman",
      parentMobile: "9876543221",
      registrationStatus: "approved",
      enrollmentDate: "2026-02-01T10:00:00Z",
      currentLevel: "Advanced Hifz",
      currentSurah: 36,
      currentAyah: 12,
      hifzJuzCompleted: 14,
      attendanceRate: 98.0,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-02-01T10:00:00Z"
    },
    {
      id: "std-003",
      fullName: "Ahmad Rayan",
      mobileNumber: "9876543230",
      password: "password123",
      gender: "male",
      age: 8,
      address: "Manzil Road, Kannur, Kerala",
      parentName: "Shabeer Ahmed",
      parentMobile: "9876543231",
      registrationStatus: "pending",
      enrollmentDate: "2026-09-24T11:30:00Z",
      currentLevel: "Beginner Qaida",
      currentSurah: 1,
      currentAyah: 7,
      hifzJuzCompleted: 0,
      attendanceRate: 0,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-09-24T11:30:00Z"
    },
    {
      id: "std-004",
      fullName: "Maryam Salih",
      mobileNumber: "9876543240",
      password: "password123",
      gender: "female",
      age: 9,
      address: "Garden View, Thrissur, Kerala",
      parentName: "Dr. Salih K.",
      parentMobile: "9876543241",
      registrationStatus: "pending",
      enrollmentDate: "2026-09-25T14:15:00Z",
      currentLevel: "Beginner",
      currentSurah: 1,
      currentAyah: 1,
      hifzJuzCompleted: 1,
      attendanceRate: 0,
      createdAt: "2026-09-25T14:15:00Z"
    },
    {
      id: "std-005",
      fullName: "Umar Faris",
      mobileNumber: "9876543250",
      password: "password123",
      gender: "male",
      age: 14,
      address: "Hidayah Nagar, Ernakulam, Kerala",
      parentName: "Ibrahim Kutty",
      parentMobile: "9876543251",
      registrationStatus: "approved",
      enrollmentDate: "2026-03-10T08:00:00Z",
      currentLevel: "Tajweed & Recitation",
      currentSurah: 55,
      currentAyah: 1,
      hifzJuzCompleted: 8,
      attendanceRate: 91.2,
      createdAt: "2026-03-10T08:00:00Z"
    }
  ],
  teachers: [
    {
      id: "tch-001",
      fullName: "Ustadh Abdullah Al-Azhari",
      email: "abdullah@tarbiyah.edu",
      mobileNumber: "9900112233",
      qualification: "M.A. Islamic Studies (Al-Azhar University, Cairo)",
      specialization: "Tajweed & Qira'at",
      bio: "Certified in 10 Qira'at with Ijazah sanad connected to Prophet Muhammad ﷺ. Over 15 years teaching experience.",
      isActive: true,
      assignedClassesCount: 4,
      createdAt: "2025-10-01T00:00:00Z"
    },
    {
      id: "tch-002",
      fullName: "Qari Bilal Mansoor",
      email: "bilal@tarbiyah.edu",
      mobileNumber: "9900112244",
      qualification: "Hafiz-ul-Quran, Sanad in Hafs 'an Asim",
      specialization: "Hifz Intensive & Revision",
      bio: "Completed Quran memorization at age 11. Guided over 80 students to complete full Quran Hifz.",
      isActive: true,
      assignedClassesCount: 6,
      createdAt: "2025-10-15T00:00:00Z"
    },
    {
      id: "tch-003",
      fullName: "Ustadha Aishah Siddiqa",
      email: "aishah@tarbiyah.edu",
      mobileNumber: "9900112255",
      qualification: "B.Ed Arabic & Noorani Qaida Certified",
      specialization: "Qaida Nooraniyah & Children Foundation",
      bio: "Specialist in child phonetics and joyful Quran foundation training for young minds.",
      isActive: true,
      assignedClassesCount: 3,
      createdAt: "2025-11-01T00:00:00Z"
    }
  ],
  liveClasses: [
    {
      id: "live-001",
      title: "Morning Hifz & Muraja'ah Circle",
      subject: "hifz",
      teacherId: "tch-002",
      teacherName: "Qari Bilal Mansoor",
      provider: "zoom",
      meetingLink: "https://zoom.us/j/9871234567?pwd=tarbiyahhifzcircle",
      meetingId: "987 123 4567",
      meetingPasscode: "tarbiyah2026",
      startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      durationMinutes: 45,
      level: "Intermediate & Advanced",
      status: "scheduled",
      description: "Daily dawn memorization review and pronunciation check for Juz 1 to 15."
    },
    {
      id: "live-002",
      title: "Mastering Makharij (Tajweed Principles)",
      subject: "tajweed",
      teacherId: "tch-001",
      teacherName: "Ustadh Abdullah Al-Azhari",
      provider: "google_meet",
      meetingLink: "https://meet.google.com/qur-anbt-tar",
      meetingId: "qur-anbt-tar",
      startTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      durationMinutes: 60,
      level: "All Levels",
      status: "scheduled",
      description: "Interactive pronunciation lab focusing on throat and tongue articulation points."
    },
    {
      id: "live-003",
      title: "Qaida Nooraniyah - Lesson 8: Tanween & Sukoon",
      subject: "qaida",
      teacherId: "tch-003",
      teacherName: "Ustadha Aishah Siddiqa",
      provider: "zoom",
      meetingLink: "https://zoom.us/j/8451122334?pwd=nooraniyahkids",
      meetingId: "845 112 2334",
      meetingPasscode: "noor786",
      startTime: new Date(Date.now() + 172800000).toISOString(),
      durationMinutes: 40,
      level: "Beginner",
      status: "scheduled",
      description: "Step-by-step spelling and phonetic joining for young beginners."
    }
  ],
  recordedClasses: [
    {
      id: "rec-001",
      title: "Complete Qaida Nooraniyah - Lesson 1 to 5 Foundational Letters",
      description: "Full guide to Arabic alphabet phonetics with standard Tajweed pronunciation rules.",
      subject: "qaida",
      level: "Beginner",
      teacherName: "Ustadha Aishah Siddiqa",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Cloudflare R2 streaming compatible
      thumbnailUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&auto=format&fit=crop&q=80",
      durationSeconds: 1420,
      viewsCount: 342,
      tags: ["Qaida", "Pronunciation", "Beginners"],
      createdAt: "2026-01-20T00:00:00Z"
    },
    {
      id: "rec-002",
      title: "The Rules of Noon Sakinah & Tanween: Izhar, Idgham, Iqlab, Ikhfa",
      description: "Comprehensive demonstration with verses from Juz Amma and Juz Tabarak.",
      subject: "tajweed",
      level: "Intermediate",
      teacherName: "Ustadh Abdullah Al-Azhari",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80",
      durationSeconds: 2150,
      viewsCount: 689,
      tags: ["Tajweed", "Noon Sakinah", "Idgham", "Ikhfa"],
      createdAt: "2026-02-14T00:00:00Z"
    },
    {
      id: "rec-003",
      title: "Surah Al-Mulk: Word by Word Recitation & Meaning Breakdown",
      description: "Learn to recite Surah Al-Mulk with proper stops (Waqf) and spiritual reflections.",
      subject: "quran_reading",
      level: "Intermediate",
      teacherName: "Qari Bilal Mansoor",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&auto=format&fit=crop&q=80",
      durationSeconds: 1890,
      viewsCount: 512,
      tags: ["Surah Al-Mulk", "Recitation", "Waqf"],
      createdAt: "2026-03-05T00:00:00Z"
    },
    {
      id: "rec-004",
      title: "Hifz Strategy: Long-Term Memory Retention Techniques",
      description: "Proven cognitive methods for preserving Quran memorization without forgetting.",
      subject: "hifz",
      level: "Advanced",
      teacherName: "Qari Bilal Mansoor",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&auto=format&fit=crop&q=80",
      durationSeconds: 1640,
      viewsCount: 890,
      tags: ["Hifz", "Memory", "Muraja'ah"],
      createdAt: "2026-04-12T00:00:00Z"
    }
  ],
  attendance: [
    {
      id: "att-001",
      studentId: "std-001",
      studentName: "Zayd Muhammad",
      date: "2026-09-25",
      status: "present",
      remarks: "Excellent recitation in Surah Al-Kahf",
      markedBy: "Qari Bilal Mansoor"
    },
    {
      id: "att-002",
      studentId: "std-002",
      studentName: "Fatimah Zahra",
      date: "2026-09-25",
      status: "present",
      remarks: "Accurate Tajweed with flawless Madd",
      markedBy: "Ustadh Abdullah Al-Azhari"
    },
    {
      id: "att-003",
      studentId: "std-005",
      studentName: "Umar Faris",
      date: "2026-09-25",
      status: "late",
      remarks: "Joined 10 mins late due to prayer time",
      markedBy: "Ustadh Abdullah Al-Azhari"
    },
    {
      id: "att-004",
      studentId: "std-001",
      studentName: "Zayd Muhammad",
      date: "2026-09-26",
      status: "present",
      remarks: "Daily Hifz target completed",
      markedBy: "Qari Bilal Mansoor"
    },
    {
      id: "att-005",
      studentId: "std-002",
      studentName: "Fatimah Zahra",
      date: "2026-09-26",
      status: "present",
      remarks: "Perfect Muraja'ah of Juz 14",
      markedBy: "Qari Bilal Mansoor"
    }
  ],
  programs: [
    {
      id: "prg-001",
      title: "State Level Musabaqa Tilawat-il-Quran 2026",
      category: "Musabaqa",
      description: "Prestigious annual Quran recitation competition with renowned judges and certified sanad accolades.",
      startDate: "2026-10-15",
      endDate: "2026-10-18",
      venueOrLink: "Tarbiyah Grand Auditorium & Live Broadcast",
      rules: "Recitation from memory with accurate Tajweed. Categories: Under 12, Under 18, and Open Hifz.",
      rewards: "Gold Trophy, Cash Award ₹50,000, and Official Sanad Certificate.",
      isActive: true,
      registeredStudentIds: ["std-001", "std-002"]
    },
    {
      id: "prg-002",
      title: "Ramadan Hifz Accelerator Camp",
      category: "Annual Program",
      description: "Intensive 30-day spiritual and memorization camp dedicated to completing 3 new Ajza' with perfection.",
      startDate: "2026-11-01",
      endDate: "2026-11-30",
      venueOrLink: "Online Interactive Zoom Hubs",
      rules: "Mandatory daily attendance, daily dawn tasmee' (listening session), and evening tafseer.",
      rewards: "Completion Certificate and Special Madrasa Honor Roll.",
      isActive: true,
      registeredStudentIds: ["std-002", "std-005"]
    },
    {
      id: "prg-003",
      title: "Islamic Adab & Character Building Workshop",
      category: "Islamic Competition",
      description: "Interactive ethics and character program covering Prophetic manners (Shama'il) and filial piety (Birr al-Walidayn).",
      startDate: "2026-10-05",
      endDate: "2026-10-07",
      venueOrLink: "Google Meet Virtual Hall",
      rules: "Open for all enrolled students and parents.",
      rewards: "Tarbiyah Akhlaq Excellence Badge.",
      isActive: true,
      registeredStudentIds: ["std-001", "std-005"]
    }
  ],
  notifications: [
    {
      id: "notif-001",
      title: "Registration Approved!",
      message: "Congratulations! Your admission to Tarbiyah Islamic Education Platform has been approved by the Principal.",
      type: "system",
      targetRole: "student",
      studentId: "std-001",
      isRead: false,
      createdAt: "2026-09-24T10:00:00Z"
    },
    {
      id: "notif-002",
      title: "Upcoming Live Class Reminder",
      message: "Morning Hifz & Muraja'ah Circle starts in 1 hour. Please join via Zoom with your Mushaf ready.",
      type: "class_reminder",
      targetRole: "all",
      isRead: false,
      createdAt: "2026-09-26T06:00:00Z"
    },
    {
      id: "notif-003",
      title: "Musabaqa 2026 Registration Open",
      message: "Registration for the State Level Musabaqa Tilawat-il-Quran is now live. Enroll through the Programs tab.",
      type: "announcement",
      targetRole: "all",
      isRead: true,
      createdAt: "2026-09-23T08:30:00Z"
    }
  ],
  certificates: [
    {
      id: "cert-001",
      certificateNumber: "TRB-2026-HIFZ-089",
      studentId: "std-001",
      studentName: "Zayd Muhammad",
      courseOrAchievement: "Completion of 5 Ajza' Hifz with Distinction",
      issueDate: "2026-08-15",
      grade: "Mumtaz (Excellence 96%)",
      verificationCode: "TRB-VERIF-987654-ZM",
      qrCodeData: "https://tarbiyah.edu/verify/TRB-VERIF-987654-ZM"
    },
    {
      id: "cert-002",
      certificateNumber: "TRB-2026-TAJW-104",
      studentId: "std-002",
      studentName: "Fatimah Zahra",
      courseOrAchievement: "Advanced Tajweed & Theoretical Rules Certification",
      issueDate: "2026-07-20",
      grade: "Mumtaz Sharaf (Highest Honors 99%)",
      verificationCode: "TRB-VERIF-543210-FZ",
      qrCodeData: "https://tarbiyah.edu/verify/TRB-VERIF-543210-FZ"
    }
  ],
  progressReports: [
    {
      id: "rep-001",
      studentId: "std-001",
      studentName: "Zayd Muhammad",
      reportMonth: "September 2026",
      attendanceRate: 94.5,
      qaidaProgress: 100,
      tajweedScore: 92,
      hifzSurahs: ["Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya"],
      revisionQuality: "Excellent (Mumtaz)",
      teacherNotes: "Displays profound respect and consistency. Voice projection and Makharij are very precise.",
      conduct: "Exemplary",
      generatedDate: "2026-09-25"
    },
    {
      id: "rep-002",
      studentId: "std-002",
      studentName: "Fatimah Zahra",
      reportMonth: "September 2026",
      attendanceRate: 98.0,
      qaidaProgress: 100,
      tajweedScore: 99,
      hifzSurahs: ["Al-Baqarah", "Aal-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am"],
      revisionQuality: "Flawless Memorization",
      teacherNotes: "Exceptional student. Ready for national Musabaqa entry in category 15 Juz.",
      conduct: "Outstanding",
      generatedDate: "2026-09-25"
    }
  ]
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
      message: `Ustadh ${newClass.teacherName} will conduct ${newClass.title} via ${newClass.provider.toUpperCase()} at ${new Date(newClass.startTime).toLocaleString()}.`,
      type: "class_reminder",
      targetRole: "all",
      isRead: false,
      createdAt: new Date().toISOString()
    });

    saveDatabase(data);
    return newClass;
  },

  // Recorded Classes (Cloudflare R2 Integration)
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

  // Attendance
  getAttendance: (): AttendanceRecord[] => {
    return loadDatabase().attendance;
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
  }
};
