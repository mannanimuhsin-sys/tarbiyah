'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Student, LiveClass, RecordedClass, AttendanceRecord, MadrasaSettings } from '@/lib/types';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Trash2, 
  Edit, 
  Video, 
  Tv, 
  Calendar, 
  ShieldCheck, 
  Settings, 
  Save, 
  Plus, 
  Phone, 
  ExternalLink,
  Lock,
  RefreshCw,
  LogOut,
  X
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'students' | 'recorded' | 'live' | 'attendance' | 'settings'>('students');
  const [loading, setLoading] = useState(true);

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [recordedClasses, setRecordedClasses] = useState<RecordedClass[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [settings, setSettings] = useState<MadrasaSettings>({
    madrasaName: 'നൂറുൽ ഹുദാ ഇസ്ലാമിക് മദ്റസ', principalName: '', address: 'കേരളം', phone: '7559950633',
    email: '', description: '', admissionYear: new Date().getFullYear().toString(),
    whatsappNumber: '7559950633', websiteUrl: ''
  });

  // Filter & Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // New Recorded Class Form state (YouTube)
  const [newRecorded, setNewRecorded] = useState({
    title: '',
    classNumber: 'ക്ലാസ് 1',
    youtubeUrl: '',
    description: ''
  });
  const [recordedSaving, setRecordedSaving] = useState(false);

  // New Live Class Form state (Google Meet)
  const [newLive, setNewLive] = useState({
    title: '',
    meetingLink: '',
    startTime: '',
    level: 'എല്ലാ ക്ലാസുകൾക്കും',
    description: ''
  });
  const [liveSaving, setLiveSaving] = useState(false);

  // Attendance Form state
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [attStatus, setAttStatus] = useState<'present' | 'absent' | 'late'>('present');
  const [attRemarks, setAttRemarks] = useState('');
  const [attSaving, setAttSaving] = useState(false);

  // Edit Student Modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    parentName: '',
    parentMobile: '',
    password: '',
    address: ''
  });
  const [studentUpdating, setStudentUpdating] = useState(false);

  // Settings status
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Load all admin data
  const loadData = async () => {
    setLoading(true);
    try {
      const [resStd, resRec, resLive, resAtt, resSet] = await Promise.all([
        fetch('/api/students').then(r => r.json()),
        fetch('/api/recorded-classes').then(r => r.json()),
        fetch('/api/live-classes').then(r => r.json()),
        fetch('/api/attendance').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
      ]);

      if (resStd.students) setStudents(resStd.students);
      if (resRec.videos) setRecordedClasses(resRec.videos);
      if (resLive.classes) setLiveClasses(resLive.classes);
      if (resAtt.records) setAttendanceRecords(resAtt.records);
      if (resSet.settings) setSettings(resSet.settings);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'super_admin')) {
      router.push('/');
      return;
    }
    if (user && user.role === 'super_admin') {
      loadData();
    }
  }, [user, authLoading, router]);

  // Student Actions: Approval / Rejection
  const handleUpdateStudentStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const res = await fetch('/api/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, registrationStatus: status })
      });
      if (res.ok) {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, registrationStatus: status } : s));
      }
    } catch (err) {
      alert("സ്റ്റാറ്റസ് മാറ്റാൻ സാധിച്ചില്ല.");
    }
  };

  // Student Actions: Delete
  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`വിദ്യാർത്ഥി "${name}"-നെ സ്ഥിരമായി ഡിലീറ്റ് ചെയ്യണമെന്ന് ഉറപ്പാണോ?`)) return;
    try {
      const res = await fetch(`/api/students?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStudents(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      alert("ഡിലീറ്റ് ചെയ്യാൻ സാധിച്ചില്ല.");
    }
  };

  // Student Actions: Save Edit
  const handleSaveStudentEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setStudentUpdating(true);
    try {
      const payload: Record<string, any> = {
        id: editingStudent.id,
        fullName: editForm.fullName.trim(),
        parentName: editForm.parentName.trim(),
        parentMobile: editForm.parentMobile.trim(),
        address: editForm.address.trim()
      };
      if (editForm.password.trim()) {
        payload.password = editForm.password.trim();
      }

      const res = await fetch('/api/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setStudentUpdating(false);

      if (res.ok && data.success) {
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...payload } : s));
        setEditingStudent(null);
      } else {
        alert(data.error || "അപ്‌ഡേറ്റ് ചെയ്യാൻ സാധിച്ചില്ല.");
      }
    } catch (err) {
      setStudentUpdating(false);
      alert("കണക്ഷൻ തകരാർ സംഭവിച്ചു.");
    }
  };

  // Recorded Class: Save New (YouTube)
  const handleCreateRecorded = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecorded.title.trim() || !newRecorded.youtubeUrl.trim()) {
      alert("ഹെഡിങ്ങും യൂട്യൂബ് ലിങ്കും നൽകണം.");
      return;
    }

    setRecordedSaving(true);
    try {
      const res = await fetch('/api/recorded-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecorded)
      });
      const data = await res.json();
      setRecordedSaving(false);

      if (res.ok && data.success) {
        setRecordedClasses(prev => [data.video, ...prev]);
        setNewRecorded({ title: '', classNumber: 'ക്ലാസ് 1', youtubeUrl: '', description: '' });
      } else {
        alert(data.error || "സേവ് ചെയ്യാൻ സാധിച്ചില്ല.");
      }
    } catch (err) {
      setRecordedSaving(false);
      alert("കണക്ഷൻ തകരാർ സംഭവിച്ചു.");
    }
  };

  // Recorded Class: Delete
  const handleDeleteRecorded = async (id: string) => {
    if (!confirm("ഈ ക്ലാസ് ഡിലീറ്റ് ചെയ്യണമെന്ന് ഉറപ്പാണോ?")) return;
    try {
      const res = await fetch(`/api/recorded-classes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecordedClasses(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      alert("ഡിലീറ്റ് ചെയ്യാൻ സാധിച്ചില്ല.");
    }
  };

  // Live Class: Save New (Google Meet)
  const handleCreateLive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLive.title.trim() || !newLive.meetingLink.trim() || !newLive.startTime.trim()) {
      alert("ഹെഡിങ്, ഗൂഗിൾ മീറ്റ് ലിങ്ക്, സമയം എന്നിവ നൽകണം.");
      return;
    }

    setLiveSaving(true);
    try {
      const res = await fetch('/api/live-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLive)
      });
      const data = await res.json();
      setLiveSaving(false);

      if (res.ok && data.success) {
        setLiveClasses(prev => [data.liveClass, ...prev]);
        setNewLive({ title: '', meetingLink: '', startTime: '', level: 'എല്ലാ ക്ലാസുകൾക്കും', description: '' });
      } else {
        alert(data.error || "സേവ് ചെയ്യാൻ സാധിച്ചില്ല.");
      }
    } catch (err) {
      setLiveSaving(false);
      alert("കണക്ഷൻ തകരാർ സംഭവിച്ചു.");
    }
  };

  // Live Class: Delete
  const handleDeleteLive = async (id: string) => {
    if (!confirm("ഈ ലൈവ് ക്ലാസ് ഷെഡ്യൂൾ ഡിലീറ്റ് ചെയ്യണമെന്ന് ഉറപ്പാണോ?")) return;
    try {
      const res = await fetch(`/api/live-classes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLiveClasses(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      alert("ഡിലീറ്റ് ചെയ്യാൻ സാധിച്ചില്ല.");
    }
  };

  // Attendance: Save Mark
  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !attDate) {
      alert("വിദ്യാർത്ഥിയെയും തിയതിയും തിരഞ്ഞെടുക്കണം.");
      return;
    }

    setAttSaving(true);
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudentId,
          date: attDate,
          status: attStatus,
          remarks: attRemarks.trim()
        })
      });
      const data = await res.json();
      setAttSaving(false);

      if (res.ok && data.success) {
        setAttendanceRecords(prev => [data.record, ...prev.filter(a => !(a.studentId === selectedStudentId && a.date === attDate))]);
        setAttRemarks('');
        alert("ഹാജർ വിജയകരമായി രേഖപ്പെടുത്തി!");
      } else {
        alert(data.error || "ഹാജർ രേഖപ്പെടുത്താൻ സാധിച്ചില്ല.");
      }
    } catch (err) {
      setAttSaving(false);
      alert("കണക്ഷൻ തകരാർ സംഭവിച്ചു.");
    }
  };

  // Attendance: Delete
  const handleDeleteAttendance = async (id: string) => {
    if (!confirm("ഈ ഹാജർ റെക്കോർഡ് ഒഴിവാക്കണമെന്ന് ഉറപ്പാണോ?")) return;
    try {
      const res = await fetch(`/api/attendance?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAttendanceRecords(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      alert("ഡിലീറ്റ് ചെയ്യാൻ സാധിച്ചില്ല.");
    }
  };

  // Madrasa Settings: Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      setSettingsSaving(false);

      if (res.ok && data.success) {
        // Update local state with saved data so header/WhatsApp button reflect changes immediately
        if (data.settings) setSettings(data.settings);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      } else {
        alert(data.error || "സെറ്റിംഗ്സ് സേവ് ചെയ്യാൻ സാധിച്ചില്ല.");
      }
    } catch (err) {
      setSettingsSaving(false);
      alert("കണക്ഷൻ തകരാർ സംഭവിച്ചു.");
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.mobileNumber.includes(studentSearch);
    const matchesFilter = studentFilter === 'all' || s.registrationStatus === studentFilter;
    return matchesSearch && matchesFilter;
  });

  const approvedStudents = students.filter(s => s.registrationStatus === 'approved');

  return (
    <div className="space-y-6 py-2 sm:py-4 max-w-5xl mx-auto">
      
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-tarbiyah-950 via-tarbiyah-900 to-tarbiyah-800 text-white shadow-xl border border-gold-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-tarbiyah-800/80 border border-gold-400 flex items-center justify-center text-gold-300 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gold-300 block uppercase tracking-wider">
              സൂപ്പർ അഡ്മിൻ കൺട്രോൾ പാനൽ
            </span>
            <h1 className="text-xl sm:text-2xl font-black">
              {settings.madrasaName || 'മദ്റസ മാനേജ്‌മെന്റ്'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={logout}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ലോഗൗട്ട്</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-gray-100 dark:bg-islamic-card rounded-2xl border border-gray-200 dark:border-islamic-border text-xs font-bold">
        <button
          onClick={() => setActiveTab('students')}
          className={`py-2.5 px-1 sm:px-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'students'
              ? 'bg-tarbiyah-800 text-gold-300 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="truncate">വിദ്യാർത്ഥികൾ ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recorded')}
          className={`py-2.5 px-1 sm:px-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'recorded'
              ? 'bg-tarbiyah-800 text-gold-300 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span className="truncate">റെക്കോർഡ് ({recordedClasses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`py-2.5 px-1 sm:px-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'live'
              ? 'bg-tarbiyah-800 text-gold-300 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Video className="w-4 h-4" />
          <span className="truncate">ലൈവ് ക്ലാസ് ({liveClasses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`py-2.5 px-1 sm:px-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'attendance'
              ? 'bg-tarbiyah-800 text-gold-300 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="truncate">ഹാജർ</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2.5 px-1 sm:px-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'settings'
              ? 'bg-tarbiyah-800 text-gold-300 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="truncate">മദ്റസ വിവരങ്ങൾ</span>
        </button>
      </div>

      {/* 1. TAB: STUDENTS CONTROL (Delete, Edit, Approval) */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-islamic-card p-3 rounded-2xl border border-gray-100 dark:border-islamic-border">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="പേര് അല്ലെങ്കിൽ മൊബൈൽ നമ്പർ..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStudentFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    studentFilter === status
                      ? 'bg-tarbiyah-800 text-gold-300'
                      : 'bg-gray-100 dark:bg-islamic-dark text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {status === 'all' && `എല്ലാം (${students.length})`}
                  {status === 'pending' && `പെൻഡിംഗ് (${students.filter(s => s.registrationStatus === 'pending').length})`}
                  {status === 'approved' && `അംഗീകരിച്ചവർ (${students.filter(s => s.registrationStatus === 'approved').length})`}
                  {status === 'rejected' && `നിരസിച്ചവർ (${students.filter(s => s.registrationStatus === 'rejected').length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Students List Table / Cards */}
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-islamic-card rounded-2xl border border-dashed border-gray-200 dark:border-islamic-border text-gray-500 text-xs font-semibold">
              വിദ്യാർത്ഥികൾ ആരുമില്ല.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((std) => (
                <div
                  key={std.id}
                  className="p-4 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-tarbiyah-950 dark:text-white">
                        {std.fullName}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        std.registrationStatus === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : std.registrationStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}>
                        {std.registrationStatus === 'approved' ? 'Approved' : std.registrationStatus === 'pending' ? 'Pending Approval' : 'Rejected'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <strong className="text-gray-800 dark:text-gray-200">{std.mobileNumber}</strong>
                      </span>
                      {std.parentName && <span>രക്ഷിതാവ്: {std.parentName}</span>}
                      {std.parentMobile && <span>രക്ഷിതാവിന്റെ ഫോൺ: {std.parentMobile}</span>}
                      {std.address && <span className="truncate max-w-xs">{std.address}</span>}
                    </div>
                  </div>

                  {/* Actions: Approve / Reject / Edit / Delete */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {std.registrationStatus !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStudentStatus(std.id, 'approved')}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                        title="Approve Student"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>അംഗീകരിക്കുക</span>
                      </button>
                    )}

                    {std.registrationStatus !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStudentStatus(std.id, 'rejected')}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                        title="Reject Student"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>നിരസിക്കുക</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setEditingStudent(std);
                        setEditForm({
                          fullName: std.fullName || '',
                          parentName: std.parentName || '',
                          parentMobile: std.parentMobile || '',
                          password: '',
                          address: std.address || ''
                        });
                      }}
                      className="p-1.5 rounded-xl bg-gray-100 dark:bg-islamic-dark text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                      title="Edit Student Details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteStudent(std.id, std.fullName)}
                      className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40"
                      title="Delete Student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. TAB: RECORDED CLASSES (YouTube Links & Class Number) */}
      {activeTab === 'recorded' && (
        <div className="space-y-6">
          
          {/* Create Recorded Class Form */}
          <div className="p-5 rounded-3xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-tarbiyah-950 dark:text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-red-600" />
              <span>പുതിയ റെക്കോർഡ് ക്ലാസ് ചേർക്കുക (YouTube)</span>
            </h3>

            <form onSubmit={handleCreateRecorded} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    ഹെഡിങ് / വിഷയത്തിന്റെ പേര്
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ഉദാ: തജ്‌വീദ് അടിസ്ഥാന പാഠങ്ങൾ"
                    value={newRecorded.title}
                    onChange={(e) => setNewRecorded({ ...newRecorded, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    ക്ലാസ് എത്രാമത്തേതാണ്?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ഉദാ: ക്ലാസ് 1, ഭാഗം 2"
                    value={newRecorded.classNumber}
                    onChange={(e) => setNewRecorded({ ...newRecorded, classNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  യൂട്യൂബ് ലിങ്ക് (YouTube URL)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=... അല്ലെങ്കിൽ https://youtu.be/..."
                  value={newRecorded.youtubeUrl}
                  onChange={(e) => setNewRecorded({ ...newRecorded, youtubeUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  ഡിസ്ക്രിപ്ഷൻ / കുറിപ്പ്
                </label>
                <textarea
                  rows={2}
                  placeholder="ക്ലാസിനെക്കുറിച്ചുള്ള വിവരണം..."
                  value={newRecorded.description}
                  onChange={(e) => setNewRecorded({ ...newRecorded, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-medium focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={recordedSaving}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center gap-1.5 disabled:opacity-60"
              >
                {recordedSaving ? 'സേവ് ചെയ്യുന്നു...' : 'സേവ് ചെയ്യുക (Save Class)'}
              </button>
            </form>
          </div>

          {/* List of Saved YouTube Classes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              ചേർത്ത റെക്കോർഡ് ക്ലാസുകൾ ({recordedClasses.length})
            </h4>

            {recordedClasses.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">ക്ലാസുകളൊന്നും ചേർത്തിട്ടില്ല.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recordedClasses.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tarbiyah-50 text-tarbiyah-800 dark:bg-tarbiyah-950 dark:text-gold-400">
                        {rec.classNumber}
                      </span>
                      <h5 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                        {rec.title}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {rec.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-islamic-border">
                      <a
                        href={rec.youtubeUrl || rec.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                      >
                        <span>YouTube തുറക്കുക</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => handleDeleteRecorded(rec.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. TAB: LIVE CLASSES (Direct Google Meet Links) */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          
          {/* Create Google Meet Class Form */}
          <div className="p-5 rounded-3xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-tarbiyah-950 dark:text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-600" />
              <span>പുതിയ ലൈവ് ക്ലാസ് ഷെഡ്യൂൾ ചെയ്യുക (Google Meet)</span>
            </h3>

            <form onSubmit={handleCreateLive} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    ക്ലാസ് ഹെഡിങ്
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ഉദാ: ഖുർആൻ ഹിഫ്സ് ലൈവ് ക്ലാസ്"
                    value={newLive.title}
                    onChange={(e) => setNewLive({ ...newLive, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    തിയതിയും സമയവും (Date & Time)
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newLive.startTime}
                    onChange={(e) => setNewLive({ ...newLive, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  ഗൂഗിൾ മീറ്റ് ലിങ്ക് (Google Meet Link)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://meet.google.com/xyz-abcd-efg"
                  value={newLive.meetingLink}
                  onChange={(e) => setNewLive({ ...newLive, meetingLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  വിവരണം / നിർദ്ദേശം
                </label>
                <input
                  type="text"
                  placeholder="ഉദാ: കൃത്യം 8:00 ന് മുമ്പായി ലിങ്കിൽ ജോയിൻ ചെയ്യുക"
                  value={newLive.description}
                  onChange={(e) => setNewLive({ ...newLive, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-medium focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={liveSaving}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5 disabled:opacity-60"
              >
                {liveSaving ? 'സേവ് ചെയ്യുന്നു...' : 'ലൈവ് ക്ലാസ് സേവ് ചെയ്യുക (Schedule Meet)'}
              </button>
            </form>
          </div>

          {/* List of Scheduled Google Meet Sessions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              ഷെഡ്യൂൾ ചെയ്ത ലൈവ് ക്ലാസുകൾ ({liveClasses.length})
            </h4>

            {liveClasses.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">ലൈവ് ക്ലാസുകൾ ഷെഡ്യൂൾ ചെയ്തിട്ടില്ല.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {liveClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-4 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm flex flex-col justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Google Meet
                      </span>
                      <h5 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                        {cls.title}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(cls.startTime).toLocaleString('ml-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-islamic-border">
                      <a
                        href={cls.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <span>ലിങ്ക് പരിശോധിക്കുക</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => handleDeleteLive(cls.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. TAB: ATTENDANCE CONTROL */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          
          {/* Mark Attendance Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-tarbiyah-950 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-tarbiyah-800 dark:text-gold-400" />
              <span>വിദ്യാർത്ഥിയുടെ ഹാജർ രേഖപ്പെടുത്തുക</span>
            </h3>

            <form onSubmit={handleMarkAttendance} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    തിയതി
                  </label>
                  <input
                    type="date"
                    required
                    value={attDate}
                    onChange={(e) => setAttDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    വിദ്യാർത്ഥി
                  </label>
                  <select
                    required
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                  >
                    <option value="">വിദ്യാർത്ഥിയെ തിരഞ്ഞെടുക്കുക</option>
                    {approvedStudents.map(std => (
                      <option key={std.id} value={std.id}>
                        {std.fullName} ({std.mobileNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    ഹാജർ നില (Status)
                  </label>
                  <select
                    value={attStatus}
                    onChange={(e) => setAttStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                  >
                    <option value="present">ഹാജർ (Present)</option>
                    <option value="absent">ഗൈർഹാജർ (Absent)</option>
                    <option value="late">വൈകി (Late)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  കുറിപ്പ് (Remarks - ഓപ്ഷണൽ)
                </label>
                <input
                  type="text"
                  placeholder="ഉദാ: കാരണം ബോധിപ്പിച്ചു"
                  value={attRemarks}
                  onChange={(e) => setAttRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-medium focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={attSaving}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-tarbiyah-800 hover:bg-tarbiyah-700 text-gold-300 shadow-md flex items-center gap-1.5 disabled:opacity-60"
              >
                {attSaving ? 'രേഖപ്പെടുത്തുന്നു...' : 'ഹാജർ സേവ് ചെയ്യുക (Save Attendance)'}
              </button>
            </form>
          </div>

          {/* Attendance Log Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              ഹാജർ രേഖകൾ ({attendanceRecords.length})
            </h4>

            {attendanceRecords.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">ഹാജർ വിവരങ്ങൾ രേഖപ്പെടുത്തിയിട്ടില്ല.</p>
            ) : (
              <div className="bg-white dark:bg-islamic-card rounded-2xl border border-tarbiyah-100 dark:border-islamic-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 dark:bg-islamic-dark text-gray-500 border-b border-gray-100 dark:border-islamic-border">
                      <tr>
                        <th className="p-3">തിയതി</th>
                        <th className="p-3">വിദ്യാർത്ഥി</th>
                        <th className="p-3">നില</th>
                        <th className="p-3">കുറിപ്പ്</th>
                        <th className="p-3 text-right">ആക്ഷൻ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-islamic-border">
                      {attendanceRecords.slice(0, 50).map(att => (
                        <tr key={att.id} className="hover:bg-gray-50/50 dark:hover:bg-islamic-dark/40">
                          <td className="p-3 font-semibold">{att.date}</td>
                          <td className="p-3 font-bold">{att.studentName}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              att.status === 'present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : att.status === 'late'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {att.status === 'present' ? 'ഹാജർ' : att.status === 'late' ? 'വൈകി' : 'ഗൈർഹാജർ'}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500">{att.remarks || '—'}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteAttendance(att.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 5. TAB: MADRASA SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-islamic-card rounded-3xl p-6 sm:p-8 border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-islamic-border">
            <div>
              <h3 className="text-base font-bold text-tarbiyah-950 dark:text-white">
                മദ്റസ വിവരങ്ങൾ (Madrasa Settings)
              </h3>
              <p className="text-xs text-gray-500">
                ഈ വിവരങ്ങൾ ആപ്പിലും ലോഗിൻ പേജിലും പ്രദർശിപ്പിക്കും
              </p>
            </div>
            {settingsSaved && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                സേവ് ചെയ്തു! ✓
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  മദ്റസയുടെ പേര് (Madrasa Name)
                </label>
                <input
                  type="text"
                  required
                  value={settings.madrasaName}
                  onChange={(e) => setSettings({ ...settings, madrasaName: e.target.value })}
                  placeholder="നൂറുൽ ഹുദാ ഇസ്ലാമിക് മദ്റസ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  പ്രിൻസിപ്പൽ / ഉസ്താദിന്റെ പേര്
                </label>
                <input
                  type="text"
                  value={settings.principalName}
                  onChange={(e) => setSettings({ ...settings, principalName: e.target.value })}
                  placeholder="ഉസ്താദ് അബ്ദുൽ റഹ്മാൻ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  WhatsApp നമ്പർ (വിദ്യാർത്ഥികൾ ബന്ധപ്പെടാൻ)
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="+919876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  ഫോൺ നമ്പർ (Phone)
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                മദ്റസ അഡ്രസ് (സ്ഥലം)
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="മലപ്പുറം, കേരളം"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={settingsSaving}
              className="py-3 px-6 rounded-xl font-bold text-xs bg-tarbiyah-800 hover:bg-tarbiyah-700 text-gold-300 shadow-md flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{settingsSaving ? 'സേവ് ചെയ്യുന്നു...' : 'വിവരങ്ങൾ സേവ് ചെയ്യുക'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-islamic-card rounded-3xl p-6 shadow-2xl border border-tarbiyah-200 dark:border-islamic-border relative">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-tarbiyah-950 dark:text-white mb-4 flex items-center gap-2">
              <Edit className="w-4 h-4 text-tarbiyah-700" />
              <span>വിദ്യാർത്ഥി വിവരങ്ങൾ എഡിറ്റ് ചെയ്യുക</span>
            </h3>

            <form onSubmit={handleSaveStudentEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  വിദ്യാർത്ഥിയുടെ പേര് (Name)
                </label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  മൊബൈൽ നമ്പർ (Fixed - മാറ്റാൻ സാധിക്കില്ല)
                </label>
                <input
                  type="text"
                  disabled
                  value={editingStudent.mobileNumber}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  പാസ്‌വേഡ് (മാറ്റാൻ ആഗ്രഹിക്കുന്നെങ്കിൽ മാത്രം നൽകുക)
                </label>
                <input
                  type="password"
                  placeholder="പുതിയ പാസ്‌വേഡ്"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    രക്ഷിതാവിന്റെ പേര്
                  </label>
                  <input
                    type="text"
                    value={editForm.parentName}
                    onChange={(e) => setEditForm({ ...editForm, parentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    രക്ഷിതാവിന്റെ ഫോൺ
                  </label>
                  <input
                    type="text"
                    value={editForm.parentMobile}
                    onChange={(e) => setEditForm({ ...editForm, parentMobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  വിലാസം (Address)
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold"
                >
                  റദ്ദാക്കുക
                </button>
                <button
                  type="submit"
                  disabled={studentUpdating}
                  className="px-5 py-2 rounded-xl bg-tarbiyah-800 hover:bg-tarbiyah-700 text-gold-300 text-xs font-bold disabled:opacity-60"
                >
                  {studentUpdating ? 'സേവ് ചെയ്യുന്നു...' : 'സേവ് ചെയ്യുക'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
