'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  BookOpen, 
  Video,
  Tv,
  Trophy, 
  LayoutDashboard,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !user) return null;

  const navLinks = user.role === 'super_admin'
    ? [
        { href: '/admin', label: 'Dashboard', icon: ShieldCheck },
        { href: '/quran-module', label: 'Quran', icon: BookOpen },
        { href: '/live-classes', label: 'Live', icon: Video },
        { href: '/programs', label: 'Programs', icon: Trophy },
      ]
    : [
        { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
        { href: '/quran-module', label: 'Quran', icon: BookOpen },
        { href: '/live-classes', label: 'Live', icon: Video },
        { href: '/recorded-classes', label: 'Videos', icon: Tv },
        { href: '/programs', label: 'Events', icon: Trophy },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-islamic-dark/95 backdrop-blur-xl border-t border-gray-100 dark:border-islamic-border safe-area-pb lg:hidden">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navLinks.map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl min-w-[56px] group"
            >
              <div className={`p-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-tarbiyah-800 shadow-md shadow-tarbiyah-900/20 scale-110' 
                  : 'group-active:scale-95'
              }`}>
                <Icon className={`w-5 h-5 transition-colors ${
                  isActive 
                    ? 'text-gold-300' 
                    : 'text-gray-500 dark:text-gray-400'
                }`} />
              </div>
              <span className={`text-[10px] font-semibold transition-colors ${
                isActive 
                  ? 'text-tarbiyah-800 dark:text-gold-400' 
                  : 'text-gray-500 dark:text-gray-400'
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
