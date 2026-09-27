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
import { d1Query, d1Exec } from './d1';

export const db = {
  // Students
  getStudents: async (): Promise<Student[]> => {
    const rows = await d1Query<any>('SELECT * FROM students ORDER BY created_at DESC');
    return rows.map(r => ({
      id: r.id,
      fullName: r.full_name,
      mobileNumber: r.mobile_number,
      password: r.password,
      gender: r.gender,
      age: r.age,
      address: r.address,
      parentName: r.parent_name,
      parentMobile: r.parent_mobile,
      registrationStatus: r.registration_status,
      currentLevel: r.current_level,
      attendanceRate: r.attendance_rate,
      enrollmentDate: r.created_at,
      createdAt: r.created_at
    }));
  },

  getStudentById: async (id: string): Promise<Student | undefined> => {
    const rows = await d1Query<any>('SELECT * FROM students WHERE id = ? LIMIT 1', [id]);
    if (!rows.length) return undefined;
    const r = rows[0];
    return {
      id: r.id,
      fullName: r.full_name,
      mobileNumber: r.mobile_number,
      password: r.password,
      gender: r.gender,
      age: r.age,
      address: r.address,
      parentName: r.parent_name,
      parentMobile: r.parent_mobile,
      registrationStatus: r.registration_status,
      currentLevel: r.current_level,
      attendanceRate: r.attendance_rate,
      enrollmentDate: r.created_at,
      createdAt: r.created_at
    };
  },

  getStudentByMobile: async (mobile: string): Promise<Student | undefined> => {
    const clean = mobile.trim().replace(/\D/g, '');
    const rows = await d1Query<any>('SELECT * FROM students WHERE mobile_number = ? LIMIT 1', [clean]);
    if (!rows.length) return undefined;
    const r = rows[0];
    return {
      id: r.id,
      fullName: r.full_name,
      mobileNumber: r.mobile_number,
      password: r.password,
      gender: r.gender,
      age: r.age,
      address: r.address,
      parentName: r.parent_name,
      parentMobile: r.parent_mobile,
      registrationStatus: r.registration_status,
      currentLevel: r.current_level,
      attendanceRate: r.attendance_rate,
      enrollmentDate: r.created_at,
      createdAt: r.created_at
    };
  },

  createStudent: async (studentData: Omit<Student, 'id' | 'createdAt' | 'registrationStatus' | 'currentSurah' | 'currentAyah' | 'hifzJuzCompleted' | 'currentLevel' | 'attendanceRate'>): Promise<{ success: boolean; student?: Student; error?: string }> => {
    const existing = await db.getStudentByMobile(studentData.mobileNumber);
    if (existing) {
      return { success: false, error: "ഈ മൊബൈൽ നമ്പർ ഇതിനകം രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്." };
    }

    const id = `std-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();
    const cleanMobile = studentData.mobileNumber.trim().replace(/\D/g, '');

    await d1Exec(
      `INSERT INTO students (id, full_name, mobile_number, password, gender, age, address, parent_name, parent_mobile, registration_status, current_level, attendance_rate, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        studentData.fullName,
        cleanMobile,
        studentData.password || '',
        studentData.gender || 'male',
        studentData.age || 10,
        studentData.address || '',
        studentData.parentName || '',
        studentData.parentMobile || '',
        'pending',
        'Beginner',
        0,
        now
      ]
    );

    return {
      success: true,
      student: {
        ...studentData,
        id,
        mobileNumber: cleanMobile,
        registrationStatus: 'pending',
        enrollmentDate: now,
        createdAt: now
      }
    };
  },

  updateStudentStatus: async (id: string, status: 'approved' | 'rejected' | 'pending'): Promise<boolean> => {
    return await d1Exec('UPDATE students SET registration_status = ? WHERE id = ?', [status, id]);
  },

  updateStudent: async (id: string, updates: Partial<Student>): Promise<Student | null> => {
    const fields: string[] = [];
    const params: any[] = [];

    if (updates.fullName !== undefined && updates.fullName.trim()) {
      fields.push('full_name = ?');
      params.push(updates.fullName.trim());
    }
    if (updates.password !== undefined && updates.password.trim()) {
      fields.push('password = ?');
      params.push(updates.password.trim());
    }
    if (updates.registrationStatus !== undefined) {
      fields.push('registration_status = ?');
      params.push(updates.registrationStatus);
    }
    if (updates.parentName !== undefined) {
      fields.push('parent_name = ?');
      params.push(updates.parentName);
    }
    if (updates.parentMobile !== undefined) {
      fields.push('parent_mobile = ?');
      params.push(updates.parentMobile);
    }
    if (updates.address !== undefined) {
      fields.push('address = ?');
      params.push(updates.address);
    }
    if (updates.age !== undefined) {
      fields.push('age = ?');
      params.push(updates.age);
    }
    if (updates.gender !== undefined) {
      fields.push('gender = ?');
      params.push(updates.gender);
    }

    if (!fields.length) return await db.getStudentById(id) || null;

    params.push(id);
    await d1Exec(`UPDATE students SET ${fields.join(', ')} WHERE id = ?`, params);
    return await db.getStudentById(id) || null;
  },

  deleteStudent: async (id: string): Promise<boolean> => {
    await d1Exec('DELETE FROM attendance WHERE student_id = ?', [id]);
    return await d1Exec('DELETE FROM students WHERE id = ?', [id]);
  },

  // Live Classes (Google Meet)
  getLiveClasses: async (): Promise<LiveClass[]> => {
    const rows = await d1Query<any>('SELECT * FROM live_classes ORDER BY start_time DESC');
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      meetingLink: r.meeting_link,
      startTime: r.start_time,
      durationMinutes: r.duration_minutes,
      provider: r.provider || 'google_meet',
      level: r.level,
      description: r.description,
      status: 'scheduled'
    }));
  },

  createLiveClass: async (classData: Omit<LiveClass, 'id'>): Promise<LiveClass> => {
    const id = `live-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    await d1Exec(
      `INSERT INTO live_classes (id, title, meeting_link, start_time, duration_minutes, provider, level, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        classData.title,
        classData.meetingLink,
        classData.startTime,
        classData.durationMinutes || 45,
        classData.provider || 'google_meet',
        classData.level || 'All Levels',
        classData.description || '',
        now
      ]
    );

    return { ...classData, id, status: 'scheduled' };
  },

  deleteLiveClass: async (id: string): Promise<boolean> => {
    return await d1Exec('DELETE FROM live_classes WHERE id = ?', [id]);
  },

  // Recorded Classes (YouTube)
  getRecordedClasses: async (): Promise<RecordedClass[]> => {
    const rows = await d1Query<any>('SELECT * FROM recorded_classes ORDER BY created_at DESC');
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      classNumber: r.class_number,
      youtubeUrl: r.youtube_url,
      videoUrl: r.video_url,
      subject: r.subject,
      level: r.level,
      teacherName: r.teacher_name,
      createdAt: r.created_at
    }));
  },

  createRecordedClass: async (recordedData: Omit<RecordedClass, 'id' | 'viewsCount' | 'createdAt'>): Promise<RecordedClass> => {
    const id = `rec-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    await d1Exec(
      `INSERT INTO recorded_classes (id, title, description, class_number, youtube_url, video_url, subject, level, teacher_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        recordedData.title,
        recordedData.description || '',
        recordedData.classNumber || 'ക്ലാസ് 1',
        recordedData.youtubeUrl || '',
        recordedData.videoUrl || '',
        recordedData.subject || 'islamic_studies',
        recordedData.level || 'All Levels',
        recordedData.teacherName || 'ഉസ്താദ്',
        now
      ]
    );

    return { ...recordedData, id, createdAt: now };
  },

  deleteRecordedClass: async (id: string): Promise<boolean> => {
    return await d1Exec('DELETE FROM recorded_classes WHERE id = ?', [id]);
  },

  // Attendance
  getAttendance: async (): Promise<AttendanceRecord[]> => {
    const rows = await d1Query<any>('SELECT * FROM attendance ORDER BY date DESC');
    return rows.map(r => ({
      id: r.id,
      studentId: r.student_id,
      studentName: r.student_name,
      date: r.date,
      status: r.status,
      remarks: r.remarks,
      markedBy: r.marked_by
    }));
  },

  markAttendance: async (record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> => {
    const existing = await d1Query<any>(
      'SELECT id FROM attendance WHERE student_id = ? AND date = ? LIMIT 1', 
      [record.studentId, record.date]
    );
    
    let id = existing.length > 0 ? existing[0].id : `att-${Date.now().toString().slice(-6)}`;

    if (existing.length > 0) {
      await d1Exec(
        'UPDATE attendance SET status = ?, remarks = ?, marked_by = ? WHERE id = ?',
        [record.status, record.remarks || '', record.markedBy || 'Admin', id]
      );
    } else {
      await d1Exec(
        'INSERT INTO attendance (id, student_id, student_name, date, status, remarks, marked_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, record.studentId, record.studentName || 'Student', record.date, record.status, record.remarks || '', record.markedBy || 'Admin']
      );
    }

    return { ...record, id };
  },

  deleteAttendance: async (id: string): Promise<boolean> => {
    return await d1Exec('DELETE FROM attendance WHERE id = ?', [id]);
  },

  // Madrasa Settings
  getSettings: async (): Promise<MadrasaSettings> => {
    const defaults: MadrasaSettings = {
      madrasaName: 'നൂറുൽ ഹുദാ ഇസ്ലാമിക് മദ്റസ',
      principalName: '',
      address: 'കേരളം',
      phone: '7559950633',
      email: '',
      description: '',
      admissionYear: '2026',
      whatsappNumber: '7559950633',
      websiteUrl: ''
    };

    const rows = await d1Query<any>('SELECT * FROM madrasa_settings WHERE id = ? LIMIT 1', ['main_settings']);
    if (!rows.length) return defaults;
    const r = rows[0];

    return {
      madrasaName: r.madrasa_name || defaults.madrasaName,
      principalName: r.principal_name || defaults.principalName,
      address: r.address || defaults.address,
      phone: r.phone || defaults.phone,
      email: r.email || defaults.email,
      description: r.description || defaults.description,
      admissionYear: r.admission_year || defaults.admissionYear,
      whatsappNumber: r.whatsapp_number || defaults.whatsappNumber,
      websiteUrl: r.website_url || defaults.websiteUrl
    };
  },

  updateSettings: async (s: MadrasaSettings): Promise<MadrasaSettings> => {
    await d1Exec(
      `INSERT INTO madrasa_settings (id, madrasa_name, principal_name, address, phone, email, description, admission_year, whatsapp_number, website_url)
       VALUES ('main_settings', ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         madrasa_name = excluded.madrasa_name,
         principal_name = excluded.principal_name,
         address = excluded.address,
         phone = excluded.phone,
         email = excluded.email,
         description = excluded.description,
         admission_year = excluded.admission_year,
         whatsapp_number = excluded.whatsapp_number,
         website_url = excluded.website_url`,
      [
        s.madrasaName || 'നൂറുൽ ഹുദാ ഇസ്ലാമിക് മദ്റസ',
        s.principalName || '',
        s.address || '',
        s.phone || '7559950633',
        s.email || '',
        s.description || '',
        s.admissionYear || '2026',
        s.whatsappNumber || '7559950633',
        s.websiteUrl || ''
      ]
    );
    return s;
  },

  // Fallbacks for optional sections
  getTeachers: async (): Promise<Teacher[]> => [],
  createTeacher: async (teacherData: any): Promise<Teacher> => ({ ...teacherData, id: `tch-${Date.now().toString().slice(-6)}`, createdAt: new Date().toISOString() }),
  getPrograms: async (): Promise<Program[]> => [],
  createProgram: async (p: any): Promise<Program> => ({ ...p, id: `prg-${Date.now().toString().slice(-6)}` }),
  participateProgram: async (programId?: string, studentId?: string) => true,
  getNotifications: async (studentId?: string): Promise<NotificationItem[]> => [],
  markNotificationRead: async (id?: string) => {},
  getCertificates: async (): Promise<Certificate[]> => [],
  getCertificatesByStudent: async (studentId?: string) => [],
  createCertificate: async (cert: any): Promise<Certificate> => ({ ...cert, id: `cert-${Date.now().toString().slice(-6)}`, verificationCode: 'TRB-001' }),
  getProgressReports: async (): Promise<ProgressReport[]> => [],
  getStudentReport: async (studentId?: string) => undefined
};
