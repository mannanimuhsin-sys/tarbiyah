'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { BismillahBanner, RubElHizb } from '@/components/common/IslamicMotif';
import { 
  Phone, 
  Lock, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  AlertCircle, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [mobileNumber, setMobileNumber] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingWarning, setPendingWarning] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPendingWarning(null);
    setLoading(true);

    if (activeTab === 'student') {
      const res = await login({ mobileNumber, password });
      setLoading(false);
      if (res.success) {
        router.push('/dashboard');
      } else {
        if (res.status === 'pending') {
          setPendingWarning(res.error || t.auth.pendingApprovalNotice);
        } else {
          setError(res.error || "Login failed");
        }
      }
    } else {
      const res = await login({ role: 'super_admin', username, password });
      setLoading(false);
      if (res.success) {
        router.push('/admin');
      } else {
        setError(res.error || "Invalid Admin Credentials");
      }
    }
  };

  const setDemoCredentials = (role: 'approved_student' | 'pending_student' | 'admin') => {
    setError(null);
    setPendingWarning(null);
    if (role === 'admin') {
      setActiveTab('admin');
      setUsername('admin');
      setPassword('4321');
    } else if (role === 'approved_student') {
      setActiveTab('student');
      setMobileNumber('9876543210'); // Zayd Muhammad (Approved)
      setPassword('password123');
    } else if (role === 'pending_student') {
      setActiveTab('student');
      setMobileNumber('9876543230'); // Ahmad Rayan (Pending)
      setPassword('password123');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <BismillahBanner />

      <div className="bg-white dark:bg-islamic-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-tarbiyah-100 dark:border-islamic-border">
        
        {/* Tab Switcher */}
        <div className="flex p-1 bg-gray-100 dark:bg-islamic-dark rounded-2xl mb-6 border border-gray-200 dark:border-islamic-border">
          <button
            type="button"
            onClick={() => { setActiveTab('student'); setError(null); setPendingWarning(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'student'
                ? 'bg-tarbiyah-800 text-gold-300 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t.auth.studentLogin}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setError(null); setPendingWarning(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'admin'
                ? 'bg-tarbiyah-800 text-gold-300 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>{t.auth.adminLogin}</span>
          </button>
        </div>

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-tarbiyah-950 dark:text-white">
            {activeTab === 'student' ? "Welcome Back, Student" : "Super Admin Sign In"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {activeTab === 'student' 
              ? "Access your Quran progress, live circles, and reports" 
              : "Manage students, admissions, attendance, and curriculum"}
          </p>
        </div>

        {/* Pending Warning Banner */}
        {pendingWarning && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
            <div className="flex items-start gap-2.5">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Account Status: Pending Approval</p>
                <p className="mt-1 leading-relaxed">{pendingWarning}</p>
              </div>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 italic pt-1 border-t border-amber-200 dark:border-amber-800">
              * The Principal or Admin approves new registrations daily. You will be able to log in once your application is approved.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {activeTab === 'student' ? (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.auth.mobileNumber}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50/50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.auth.username}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50/50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t.auth.password}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50/50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-tarbiyah-800 to-tarbiyah-700 hover:from-tarbiyah-700 hover:to-tarbiyah-600 text-gold-300 font-bold text-sm shadow-lg border border-gold-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? t.common.loading : t.auth.loginBtn}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-islamic-border space-y-2">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            Quick Demo Autofill:
          </p>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="text-left px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-islamic-dark hover:bg-gold-50 dark:hover:bg-gold-950/40 text-xs text-tarbiyah-900 dark:text-gold-300 border border-gray-200 dark:border-islamic-border flex items-center justify-between"
            >
              <span>🔑 <strong>Admin:</strong> admin / 4321</span>
              <span className="text-[10px] text-gray-400">Click to fill</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('approved_student')}
              className="text-left px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-islamic-dark hover:bg-gold-50 dark:hover:bg-gold-950/40 text-xs text-tarbiyah-900 dark:text-gold-300 border border-gray-200 dark:border-islamic-border flex items-center justify-between"
            >
              <span>🎓 <strong>Approved Student:</strong> 9876543210</span>
              <span className="text-[10px] text-gray-400">Click to fill</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('pending_student')}
              className="text-left px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-islamic-dark hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs text-amber-800 dark:text-amber-300 border border-gray-200 dark:border-islamic-border flex items-center justify-between"
            >
              <span>⏳ <strong>Pending Student:</strong> 9876543230</span>
              <span className="text-[10px] text-gray-400">Test Pending Rule</span>
            </button>
          </div>
        </div>

        {/* Link to Register */}
        <div className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
          {t.auth.dontHaveAccount}{' '}
          <Link href="/register" className="font-bold text-tarbiyah-800 dark:text-gold-400 hover:underline">
            {t.auth.registerBtn}
          </Link>
        </div>

      </div>
    </div>
  );
}
