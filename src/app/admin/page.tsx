'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Student, Teacher, LiveClass, RecordedClass, AttendanceRecord, MadrasaSettings } from '@/lib/types';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Download, 
  Plus, 
  Trash2, 
  Edit, 
  Video, 
  Tv, 
  Award, 
  Calendar, 
  BarChart3, 
  ShieldCheck, 
  FileText, 
  GraduationCap, 
  UserCheck, 
  Sparkles,
  Phone,
  RefreshCw,
  Settings,
  Save,
  School
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'teachers' | 'attendance' | 'classes' | 'certificates' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [recordedClasses, setRecordedClasses] = useState<RecordedClass[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [madrasaSettings, setMadrasaSettings] = useState<MadrasaSettings>({
    madrasaName: '', principalName: '', address: '', phone: '',
    email: '', description: '', admissionYear: new Date().getFullYear().toString(),
    whatsappNumber: '', websiteUrl: ''
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Modals & form states
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ fullName: '', email: '', mobileNumber: '', qualification: '', specialization: '' });

  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClass, setNewClass] = useState({
    title: '',
    subject: 'quran_reading',
    teacherName: '',
    provider: 'google_meet',
    meetingLink: '',
    startTime: '',
    durationMinutes: '45',
    level: 'All Levels'
  });

  const [showIssueCert, setShowIssueCert] = useState(false);
  const [certData, setCertData] = useState({ studentId: '', courseOrAchievement: '', grade: 'Mumtaz (Excellence)' });

  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStudentForAtt, setSelectedStudentForAtt] = useState('');
  const [attStatus, setAttStatus] = useState<'present' | 'absent' | 'late' | 'excused'>('present');
  const [attRemarks, setAttRemarks] = useState('');

  // Fetch all core data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resStd, resTch, resLive, resRec, resAtt] = await Promise.all([
        fetch('/api/students').then(r => r.json()),
        fetch('/api/teachers').then(r => r.json()),
        fetch('/api/live-classes').then(r => r.json()),
        fetch('/api/recorded-classes').then(r => r.json()),
        fetch('/api/attendance').then(r => r.json()),
      ]);

      if (resStd.students) setStudents(resStd.students);
      if (resTch.teachers) setTeachers(resTch.teachers);
      if (resLive.classes) setLiveClasses(resLive.classes);
      if (resRec.videos) setRecordedClasses(resRec.videos);
      if (resAtt.records) setAttendanceRecords(resAtt.records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings').then(r => r.json());
      if (res.settings) setMadrasaSettings(res.settings);
    } catch {}
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(madrasaSettings)
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch {}
    finally { setSettingsSaving(false); }
  };

  useEffect(() => {
    fetchData();
    fetchSettings();
  }, []);

  // Filtered students
  const filteredStudents = students.filter(s => {
    const matchesStatus = statusFilter === 'all' || s.registrationStatus === statusFilter;
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mobileNumber.includes(searchQuery) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Actions
  const handleApprove = async (id: string) => {
    await fetch(`/api/students/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' })
    });
    fetchData();
  };

  const handleReject = async (id: string) => {
    await fetch(`/api/students/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject' })
    });
    fetchData();
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm("Are you sure you want to remove this student record?")) {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTeacher)
    });
    setShowAddTeacher(false);
    setNewTeacher({ fullName: '', email: '', mobileNumber: '', qualification: '', specialization: '' });
    fetchData();
  };

  const handleCreateLiveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/live-classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClass)
    });
    setShowCreateClass(false);
    fetchData();
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForAtt) return;
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: selectedStudentForAtt,
        date: attendanceDate,
        status: attStatus,
        remarks: attRemarks,
        markedBy: 'Super Admin'
      })
    });
    setAttRemarks('');
    fetchData();
    alert("Attendance marked successfully!");
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certData.studentId || !certData.courseOrAchievement) return;
    await fetch('/api/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certData)
    });
    setShowIssueCert(false);
    alert("Certificate issued and recorded with QR verification code!");
  };

  // Export CSV
  const exportStudentsCSV = () => {
    const headers = ["ID", "Full Name", "Mobile", "Gender", "Age", "Parent Name", "Parent Mobile", "Status", "Attendance %", "Enrollment Date"];
    const rows = students.map(s => [
      s.id,
      `"${s.fullName}"`,
      s.mobileNumber,
      s.gender,
      s.age,
      `"${s.parentName}"`,
      s.parentMobile,
      s.registrationStatus,
      s.attendanceRate || 0,
      s.enrollmentDate
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tarbiyah_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalStudentsCount = students.length;
  const approvedStudentsCount = students.filter(s => s.registrationStatus === 'approved').length;
  const pendingStudentsCount = students.filter(s => s.registrationStatus === 'pending').length;
  const presentCount = attendanceRecords.filter(a => a.status === 'present' || a.status === 'late').length;
  const avgAttendance = attendanceRecords.length > 0
    ? Math.round((presentCount / attendanceRecords.length) * 100 * 10) / 10
    : 95.0;

  return (
    <div className="space-y-8 py-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-islamic-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-500/10 text-gold-500 border border-gold-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-tarbiyah-950 dark:text-white">
              {t.adminDashboard.title}
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Logged in as Super Admin. Central hub for student approvals, teachers, live classes & reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-islamic-card border border-gray-200 dark:border-islamic-border text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-gold-500 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportStudentsCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-tarbiyah-800 text-gold-300 text-xs font-bold hover:bg-tarbiyah-700 shadow-sm border border-gold-500/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t.adminDashboard.exportCsv}</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100 dark:border-islamic-border">
        {[
          { id: 'overview', label: "Overview", icon: BarChart3 },
          { id: 'students', label: `Students (${pendingStudentsCount} pending)`, icon: Users },
          { id: 'teachers', label: "Teachers", icon: UserCheck },
          { id: 'attendance', label: "Attendance System", icon: Calendar },
          { id: 'classes', label: "Classes & Streaming", icon: Video },
          { id: 'certificates', label: "Certificates", icon: Award },
          { id: 'settings', label: "Madrasa Settings", icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-tarbiyah-800 text-gold-300 shadow-md border border-gold-500/40'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-islamic-card'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* 7 Core KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{t.adminDashboard.totalStudents}</span>
              <p className="text-3xl font-black text-tarbiyah-950 dark:text-white mt-1">{totalStudentsCount}</p>
              <span className="text-[11px] text-emerald-600 font-semibold">{approvedStudentsCount} active verified</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 shadow-sm">
              <span className="text-xs text-amber-700 dark:text-amber-300 font-bold uppercase">{t.adminDashboard.pendingApprovals}</span>
              <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingStudentsCount}</p>
              <button 
                onClick={() => { setActiveTab('students'); setStatusFilter('pending'); }} 
                className="text-[11px] text-amber-700 font-bold hover:underline"
              >
                Review Applications →
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{t.adminDashboard.attendanceRate}</span>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{avgAttendance}%</p>
              <span className="text-[11px] text-gray-400 font-medium">calculated across all sessions</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{t.adminDashboard.liveClassesCount}</span>
              <p className="text-3xl font-black text-gold-600 dark:text-gold-400 mt-1">{liveClasses.length}</p>
              <span className="text-[11px] text-gray-400 font-medium">Zoom & Google Meet hubs</span>
            </div>

          </div>

          {/* Pending Students Quick Action Section */}
          {pendingStudentsCount > 0 && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-sm text-tarbiyah-950 dark:text-white">
                    Applications Awaiting Approval ({pendingStudentsCount})
                  </h3>
                </div>
                <span className="text-xs text-amber-700 dark:text-amber-400">Students cannot login until approved</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {students.filter(s => s.registrationStatus === 'pending').map(st => (
                  <div key={st.id} className="p-4 rounded-xl bg-white dark:bg-islamic-card border border-amber-200 dark:border-amber-900 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-sm text-tarbiyah-950 dark:text-white">{st.fullName}</p>
                      <p className="text-xs text-gray-500">Mobile: {st.mobileNumber} | Age: {st.age}</p>
                      <p className="text-xs text-gray-400">Parent: {st.parentName} ({st.parentMobile})</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(st.id)}
                        className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow"
                        title="Approve Student"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(st.id)}
                        className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors shadow"
                        title="Reject Student"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Schedule Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border space-y-4">
              <h3 className="font-bold text-sm text-tarbiyah-950 dark:text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-gold-500" />
                Active Live Classes
              </h3>
              <div className="space-y-3">
                {liveClasses.map(lc => (
                  <div key={lc.id} className="p-3 rounded-xl bg-gray-50 dark:bg-islamic-dark flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-tarbiyah-900 dark:text-white">{lc.title}</p>
                      <p className="text-[11px] text-gray-500">Ustadh: {lc.teacherName} • {lc.provider.toUpperCase()}</p>
                    </div>
                    <a
                      href={lc.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg bg-tarbiyah-800 text-gold-300 text-xs font-bold"
                    >
                      Join Class
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border space-y-4">
              <h3 className="font-bold text-sm text-tarbiyah-950 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                Faculty & Teachers ({teachers.length})
              </h3>
              <div className="space-y-3">
                {teachers.map(tc => (
                  <div key={tc.id} className="p-3 rounded-xl bg-gray-50 dark:bg-islamic-dark flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-tarbiyah-900 dark:text-white">{tc.fullName}</p>
                      <p className="text-[11px] text-gold-600 dark:text-gold-400 font-medium">{tc.specialization}</p>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                      {tc.assignedClassesCount || 3} Classes
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: STUDENT MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          
          {/* Controls: Search, Filter, Export */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-islamic-card p-4 rounded-2xl border border-tarbiyah-100 dark:border-islamic-border">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder={t.adminDashboard.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-islamic-dark border border-gray-200 dark:border-islamic-border text-xs focus:outline-none focus:ring-2 focus:ring-tarbiyah-600"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {(['all', 'approved', 'pending', 'rejected'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-tarbiyah-800 text-gold-300'
                      : 'bg-gray-100 dark:bg-islamic-dark text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={exportStudentsCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-islamic-dark hover:bg-gray-200 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-islamic-border bg-white dark:bg-islamic-card shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-islamic-dark text-gray-600 dark:text-gray-400 uppercase font-bold border-b border-gray-200 dark:border-islamic-border">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Parent Details</th>
                  <th className="p-4">Curriculum Level</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Attendance</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-islamic-border">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      No students found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-islamic-dark/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-tarbiyah-950 dark:text-white">{student.fullName}</div>
                        <div className="text-[11px] text-gray-500">Age: {student.age} • {student.gender}</div>
                      </td>
                      <td className="p-4 font-mono text-gray-700 dark:text-gray-300">{student.mobileNumber}</td>
                      <td className="p-4">
                        <div>{student.parentName}</div>
                        <div className="text-[11px] text-gray-500 font-mono">{student.parentMobile}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-tarbiyah-800 dark:text-gold-400">{student.currentLevel}</span>
                        <div className="text-[10px] text-gray-400">Hifz: {student.hifzJuzCompleted} Juz</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                          student.registrationStatus === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : student.registrationStatus === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                        }`}>
                          {student.registrationStatus}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
                        {student.attendanceRate ? `${student.attendanceRate}%` : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {student.registrationStatus === 'pending' && (
                            <button
                              onClick={() => handleApprove(student.id)}
                              className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-500"
                              title="Approve"
                            >
                              Approve
                            </button>
                          )}
                          {student.registrationStatus === 'pending' && (
                            <button
                              onClick={() => handleReject(student.id)}
                              className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-bold hover:bg-red-500"
                              title="Reject"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: TEACHER MANAGEMENT */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white">Faculty & Ustadhs</h3>
            <button
              onClick={() => setShowAddTeacher(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-tarbiyah-800 text-gold-300 text-xs font-bold hover:bg-tarbiyah-700 shadow border border-gold-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Teacher</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teachers.map(tch => (
              <div key={tch.id} className="p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-tarbiyah-900 text-gold-400 flex items-center justify-center font-bold text-lg">
                    {tch.fullName.charAt(0)}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-tarbiyah-950 dark:text-white">{tch.fullName}</h4>
                  <p className="text-xs text-gold-600 dark:text-gold-400 font-semibold">{tch.specialization}</p>
                  <p className="text-xs text-gray-500 mt-1">{tch.qualification}</p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
                  "{tch.bio}"
                </p>
                <div className="pt-3 border-t border-gray-100 dark:border-islamic-border flex items-center justify-between text-xs text-gray-500">
                  <span>Mobile: {tch.mobileNumber}</span>
                  <span className="font-bold text-tarbiyah-800 dark:text-gold-300">{tch.assignedClassesCount || 3} Classes</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Teacher Modal */}
          {showAddTeacher && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-islamic-card rounded-3xl p-6 max-w-md w-full border border-tarbiyah-100 dark:border-islamic-border shadow-2xl space-y-4">
                <h3 className="font-bold text-lg text-tarbiyah-950 dark:text-white">Add Certified Teacher</h3>
                <form onSubmit={handleAddTeacher} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name (e.g. Ustadh Ahmad)"
                    value={newTeacher.fullName}
                    onChange={e => setNewTeacher({ ...newTeacher, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    value={newTeacher.mobileNumber}
                    onChange={e => setNewTeacher({ ...newTeacher, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Qualification (e.g. Al-Azhar M.A, Hafiz)"
                    value={newTeacher.qualification}
                    onChange={e => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Specialization (e.g. Tajweed, Hifz Intensive)"
                    value={newTeacher.specialization}
                    onChange={e => setNewTeacher({ ...newTeacher, specialization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddTeacher(false)}
                      className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-islamic-dark text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-tarbiyah-800 text-gold-300 text-xs font-bold"
                    >
                      Save Teacher
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ATTENDANCE SYSTEM */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Mark Attendance Form */}
            <div className="p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-tarbiyah-950 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Record Daily Attendance
              </h3>
              <form onSubmit={handleMarkAttendance} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={attendanceDate}
                    onChange={e => setAttendanceDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Select Student</label>
                  <select
                    required
                    value={selectedStudentForAtt}
                    onChange={e => setSelectedStudentForAtt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                  >
                    <option value="">-- Choose Approved Student --</option>
                    {students.filter(s => s.registrationStatus === 'approved').map(s => (
                      <option key={s.id} value={s.id}>{s.fullName} ({s.mobileNumber})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['present', 'late', 'absent', 'excused'] as const).map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setAttStatus(st)}
                        className={`py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                          attStatus === st
                            ? 'bg-tarbiyah-800 text-gold-300'
                            : 'bg-gray-100 dark:bg-islamic-dark text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Teacher Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. Excellent Muraja'ah recitation"
                    value={attRemarks}
                    onChange={e => setAttRemarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                >
                  Save Attendance Record
                </button>
              </form>
            </div>

            {/* Attendance Logs */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-tarbiyah-950 dark:text-white flex items-center justify-between">
                <span>Recent Attendance Logs</span>
                <span className="text-xs text-emerald-600 font-semibold">Average: {avgAttendance}%</span>
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {attendanceRecords.map(rec => (
                  <div key={rec.id} className="p-3 rounded-xl bg-gray-50 dark:bg-islamic-dark flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-tarbiyah-950 dark:text-white">{rec.studentName}</span>
                      <p className="text-[11px] text-gray-500">{rec.date} • Marked by {rec.markedBy || 'Ustadh'}</p>
                      {rec.remarks && <p className="text-[11px] text-emerald-700 dark:text-emerald-300 italic">{rec.remarks}</p>}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full uppercase text-[10px] font-bold ${
                      rec.status === 'present'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : rec.status === 'late'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: CLASSES & STREAMING */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white">Live Classes & Recorded Vault</h3>
            <button
              onClick={() => setShowCreateClass(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-tarbiyah-800 text-gold-300 text-xs font-bold hover:bg-tarbiyah-700 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Live Class</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveClasses.map(cls => (
              <div key={cls.id} className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    cls.provider === 'zoom' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {cls.provider.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-gray-400">{cls.durationMinutes} mins</span>
                </div>
                <h4 className="font-bold text-sm text-tarbiyah-950 dark:text-white">{cls.title}</h4>
                <p className="text-xs text-gray-500">Instructor: {cls.teacherName}</p>
                <div className="pt-2 border-t border-gray-100 dark:border-islamic-border flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">{new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <a
                    href={cls.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-tarbiyah-800 text-gold-300 text-xs font-bold"
                  >
                    Open Link
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Schedule Live Class Modal */}
          {showCreateClass && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-islamic-card rounded-3xl p-6 max-w-md w-full border border-tarbiyah-100 dark:border-islamic-border shadow-2xl space-y-4">
                <h3 className="font-bold text-lg text-tarbiyah-950 dark:text-white">Schedule Live Session</h3>
                <form onSubmit={handleCreateLiveClass} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Class Title (e.g. Tajweed Noon Sakinah)"
                    value={newClass.title}
                    onChange={e => setNewClass({ ...newClass, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Instructor Name"
                    value={newClass.teacherName}
                    onChange={e => setNewClass({ ...newClass, teacherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                  />
                  <select
                    value={newClass.provider}
                    onChange={e => setNewClass({ ...newClass, provider: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                  >
                    <option value="google_meet">Google Meet</option>
                    <option value="zoom">Zoom</option>
                  </select>
                  <input
                    type="url"
                    required
                    placeholder="Meeting URL (e.g. https://meet.google.com/...)"
                    value={newClass.meetingLink}
                    onChange={e => setNewClass({ ...newClass, meetingLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                  />
                  <input
                    type="datetime-local"
                    required
                    value={newClass.startTime}
                    onChange={e => setNewClass({ ...newClass, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateClass(false)}
                      className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-islamic-dark text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-tarbiyah-800 text-gold-300 text-xs font-bold"
                    >
                      Schedule Class
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: CERTIFICATE ISSUANCE */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white">Auto-Generate Official Certificates</h3>
            <button
              onClick={() => setShowIssueCert(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-tarbiyah-800 text-gold-300 text-xs font-bold hover:bg-tarbiyah-700 shadow"
            >
              <Award className="w-4 h-4" />
              <span>Issue New Certificate</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border space-y-4">
            <p className="text-xs text-gray-500">
              Certificates issued from Tarbiyah automatically receive a cryptographically verified serial code and an embedded QR code link.
            </p>
            <div className="flex gap-3">
              <Link
                href="/certificates"
                className="px-4 py-2 rounded-xl bg-gold-50 dark:bg-gold-950/60 text-gold-800 dark:text-gold-300 border border-gold-300 dark:border-gold-700 text-xs font-bold hover:underline"
              >
                View & Print Public Certificate Gallery →
              </Link>
            </div>
          </div>

          {/* Issue Cert Modal */}
          {showIssueCert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-islamic-card rounded-3xl p-6 max-w-md w-full border border-tarbiyah-100 dark:border-islamic-border shadow-2xl space-y-4">
                <h3 className="font-bold text-lg text-tarbiyah-950 dark:text-white">Issue Authentic Certificate</h3>
                <form onSubmit={handleIssueCertificate} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Student</label>
                    <select
                      required
                      value={certData.studentId}
                      onChange={e => setCertData({ ...certData, studentId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                    >
                      <option value="">-- Choose Student --</option>
                      {students.filter(s => s.registrationStatus === 'approved').map(s => (
                        <option key={s.id} value={s.id}>{s.fullName} ({s.mobileNumber})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Achievement / Course</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Completion of 5 Ajza' Hifz with Distinction"
                      value={certData.courseOrAchievement}
                      onChange={e => setCertData({ ...certData, courseOrAchievement: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                    >
                    </input>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Honor Grade</label>
                    <input
                      type="text"
                      value={certData.grade}
                      onChange={e => setCertData({ ...certData, grade: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowIssueCert(false)}
                      className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-islamic-dark text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-tarbiyah-800 text-gold-300 text-xs font-bold"
                    >
                      Generate Certificate
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: MADRASA SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-islamic-border">
            <span className="p-2 rounded-xl bg-tarbiyah-900/10 text-tarbiyah-800 dark:text-gold-400 border border-tarbiyah-200 dark:border-gold-500/30">
              <School className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white">Madrasa Settings</h3>
              <p className="text-xs text-gray-500">Enter your madrasa's real information. This will appear throughout the app.</p>
            </div>
          </div>

          {settingsSaved && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Settings saved successfully!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Madrasa Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Noorul Hudha Arabic College"
                value={madrasaSettings.madrasaName}
                onChange={e => setMadrasaSettings({ ...madrasaSettings, madrasaName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Principal / Headmaster Name</label>
              <input
                type="text"
                placeholder="e.g. Ustadh Abdul Rahman"
                value={madrasaSettings.principalName}
                onChange={e => setMadrasaSettings({ ...madrasaSettings, principalName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={madrasaSettings.phone}
                onChange={e => setMadrasaSettings({ ...madrasaSettings, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">WhatsApp Number</label>
              <input
                type="tel"
                placeholder="e.g. +919876543210"
                value={madrasaSettings.whatsappNumber}
                onChange={e => setMadrasaSettings({ ...madrasaSettings, whatsappNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                placeholder="e.g. info@yourmadrasa.com"
                value={madrasaSettings.email}
                onChange={e => setMadrasaSettings({ ...madrasaSettings, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Admission Year</label>
              <input
                type="text"
                placeholder="e.g. 2026"
                value={madrasaSettings.admissionYear}
                onChange={e => setMadrasaSettings({ ...madrasaSettings, admissionYear: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Address</label>
              <input
                type="text"
                placeholder="e.g. Kottakkal Road, Malappuram, Kerala - 676505"
                value={madrasaSettings.address}
                onChange={e => setMadrasaSettings({ ...madrasaSettings, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Website URL</label>
              <input
                type="url"
                placeholder="e.g. https://yourmadrasa.com"
                value={madrasaSettings.websiteUrl}
                onChange={e => setMadrasaSettings({ ...madrasaSettings, websiteUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Madrasa Description</label>
              <textarea
                rows={3}
                placeholder="Brief description about your madrasa shown on the homepage..."
                value={madrasaSettings.description}
                onChange={e => setMadrasaSettings({ ...madrasaSettings, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600 resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={settingsSaving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-tarbiyah-800 hover:bg-tarbiyah-700 text-gold-300 font-bold text-sm shadow border border-gold-500/30 transition-all disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {settingsSaving ? 'Saving...' : 'Save Madrasa Settings'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
