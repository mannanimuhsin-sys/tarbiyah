'use client';

import React from 'react';
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
  GraduationCap
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="space-y-16 py-4">
      
      {/* Top Bismillah Calligraphy */}
      <BismillahBanner />

      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-tarbiyah-950 via-tarbiyah-900 to-tarbiyah-800 text-white p-8 sm:p-14 shadow-2xl border border-gold-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Islamic Education Reimagined with Modern Technology</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Learn Quran. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-200">
              Build Character.
            </span> <br />
            Grow in Faith.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
            Welcome to <strong className="text-white font-semibold">Tarbiyah (തർബിയ്യ)</strong>. A comprehensive digital madrasa platform uniting authentic Quranic scholarship, Tajweed precision, live interactive circles, and character tracking.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href={user ? (user.role === 'super_admin' ? '/admin' : '/dashboard') : '/register'}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-tarbiyah-950 shadow-lg shadow-gold-500/20 hover:scale-[1.02] transition-all"
            >
              <span>{user ? t.nav.dashboard : t.auth.registerBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/quran-module"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all"
            >
              <BookOpen className="w-4 h-4 text-gold-400" />
              <span>{t.nav.quranModule}</span>
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-xs text-gold-300/80 hover:text-gold-200 hover:underline"
            >
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Admin Portal (admin / 4321)</span>
            </Link>
          </div>
        </div>

        {/* Decorative Watermark Arch */}
        <div className="hidden lg:block absolute -bottom-10 right-10 opacity-15">
          <RubElHizb className="w-80 h-80 text-gold-300" />
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-tarbiyah-50 dark:bg-tarbiyah-900/60 flex items-center justify-center text-tarbiyah-700 dark:text-gold-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-tarbiyah-950 dark:text-white">1,240+</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Students Enrolled</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-gold-950/60 flex items-center justify-center text-gold-600 dark:text-gold-400">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-tarbiyah-950 dark:text-white">450+</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Live Classes Held</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-tarbiyah-950 dark:text-white">96.4%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Average Attendance</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-tarbiyah-950 dark:text-white">320+</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Verified Sanads</p>
          </div>
        </div>
      </section>

      {/* Six Pillars of Tarbiyah Platform */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-tarbiyah-950 dark:text-white">
            Curriculum & Learning Ecosystem
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Designed specifically for modern madrasas, students, and parents with seamless progress monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Quran Learning */}
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
              Step-by-step Qaida Nooraniyah, Quran recitation (Tilawah), Tajweed articulation points, and daily Hifz memorization & Muraja'ah tracking.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-gold-600 dark:text-gold-400 gap-1 group-hover:translate-x-1 transition-transform">
              Explore Quran Module <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 2: Live Classes */}
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
              Seamless 1-click entry via Zoom and Google Meet. Automated class schedule alerts, countdown timers, and teacher presence monitoring.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-gold-600 dark:text-gold-400 gap-1 group-hover:translate-x-1 transition-transform">
              Join Live Classes <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 3: Recorded Video Vault */}
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
              Cloudflare R2 powered high-speed video library organized by Subject and Level (Beginner to Advanced) with watch history.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-gold-600 dark:text-gold-400 gap-1 group-hover:translate-x-1 transition-transform">
              Browse Videos <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 4: Programs & Musabaqa */}
          <Link 
            href="/programs"
            className="group p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border hover:border-gold-400/60 shadow-sm transition-all hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gold-600 text-tarbiyah-950 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400">
              Musabaqa & Competitions
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              State-level Quran recitation contests, Ramadan Hifz camps, Islamic ethics symposiums, and student participation registration.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-gold-600 dark:text-gold-400 gap-1 group-hover:translate-x-1 transition-transform">
              View Events & Programs <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 5: Certificate System */}
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
              Auto-generated digital credentials with unique verification codes and QR codes, fully printable in PDF format.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-gold-600 dark:text-gold-400 gap-1 group-hover:translate-x-1 transition-transform">
              Certificate Verification <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 6: Super Admin Management */}
          <Link 
            href="/admin"
            className="group p-6 rounded-2xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border hover:border-gold-400/60 shadow-sm transition-all hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-tarbiyah-900 text-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400">
              Admin & Teacher Control
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Approve/reject student admissions, assign teachers, monitor attendance, export Excel/PDF reports, and broadcast push alerts.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-gold-600 dark:text-gold-400 gap-1 group-hover:translate-x-1 transition-transform">
              Access Admin Hub <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

        </div>
      </section>

      {/* Quick Registration Banner */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-tarbiyah-900 to-tarbiyah-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-gold-500/40 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
            Admissions Open 2026
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold">
            Begin Your Quran & Character Journey Today
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
            Register as a student with your personal and guardian information. Our academic panel will review and verify your admission within 24 hours.
          </p>
        </div>
        <Link
          href="/register"
          className="whitespace-nowrap px-8 py-3.5 rounded-xl font-bold text-sm bg-gold-500 hover:bg-gold-400 text-tarbiyah-950 shadow-lg transition-transform hover:scale-105"
        >
          {t.auth.registerBtn}
        </Link>
      </section>

    </div>
  );
}
