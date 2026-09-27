'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Home,
  BookOpen, 
  Video,
  Tv,
  Trophy, 
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  Award,
  FileText,
  LogIn
} from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { 
    setMounted(true); 
  }, []);

  if (!mounted || !user || pathname === '/' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  const isMl = language === 'ml';

  // Determine navigation items depending on user role
  let navLinks: { href: string; label: string; icon: any }[] = [];
  if (user.role === 'super_admin') {
    // Admin Navigation
    navLinks = [
      { href: '/admin', label: isMl ? 'അഡ്മിൻ' : 'Admin', icon: ShieldCheck },
      { href: '/quran-module', label: isMl ? 'ഖുർആൻ' : 'Quran', icon: BookOpen },
      { href: '/live-classes', label: isMl ? 'ലൈവ്' : 'Live', icon: Video },
      { href: '/programs', label: isMl ? 'പ്രോഗ്രാം' : 'Programs', icon: Trophy },
      { href: '/reports', label: isMl ? 'റിപ്പോർട്ട്' : 'Reports', icon: FileText },
    ];
  } else {
    // Student / Regular User Navigation
    navLinks = [
      { href: '/dashboard', label: isMl ? 'ഹോം' : 'Home', icon: LayoutDashboard },
      { href: '/quran-module', label: isMl ? 'ഖുർആൻ' : 'Quran', icon: BookOpen },
      { href: '/live-classes', label: isMl ? 'ലൈവ്' : 'Live', icon: Video },
      { href: '/recorded-classes', label: isMl ? 'വീഡിയോ' : 'Videos', icon: Tv },
      { href: '/certificates', label: isMl ? 'സർട്ടിഫിക്കറ്റ്' : 'Degree', icon: Award },
    ];
  }

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#111b21]/95 backdrop-blur-xl border-t border-gray-200/80 dark:border-[#222e35] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden"
      style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center justify-around px-1 py-1 max-w-lg mx-auto">
        {navLinks.map(link => {
          const Icon = link.icon;
          const isActive = link.href === '/' 
            ? pathname === '/' 
            : pathname === link.href || pathname?.startsWith(link.href + '/');

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 rounded-xl group min-w-0 transition-transform active:scale-95"
            >
              {/* WhatsApp-Style Indicator Pill */}
              <div className={`px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                isActive 
                  ? 'bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400' 
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
              }`}>
                <Icon className={`w-5 h-5 transition-transform duration-200 ${
                  isActive 
                    ? 'stroke-[2.5] scale-105' 
                    : 'stroke-[1.8]'
                }`} />
              </div>

              {/* Label */}
              <span className={`text-[10px] tracking-tight truncate max-w-full transition-colors ${
                isActive 
                  ? 'font-bold text-emerald-800 dark:text-emerald-300' 
                  : 'font-medium text-gray-500 dark:text-gray-400'
              }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
