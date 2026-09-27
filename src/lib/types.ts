export type UserRole = 'super_admin' | 'teacher' | 'student' | 'parent';

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export type Gender = 'male' | 'female';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type SubjectType = 'qaida' | 'quran_reading' | 'tajweed' | 'hifz' | 'islamic_studies' | 'arabic_language';

export type LiveProvider = 'zoom' | 'google_meet';

export interface Student {
  id: string;
  fullName: string;
  mobileNumber: string;
  password?: string;
  passwordHash?: string;
  gender: Gender;
  age: number;
  address: string;
  parentName: string;
  parentMobile: string;
  registrationStatus: RegistrationStatus;
  enrollmentDate: string;
  currentLevel?: string;
  currentSurah?: number;
  currentAyah?: number;
  hifzJuzCompleted?: number;
  attendanceRate?: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  qualification: string;
  specialization: string;
  bio?: string;
  isActive: boolean;
  assignedClassesCount?: number;
  createdAt: string;
}

export interface LiveClass {
  id: string;
  title: string;
  meetingLink: string;
  startTime: string; // ISO string or time string
  durationMinutes?: number;
  subject?: SubjectType;
  teacherId?: string;
  teacherName?: string;
  provider?: LiveProvider;
  meetingId?: string;
  meetingPasscode?: string;
  level?: string;
  status?: 'scheduled' | 'live' | 'completed';
  description?: string;
}

export interface RecordedClass {
  id: string;
  title: string;
  description: string;
  classNumber?: string; // e.g. "ക്ലാസ് 1", "ക്ലാസ് 2" etc.
  youtubeUrl?: string;  // Direct YouTube link
  videoUrl: string;     // YouTube or video URL
  subject?: SubjectType;
  level?: string;
  teacherName?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  viewsCount?: number;
  tags?: string[];
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  markedBy?: string;
}

export interface Program {
  id: string;
  title: string;
  category: 'Musabaqa' | 'Islamic Competition' | 'Annual Program' | 'Workshop';
  description: string;
  startDate: string;
  endDate: string;
  venueOrLink: string;
  rules?: string;
  rewards?: string;
  isActive: boolean;
  registeredStudentIds?: string[];
  bannerUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'class_reminder' | 'announcement' | 'attendance' | 'exam' | 'system';
  targetRole: 'all' | 'student' | 'teacher';
  studentId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  courseOrAchievement: string;
  issueDate: string;
  grade: string;
  verificationCode: string;
  qrCodeData: string;
}

export interface ProgressReport {
  id: string;
  studentId: string;
  studentName: string;
  reportMonth: string;
  attendanceRate: number;
  qaidaProgress: number; // %
  tajweedScore: number; // /100
  hifzSurahs: string[];
  revisionQuality: string;
  teacherNotes: string;
  conduct: string;
  generatedDate: string;
}

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
  mobileNumber?: string;
  username?: string;
}

export interface MadrasaSettings {
  madrasaName: string;
  principalName: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  admissionYear: string;
  whatsappNumber: string;
  websiteUrl: string;
}
