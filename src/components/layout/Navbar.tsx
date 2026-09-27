'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { RubElHizb } from '@/components/common/IslamicMotif';
import { 
  BookOpen, 
  Video, 
  Tv, 
  Trophy, 
  Award, 
  FileText, 
  Bell, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  CheckCircle,
  GraduationCap
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (data.notifications) setNotifications(data.notifications);
      })
      .catch(() => {});
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    notifications.forEach(n => {
      if (!n.isRead) {
        fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: n.id })
        });
      }
    });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const navLinks = [
    { href: user?.role === 'super_admin' ? '/admin' : '/dashboard', label: t.nav.dashboard, icon: GraduationCap },
    { href: '/quran-module', label: t.nav.quranModule, icon: BookOpen },
    { href: '/live-classes', label: t.nav.liveClasses, icon: Video },
    { href: '/recorded-classes', label: t.nav.recordedClasses, icon: Tv },
    { href: '/programs', label: t.nav.programs, icon: Trophy },
    { href: '/certificates', label: t.nav.certificates, icon: Award },
    { href: '/reports', label: t.nav.reports, icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-islamic-dark/90 backdrop-blur-md border-b border-tarbiyah-100 dark:border-islamic-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-tarbiyah-900 to-tarbiyah-700 dark:from-tarbiyah-800 dark:to-tarbiyah-600 flex items-center justify-center shadow-md shadow-tarbiyah-900/20 group-hover:scale-105 transition-transform duration-200 border border-gold-500/30">
              <RubElHizb className="w-7 h-7 text-gold-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight text-tarbiyah-950 dark:text-white">
                  {t.appName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold-50 dark:bg-gold-950/60 text-gold-700 dark:text-gold-400 border border-gold-300 dark:border-gold-700/50 font-semibold tracking-wide">
                  തർബിയ്യ
                </span>
              </div>
              <span className="text-[11px] font-medium text-tarbiyah-800/80 dark:text-emerald-300/70 hidden sm:block">
                {t.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-tarbiyah-100 dark:bg-tarbiyah-900/50 text-tarbiyah-900 dark:text-gold-400 font-semibold shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-islamic-card hover:text-tarbiyah-800 dark:hover:text-emerald-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-tarbiyah-700 dark:text-gold-400' : 'text-gray-500 dark:text-gray-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language, Theme, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher (EN / Malayalam) */}
            <div className="flex items-center p-1 bg-gray-100 dark:bg-islamic-card rounded-lg border border-gray-200 dark:border-islamic-border">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  language === 'en'
                    ? 'bg-tarbiyah-800 text-gold-300 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ml')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  language === 'ml'
                    ? 'bg-tarbiyah-800 text-gold-300 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
                title="മലയാളത്തിലേക്ക് മാറ്റുക"
              >
                മലയാളം
              </button>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-lg text-gray-600 dark:text-gold-400 hover:bg-gray-100 dark:hover:bg-islamic-card border border-transparent hover:border-gray-200 dark:hover:border-islamic-border transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-gold-400" /> : <Moon className="w-5 h-5 text-tarbiyah-800" />}
            </button>

            {/* In-App Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  if (!notifOpen && unreadCount > 0) markAllRead();
                }}
                className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-islamic-card transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-islamic-card shadow-2xl border border-tarbiyah-100 dark:border-islamic-border p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-islamic-border">
                    <h3 className="font-bold text-sm text-tarbiyah-950 dark:text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gold-500" />
                      {t.common.notifications}
                    </h3>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      {notifications.length} alerts
                    </span>
                  </div>
                  <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-gray-500 py-6">No notifications yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-xl bg-gray-50 dark:bg-islamic-dark/60 border border-gray-100 dark:border-islamic-border hover:border-gold-400/50 transition-colors"
                        >
                          <p className="text-xs font-bold text-tarbiyah-900 dark:text-gold-300">{n.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Session Profile / Auth Actions */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === 'super_admin' ? '/admin' : '/dashboard'}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-tarbiyah-50 dark:bg-islamic-card border border-tarbiyah-200 dark:border-islamic-border hover:border-gold-500 text-xs font-semibold text-tarbiyah-900 dark:text-gold-400 transition-all"
                >
                  {user.role === 'super_admin' ? (
                    <ShieldCheck className="w-4 h-4 text-gold-500" />
                  ) : (
                    <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title={t.nav.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-tarbiyah-900 dark:text-gold-300 hover:bg-tarbiyah-50 dark:hover:bg-islamic-card transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-tarbiyah-800 to-tarbiyah-700 text-gold-300 hover:from-tarbiyah-700 hover:to-tarbiyah-600 shadow-md shadow-tarbiyah-900/10 border border-gold-500/30 transition-all"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-islamic-card"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 space-y-2 bg-white dark:bg-islamic-dark border-b border-tarbiyah-100 dark:border-islamic-border shadow-xl">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-tarbiyah-100 dark:bg-tarbiyah-900/60 text-tarbiyah-900 dark:text-gold-400 font-bold'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 text-gold-500" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-gray-100 dark:border-islamic-border flex flex-col gap-2">
            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gray-100 dark:bg-islamic-card text-sm font-bold text-tarbiyah-900 dark:text-gold-300"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-tarbiyah-800 text-gold-300 text-sm font-bold shadow-md"
                >
                  {t.nav.register}
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-sm font-bold"
              >
                <LogOut className="w-4 h-4" />
                {t.nav.logout}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
