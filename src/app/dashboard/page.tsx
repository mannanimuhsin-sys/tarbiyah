'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BismillahBanner, RubElHizb } from '@/components/common/IslamicMotif';
import { LiveClass, RecordedClass, AttendanceRecord } from '@/lib/types';
import { 
  User, 
  Video, 
  Tv, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Lock, 
  Phone, 
  Edit3, 
  Save, 
  ExternalLink,
  Play,
  Check,
  AlertCircle
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'classes' | 'recorded' | 'attendance' | 'profile'>('classes');

  // Data states
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [recordedClasses, setRecordedClasses] = useState<RecordedClass[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attStats, setAttStats] = useState({ totalRecords: 0, presentRecords: 0, absentRecords: 0, overallPercentage: 0 });

  // Profile Edit state
  const [editName, setEditName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Active video player
  const [playingVideo, setPlayingVideo] = useState<RecordedClass | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      setEditName(user.name || '');

      // 1. Fetch Google Meet Live Classes
      fetch('/api/live-classes')
        .then(r => r.json())
        .then(d => { if (d.classes) setLiveClasses(d.classes); })
        .catch(() => {});

      // 2. Fetch Recorded YouTube Classes
      fetch('/api/recorded-classes')
        .then(r => r.json())
        .then(d => { if (d.videos) setRecordedClasses(d.videos); })
        .catch(() => {});

      // 3. Fetch exact Student Attendance
      fetch(`/api/attendance?studentId=${user.id}`)
        .then(r => r.json())
        .then(d => {
          if (d.records) setAttendanceRecords(d.records);
          if (d.stats) setAttStats(d.stats);
        })
        .catch(() => {});
    }
  }, [user, loading, router]);

  // Handle Profile Update (Name & Password editable, Mobile Number FIXED)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);

    if (!editName.trim()) {
      setProfileError("പേര് നിർബന്ധമാണ്.");
      return;
    }

    setProfileSaving(true);
    try {
      const payload: Record<string, any> = {
        id: user?.id,
        fullName: editName.trim()
      };
      if (newPassword.trim()) {
        payload.password = newPassword.trim();
      }

      const res = await fetch('/api/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setProfileSaving(false);

      if (res.ok && data.success) {
        setProfileSuccess(true);
        setNewPassword('');
        setTimeout(() => setProfileSuccess(false), 4000);
      } else {
        setProfileError(data.error || "പ്രൊഫൈൽ മാറ്റാൻ സാധിച്ചില്ല.");
      }
    } catch (err: any) {
      setProfileSaving(false);
      setProfileError("കണക്ഷൻ തകരാർ സംഭവിച്ചു.");
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-tarbiyah-800 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-gray-500">ലോഡിംഗ്...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2 sm:py-4 max-w-4xl mx-auto">
      
      <BismillahBanner />

      {/* Top Welcome Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-tarbiyah-950 via-tarbiyah-900 to-tarbiyah-800 text-white shadow-xl border border-gold-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-tarbiyah-800/80 border-2 border-gold-400 flex items-center justify-center font-bold text-2xl text-gold-300 shadow-md shrink-0">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <span className="text-[11px] font-semibold text-emerald-300 block uppercase tracking-wider">
              വിദ്യാർത്ഥി പോർട്ടൽ
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {user?.name || 'വിദ്യാർത്ഥി'}
            </h1>
            <p className="text-xs text-emerald-100/80 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>{user?.mobileNumber}</span>
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-xs font-bold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all self-end sm:self-center"
        >
          ലോഗൗട്ട് (Logout)
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-gray-100 dark:bg-islamic-card rounded-2xl border border-gray-200 dark:border-islamic-border">
        <button
          onClick={() => setActiveTab('classes')}
          className={`py-2.5 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
            activeTab === 'classes'
              ? 'bg-tarbiyah-800 text-gold-300 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Video className="w-4 h-4" />
          <span className="truncate">ലൈവ് ക്ലാസ്</span>
        </button>

        <button
          onClick={() => setActiveTab('recorded')}
          className={`py-2.5 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
            activeTab === 'recorded'
              ? 'bg-tarbiyah-800 text-gold-300 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span className="truncate">റെക്കോർഡ്</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`py-2.5 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
            activeTab === 'attendance'
              ? 'bg-tarbiyah-800 text-gold-300 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="truncate">ഹാജർ</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2.5 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
            activeTab === 'profile'
              ? 'bg-tarbiyah-800 text-gold-300 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="truncate">പ്രൊഫൈൽ</span>
        </button>
      </div>

      {/* 1. TAB: LIVE CLASSES (Google Meet) */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-tarbiyah-950 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-600" />
              <span>ലൈവ് ക്ലാസുകൾ (Google Meet)</span>
            </h2>
            <span className="text-xs text-gray-500">{liveClasses.length} ക്ലാസുകൾ</span>
          </div>

          {liveClasses.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-islamic-card rounded-2xl border border-dashed border-gray-300 dark:border-islamic-border">
              <Clock className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                നിലവിൽ ലൈവ് ക്ലാസുകൾ ഷെഡ്യൂൾ ചെയ്തിട്ടില്ല.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ക്ലാസ് ആരംഭിക്കുമ്പോൾ ഇവിടെ കാണാവുന്നതാണ്.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm hover:shadow-md transition-shadow space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                        {cls.level || 'എല്ലാ ക്ലാസുകൾക്കും'}
                      </span>
                      <h3 className="text-base font-bold text-tarbiyah-950 dark:text-white mt-1.5">
                        {cls.title}
                      </h3>
                      {cls.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{cls.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-islamic-dark text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-tarbiyah-700 dark:text-gold-400 shrink-0" />
                    <span className="font-semibold">
                      സമയം: {new Date(cls.startTime).toLocaleString('ml-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>

                  <a
                    href={cls.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>ഗൂഗിൾ മീറ്റിൽ പ്രവേശിക്കുക (Join Meet)</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. TAB: RECORDED YOUTUBE CLASSES */}
      {activeTab === 'recorded' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-tarbiyah-950 dark:text-white flex items-center gap-2">
              <Tv className="w-5 h-5 text-red-600" />
              <span>റെക്കോർഡ് ചെയ്ത ക്ലാസുകൾ (YouTube)</span>
            </h2>
            <span className="text-xs text-gray-500">{recordedClasses.length} വീഡിയോകൾ</span>
          </div>

          {/* Active Video Player Modal/Section if chosen */}
          {playingVideo && (
            <div className="p-4 sm:p-5 rounded-2xl bg-black text-white space-y-3 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gold-400 font-bold">{playingVideo.classNumber}</span>
                  <h3 className="text-base font-bold truncate">{playingVideo.title}</h3>
                </div>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold"
                >
                  ക്ലോസ് ചെയ്യുക
                </button>
              </div>

              <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-900 border border-white/10">
                <iframe
                  src={playingVideo.videoUrl}
                  title={playingVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <p className="text-xs text-gray-300">{playingVideo.description}</p>
            </div>
          )}

          {recordedClasses.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-islamic-card rounded-2xl border border-dashed border-gray-300 dark:border-islamic-border">
              <Tv className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                റെക്കോർഡ് ചെയ്ത ക്ലാസുകൾ ലഭ്യമല്ല.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recordedClasses.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tarbiyah-50 dark:bg-tarbiyah-950/60 text-tarbiyah-800 dark:text-gold-400 border border-tarbiyah-200">
                        {rec.classNumber || 'ക്ലാസ്'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-tarbiyah-950 dark:text-white line-clamp-2">
                      {rec.title}
                    </h4>

                    {rec.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {rec.description}
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-islamic-dark border-t border-gray-100 dark:border-islamic-border flex items-center gap-2">
                    <button
                      onClick={() => setPlayingVideo(rec)}
                      className="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>ഇവിടെ കാണുക</span>
                    </button>

                    {rec.youtubeUrl && (
                      <a
                        href={rec.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-red-500"
                        title="YouTube-ൽ തുറക്കുക"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. TAB: ATTENDANCE STATUS */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-tarbiyah-950 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-tarbiyah-800 dark:text-gold-400" />
              <span>വിദ്യാർത്ഥിയുടെ ഹാജർ നില (Attendance)</span>
            </h2>
          </div>

          {/* Stats Summary Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-islamic-card border border-gray-100 dark:border-islamic-border text-center">
              <span className="text-xs text-gray-500 block">ആകെ ദിവസങ്ങൾ</span>
              <span className="text-2xl font-black text-tarbiyah-950 dark:text-white mt-1 block">
                {attStats.totalRecords}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold block">ഹാജർ (Present)</span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1 block">
                {attStats.presentRecords}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center">
              <span className="text-xs text-red-800 dark:text-red-300 font-bold block">ഗൈർഹാജർ (Absent)</span>
              <span className="text-2xl font-black text-red-700 dark:text-red-400 mt-1 block">
                {attStats.absentRecords}
              </span>
            </div>
          </div>

          {/* Attendance History List */}
          <div className="bg-white dark:bg-islamic-card rounded-2xl p-4 sm:p-5 border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              ഹാജർ വിശദാംശങ്ങൾ (Daily Log)
            </h3>

            {attendanceRecords.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">
                ഹാജർ വിവരങ്ങൾ രേഖപ്പെടുത്തിയിട്ടില്ല.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {attendanceRecords.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-islamic-dark flex items-center justify-between border border-gray-100 dark:border-islamic-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-islamic-card border border-gray-200 dark:border-islamic-border">
                        <Calendar className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          {new Date(att.date).toLocaleDateString('ml-IN', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        {att.remarks && (
                          <p className="text-[11px] text-gray-500">{att.remarks}</p>
                        )}
                      </div>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      att.status === 'present'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : att.status === 'late'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    }`}>
                      {att.status === 'present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {att.status === 'absent' && <XCircle className="w-3.5 h-3.5" />}
                      {att.status === 'late' && <Clock className="w-3.5 h-3.5" />}
                      <span>
                        {att.status === 'present' ? 'ഹാജർ' : att.status === 'late' ? 'വൈകി' : 'ഗൈർഹാജർ'}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB: PROFILE & SETTINGS (Name & Password edit, Mobile Number FIXED) */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-islamic-card rounded-3xl p-6 sm:p-8 border border-tarbiyah-100 dark:border-islamic-border shadow-sm max-w-xl mx-auto space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-islamic-border">
            <div className="w-10 h-10 rounded-xl bg-tarbiyah-900 text-gold-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-tarbiyah-950 dark:text-white">
                പ്രൊഫൈൽ വിവരങ്ങൾ (Profile Settings)
              </h2>
              <p className="text-xs text-gray-500">
                പേരും പാസ്‌വേഡും ഇവിടെ എഡിറ്റ് ചെയ്യാം
              </p>
            </div>
          </div>

          {profileSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>പ്രൊഫൈൽ വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!</span>
            </div>
          )}

          {profileError && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            
            {/* Student Name (EDITABLE) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-tarbiyah-700 dark:text-gold-400" />
                <span>വിദ്യാർത്ഥിയുടെ പേര് (Full Name - മാറ്റാം)</span>
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-tarbiyah-700"
              />
            </div>

            {/* Mobile Number (STRICTLY FIXED - CANNOT BE EDITED) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>മൊബൈൽ നമ്പർ (Mobile Number)</span>
                </span>
                <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>മാറ്റാൻ സാധിക്കില്ല (Fixed)</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value={user?.mobileNumber || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-500 cursor-not-allowed select-none"
                />
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                സുരക്ഷാ കാരണങ്ങളാൽ രജിസ്റ്റർ ചെയ്ത മൊബൈൽ നമ്പർ മാറ്റാൻ അനുവാദമില്ല.
              </p>
            </div>

            {/* New Password (EDITABLE) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-tarbiyah-700 dark:text-gold-400" />
                <span>പുതിയ പാസ്‌വേഡ് (New Password - ആവശ്യമെങ്കിൽ മാത്രം)</span>
              </label>
              <input
                type="password"
                placeholder="മാറ്റേണ്ടതില്ലെങ്കിൽ ഒഴിവാക്കാം"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-tarbiyah-700"
              />
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="w-full py-3 rounded-xl font-bold text-xs bg-tarbiyah-800 hover:bg-tarbiyah-700 text-gold-300 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {profileSaving ? (
                <div className="w-4 h-4 border-2 border-gold-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>സേവ് ചെയ്യുക (Save Changes)</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
