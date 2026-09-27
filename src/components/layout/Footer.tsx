'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { RubElHizb } from '@/components/common/IslamicMotif';
import { ShieldCheck, Heart, Sparkles, BookOpen, Layers } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-tarbiyah-100 dark:border-islamic-border bg-white dark:bg-islamic-dark transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hadith Quote Box */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-tarbiyah-900 via-tarbiyah-800 to-tarbiyah-950 text-white shadow-xl border border-gold-500/30 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gold-500/10 blur-2xl" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-2">
            <span className="font-arabic text-xl sm:text-2xl text-gold-300 font-bold block">
              خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
            </span>
            <p className="text-sm sm:text-base font-medium text-emerald-100 italic">
              "The best of you are those who learn the Quran and teach it to others."
            </p>
            <span className="text-xs text-gold-400 font-semibold tracking-wider uppercase block">
              — Sahih al-Bukhari 5027
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tarbiyah-900 flex items-center justify-center border border-gold-500/40">
                <RubElHizb className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-tarbiyah-950 dark:text-white">
                  {t.appName}
                </span>
                <span className="ml-2 text-xs font-bold text-gold-600 dark:text-gold-400">
                  തർബിയ്യ
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
              {t.tagline} A premium modern Islamic education management platform delivering holistic Quranic study, Tajweed precision, daily attendance tracking, and character formation.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                PWA Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gold-50 dark:bg-gold-950/60 text-gold-700 dark:text-gold-300 border border-gold-200 dark:border-gold-800">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                Cloudflare R2 Video CDN
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                Supabase / PostgreSQL
              </span>
            </div>
          </div>

          {/* Quick Modules */}
          <div>
            <h4 className="text-sm font-bold text-tarbiyah-950 dark:text-white uppercase tracking-wider mb-4">
              Curriculum Modules
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/quran-module" className="hover:text-gold-600 transition-colors">Qaida Nooraniyah</Link></li>
              <li><Link href="/quran-module" className="hover:text-gold-600 transition-colors">Tajweed al-Quran</Link></li>
              <li><Link href="/quran-module" className="hover:text-gold-600 transition-colors">Hifz & Muraja'ah Circle</Link></li>
              <li><Link href="/live-classes" className="hover:text-gold-600 transition-colors">Live Interactive Hall</Link></li>
              <li><Link href="/recorded-classes" className="hover:text-gold-600 transition-colors">Recorded Video Vault</Link></li>
            </ul>
          </div>

          {/* Portals & Security */}
          <div>
            <h4 className="text-sm font-bold text-tarbiyah-950 dark:text-white uppercase tracking-wider mb-4">
              Portals & Verification
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/admin" className="hover:text-gold-600 transition-colors">Super Admin Dashboard</Link></li>
              <li><Link href="/dashboard" className="hover:text-gold-600 transition-colors">Student Study Hub</Link></li>
              <li><Link href="/certificates" className="hover:text-gold-600 transition-colors">Certificate QR Verification</Link></li>
              <li><Link href="/reports" className="hover:text-gold-600 transition-colors">Performance Reports</Link></li>
              <li><Link href="/programs" className="hover:text-gold-600 transition-colors">Musabaqa & Competitions</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-islamic-border flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Tarbiyah Islamic Education. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for Quranic Excellence
          </p>
        </div>

      </div>
    </footer>
  );
}
