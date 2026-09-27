'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { BismillahBanner, RubElHizb } from '@/components/common/IslamicMotif';
import { 
  BookOpen, 
  Video, 
  Tv, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Calendar,
  GraduationCap,
  School
} from 'lucide-react';
import { MadrasaSettings } from '@/lib/types';

export default function HomePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [settings, setSettings] = useState<MadrasaSettings | null>(null);
  const [stats, setStats] = useState({ students: 0, attendance: 0, liveClasses: 0, certificates: 0 });

  useEffect(() => {
    // Load madrasa settings
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.settings) setSettings(d.settings);
    }).catch(() => {});

    // Load real stats
    Promise.all([
      fetch('/api/students').then(r => r.json()),
      fetch('/api/live-classes').then(r => r.json()),
      fetch('/api/certificates').then(r => r.json()),
      fetch('/api/attendance').then(r => r.json()),
    ]).then(([stdRes, lcRes, certRes, attRes]) => {
      const students = stdRes.students || [];
      const attendance = attRes.records || [];
      const presentCount = attendance.filter((a: any) => a.status === 'present' || a.status === 'late').length;
      const avgAtt = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;
      setStats({
        students: students.filter((s: any) => s.registrationStatus === 'approved').length,
        liveClasses: (lcRes.classes || []).length,
        certificates: (certRes.certificates || []).length,
        attendance: avgAtt
      });
    }).catch(() => {});
  }, []);

  const madrasaName = settings?.madrasaName || 'Tarbiyah';
  const principalName = settings?.principalName || '';
  const description = settings?.description || '';

  return (
    <div className="space-y-16 py-4">
      
      {/* Top Bismillah Calligraphy */}
      <BismillahBanner />

      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-tarbiyah-950 via-tarbiyah-900 to-tarbiyah-800 text-white p-5 sm:p-14 shadow-2xl border border-gold-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs font-semibold">
            <School className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span className="truncate">{madrasaName}</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            {madrasaName} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-200">
              {t.nav.dashboard || 'Islamic Education'}
            </span>
          </h1>

          {description ? (
            <p className="text-sm sm:text-lg text-emerald-100/90 leading-relaxed">{description}</p>
          ) : (
            <p className="text-sm sm:text-lg text-emerald-100/90 leading-relaxed">
              Welcome to <strong className="text-white font-semibold">{madrasaName}</strong>. A digital madrasa platform for managing students, classes, attendance and certificates.
            </p>
          )}

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2 sm:pt-4">
            <Link
              href={user ? (user.role === 'super_admin' ? '/admin' : '/dashboard') : '/register'}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-tarbiyah-950 shadow-lg shadow-gold-500/20 hover:scale-[1.02] transition-all"
            >
              <span>{user ? t.nav.dashboard : t.auth.registerBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/quran-module"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all"
            >
              <BookOpen className="w-4 h-4 text-gold-400" />
              <span>{t.nav.quranModule}</span>
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl font-semibold text-xs text-gold-300/80 hover:text-gold-200 hover:underline"
            >
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

        {/* Decorative Watermark Arch */}
        <div className="hidden lg:block absolute -bottom-10 right-10 opacity-15">
          <RubElHizb className="w-80 h-80 text-gold-300" />
        </div>
      </section>

      {/* Metrics Banner — shows live data */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-tarbiyah-50 dark:bg-tarbiyah-900/60 flex items-center justify-center text-tarbiyah-700 dark:text-gold-400 shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-black text-tarbiyah-950 dark:text-white truncate">{stats.students}</p>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium truncate">Students Enrolled</p>
          </div>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold-50 dark:bg-gold-950/60 flex items-center justify-center text-gold-600 dark:text-gold-400 shrink-0">
            <Video className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-black text-tarbiyah-950 dark:text-white truncate">{stats.liveClasses}</p>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium truncate">Live Classes</p>
          </div>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-black text-tarbiyah-950 dark:text-white truncate">
              {stats.attendance > 0 ? `${stats.attendance}%` : '—'}
            </p>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium truncate">Attendance</p>
          </div>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-black text-tarbiyah-950 dark:text-white truncate">{stats.certificates}</p>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium truncate">Certificates</p>
          </div>
        </div>
      </section>

      {/* Six Feature Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-tarbiyah-950 dark:text-white">
            Curriculum & Learning Ecosystem
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Designed for modern madrasas with seamless progress monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link 
            href="/quran-module"
            className="group p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border hover:border-gold-400/60 shadow-sm transition-all hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-tarbiyah-900 text-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400">
              Interactive Quran Module
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Qaida Nooraniyah, Quran recitation (Tilawah), Tajweed articulation, and daily Hifz memorization tracking.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-gold-600 dark:text-gold-400 gap-1 group-hover:translate-x-1 transition-transform">
              Explore Quran Module <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link 
            href="/live-classes"
            className="group p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border hover:border-gold-400/60 shadow-sm transition-all hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-tarbiyah-800 text-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400">
              Virtual Live Classrooms
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              1-click entry via Zoom and Google Meet. Class schedules, countdown timers, and attendance monitoring.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-gold-600 dark:text-gold-400 gap-1 group-hover:translate-x-1 transition-transform">
              Join Live Classes <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link 
            href="/recorded-classes"
            className="group p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border hover:border-gold-400/60 shadow-sm transition-all hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-tarbiyah-950 text-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tv className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400">
              Recorded Video Vault
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              High-speed video library organized by subject and level (Beginner to Advanced) with watch history.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-gold-600 dark:text-gold-400 gap-1 group-hover:translate-x-1 transition-transform">
              Browse Videos <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link 
            href="/programs"
            className="group p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border hover:border-gold-400/60 shadow-sm transition-all hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gold-600 text-tarbiyah-950 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400">
              Programs & Events
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Manage Musabaqa, competitions, camps, workshops, and student participation registration.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-gold-600 dark:text-gold-400 gap-1 group-hover:translate-x-1 transition-transform">
              View Events & Programs <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link 
            href="/certificates"
            className="group p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border hover:border-gold-400/60 shadow-sm transition-all hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-gold-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400">
              Verifiable Certificates
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Auto-generated digital credentials with unique verification codes and QR codes, printable in PDF.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-gold-600 dark:text-gold-400 gap-1 group-hover:translate-x-1 transition-transform">
              Certificate Verification <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link 
            href="/admin"
            className="group p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border hover:border-gold-400/60 shadow-sm transition-all hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-tarbiyah-900 text-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400">
              Admin Control Panel
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Approve/reject student admissions, manage teachers, monitor attendance, export reports, and configure madrasa settings.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-gold-600 dark:text-gold-400 gap-1 group-hover:translate-x-1 transition-transform">
              Access Admin Hub <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

        </div>
      </section>

      {/* Quick Registration Banner */}
      <section className="p-5 sm:p-10 rounded-3xl bg-gradient-to-r from-tarbiyah-900 to-tarbiyah-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-gold-500/40 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
            Admissions Open {settings?.admissionYear || new Date().getFullYear()}
          </span>
          <h3 className="text-xl sm:text-3xl font-bold">
            {settings?.madrasaName ? `Join ${settings.madrasaName} Today` : 'Begin Your Journey Today'}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
            Register as a student. Our academic panel will review and verify your admission shortly.
          </p>
        </div>
        <Link
          href="/register"
          className="w-full md:w-auto text-center whitespace-nowrap px-8 py-3.5 rounded-xl font-bold text-sm bg-gold-500 hover:bg-gold-400 text-tarbiyah-950 shadow-lg transition-transform hover:scale-105"
        >
          {t.auth.registerBtn}
        </Link>
      </section>

    </div>
  );
}
