'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { BismillahBanner, RubElHizb } from '@/components/common/IslamicMotif';
import { LiveClass, Certificate, NotificationItem } from '@/lib/types';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Award, 
  Video, 
  Bell, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Download, 
  ShieldCheck, 
  Flame,
  BookmarkCheck,
  Sparkles,
  Phone
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [revisionDoneToday, setRevisionDoneToday] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      // Fetch user's live classes
      fetch('/api/live-classes')
        .then(r => r.json())
        .then(d => { if (d.classes) setLiveClasses(d.classes); })
        .catch(() => {});

      // Fetch user's certificates
      fetch(`/api/certificates?studentId=${user.id}`)
        .then(r => r.json())
        .then(d => { if (d.certificates) setCertificates(d.certificates); })
        .catch(() => {});

      // Fetch notifications
      fetch(`/api/notifications?studentId=${user.id}`)
        .then(r => r.json())
        .then(d => { if (d.notifications) setNotifications(d.notifications); })
        .catch(() => {});
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-tarbiyah-800 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-gray-500">{t.common.loading}</p>
      </div>
    );
  }

  const attendancePercent = user?.attendanceRate ?? 94.5;
  const currentLevel = user?.currentLevel ?? 'Intermediate Hifz';
  const currentSurahNum = user?.currentSurah ?? 18;
  const currentAyahNum = user?.currentAyah ?? 45;
  const juzCount = user?.hifzJuzCompleted ?? 6;

  return (
    <div className="space-y-8 py-4">
      
      <BismillahBanner />

      {/* Top Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-tarbiyah-950 via-tarbiyah-900 to-tarbiyah-800 text-white shadow-xl border border-gold-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-tarbiyah-800/80 border-2 border-gold-400 flex items-center justify-center font-bold text-2xl text-gold-300 shadow-md">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Assalamu Alaikum, {user?.name || 'Student'}!
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                Active Student
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/80">
              Curriculum Track: <strong className="text-gold-300 font-bold">{currentLevel}</strong> • ID: {user?.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
          <Link
            href="/quran-module"
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-tarbiyah-950 font-bold text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Mushaf Reader</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Attendance % */}
        <div className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Attendance %</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{attendancePercent}%</p>
          <div className="w-full bg-gray-100 dark:bg-islamic-dark rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${attendancePercent}%` }} />
          </div>
          <p className="text-[11px] text-gray-400">Exemplary attendance status</p>
        </div>

        {/* Quran Memorization (Hifz) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Hifz Progress</span>
            <Flame className="w-4 h-4 text-gold-500" />
          </div>
          <p className="text-3xl font-black text-gold-600 dark:text-gold-400">{juzCount} / 30 <span className="text-xs font-normal text-gray-400">Ajza'</span></p>
          <div className="w-full bg-gray-100 dark:bg-islamic-dark rounded-full h-1.5 overflow-hidden">
            <div className="bg-gold-500 h-1.5 rounded-full" style={{ width: `${(juzCount / 30) * 100}%` }} />
          </div>
          <p className="text-[11px] text-gray-400">Juz 1 to {juzCount} completed</p>
        </div>

        {/* Today's Surah Bookmark */}
        <div className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Current Bookmark</span>
            <BookmarkCheck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-tarbiyah-950 dark:text-white">Surah {currentSurahNum}</p>
          <p className="text-xs text-tarbiyah-800 dark:text-gold-300 font-semibold">Ayah {currentAyahNum}</p>
          <Link href="/quran-module" className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline block">
            Continue Reading →
          </Link>
        </div>

        {/* Certificates */}
        <div className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Certificates</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-3xl font-black text-purple-600 dark:text-purple-400">{certificates.length}</p>
          <p className="text-[11px] text-gray-400">Official verified credentials</p>
          <Link href="/certificates" className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline block">
            View Credentials →
          </Link>
        </div>

      </div>

      {/* Main Grid: Quran Tracker & Live Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quran Progress & Daily Revision Card */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Daily Muraja'ah Task */}
          <div className="p-6 rounded-3xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gold-500" />
                  Today's Muraja'ah (Revision Circle)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Daily recitation review prescribed by your Ustadh</p>
              </div>

              <button
                onClick={() => setRevisionDoneToday(!revisionDoneToday)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  revisionDoneToday
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gold-50 dark:bg-gold-950 text-gold-800 dark:text-gold-300 border border-gold-300 dark:border-gold-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{revisionDoneToday ? "Completed Alhamdulillah" : t.quran.markRevisionComplete}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-islamic-dark border border-gray-100 dark:border-islamic-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">Target Assigned:</span>
                <p className="text-sm font-bold text-tarbiyah-950 dark:text-white mt-0.5">Surah Al-Kahf (Ayah 1-50) & Surah Al-Mulk</p>
                <p className="text-xs text-gray-500">Instructor: Ustadh Abdullah Al-Azhari</p>
              </div>
              <Link
                href="/quran-module"
                className="px-4 py-2 rounded-xl bg-tarbiyah-800 text-gold-300 text-xs font-bold hover:bg-tarbiyah-700 transition-colors"
              >
                Recite Now
              </Link>
            </div>

            {/* Quick Level Roadmap */}
            <div className="pt-2 border-t border-gray-100 dark:border-islamic-border">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-3">
                Curriculum Milestone Track
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold">
                  ✓ Qaida Nooraniyah
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold">
                  ✓ Tilawah Foundations
                </div>
                <div className="p-2.5 rounded-xl bg-gold-50 dark:bg-gold-950/80 border border-gold-400 dark:border-gold-700 text-gold-900 dark:text-gold-300 font-bold shadow-xs">
                  ★ Hifz & Tajweed
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-islamic-dark text-gray-400 font-medium">
                  Ijazah Sanad
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Live Classes */}
          <div className="p-6 rounded-3xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-gold-500" />
                Upcoming Live Classrooms
              </h3>
              <Link href="/live-classes" className="text-xs font-bold text-tarbiyah-800 dark:text-gold-400 hover:underline">
                View All Schedule →
              </Link>
            </div>

            <div className="space-y-3">
              {liveClasses.map(cls => (
                <div
                  key={cls.id}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-islamic-dark border border-gray-100 dark:border-islamic-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        cls.provider === 'zoom' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {cls.provider.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {cls.durationMinutes} mins
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-tarbiyah-950 dark:text-white">{cls.title}</h4>
                    <p className="text-xs text-gray-500">Instructor: {cls.teacherName}</p>
                  </div>

                  <a
                    href={cls.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-tarbiyah-800 hover:bg-tarbiyah-700 text-gold-300 font-bold text-xs shadow-md border border-gold-500/30 text-center transition-all"
                  >
                    Join {cls.provider === 'zoom' ? 'Zoom' : 'Meet'}
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar: Student Profile Details & Notifications */}
        <div className="space-y-6">
          
          {/* Profile Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-tarbiyah-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-gold-500" />
              Student Profile
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-islamic-border">
                <span className="text-gray-500">Full Name</span>
                <span className="font-bold text-tarbiyah-950 dark:text-white">{user?.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-islamic-border">
                <span className="text-gray-500">Mobile Number</span>
                <span className="font-mono font-semibold">{user?.mobileNumber || "9876543210"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-islamic-border">
                <span className="text-gray-500">Gender & Age</span>
                <span className="capitalize">{user?.gender || 'male'} ({user?.age || 12} yrs)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-islamic-border">
                <span className="text-gray-500">Parent / Guardian</span>
                <span className="font-semibold">{user?.parentName || "Muhammad Farooq"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-islamic-border">
                <span className="text-gray-500">Parent Contact</span>
                <span className="font-mono">{user?.parentMobile || "9876543211"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Residential Address</span>
                <span className="text-right text-gray-700 dark:text-gray-300 max-w-[150px] truncate">{user?.address || "Kozhikode, Kerala"}</span>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-tarbiyah-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-gold-500" />
              Recent Alerts & Notices
            </h3>

            <div className="space-y-2.5">
              {notifications.map(n => (
                <div key={n.id} className="p-3 rounded-xl bg-gray-50 dark:bg-islamic-dark text-xs space-y-1">
                  <p className="font-bold text-tarbiyah-900 dark:text-gold-300">{n.title}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-[11px] leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-gray-400 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
