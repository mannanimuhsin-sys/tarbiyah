'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { BismillahBanner, RubElHizb } from '@/components/common/IslamicMotif';
import { 
  Phone, 
  Lock, 
  GraduationCap, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  ShieldAlert,
  Clock,
  X
} from 'lucide-react';
import { MadrasaSettings } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const { user, login, loading: authLoading } = useAuth();
  const { t } = useLanguage();

  const [settings, setSettings] = useState<MadrasaSettings | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingWarning, setPendingWarning] = useState<string | null>(null);

  // Discreet Admin Modal states
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  useEffect(() => {
    // If already logged in, route directly to appropriate portal
    if (!authLoading && user) {
      if (user.role === 'super_admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }

    // Load madrasa settings for dynamic name
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d.settings) setSettings(d.settings); })
      .catch(() => {});
  }, [user, authLoading, router]);

  // Handle Student Login
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPendingWarning(null);

    if (!mobileNumber.trim() || !password.trim()) {
      setError("ദയവായി മൊബൈൽ നമ്പറും പാസ്‌വേഡും നൽകുക.");
      return;
    }

    setLoading(true);
    const res = await login({ mobileNumber: mobileNumber.trim(), password: password.trim() });
    setLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      if (res.status === 'pending') {
        setPendingWarning("നിങ്ങളുടെ രജിസ്ട്രേഷൻ അഡ്മിൻ അപ്പ്രൂവ് ചെയ്തിട്ടില്ല. ദയവായി കാത്തിരിക്കുക.");
      } else if (res.status === 'rejected') {
        setError("നിങ്ങളുടെ അപേക്ഷ നിരസിക്കപ്പെട്ടിരിക്കുന്നു. അഡ്മിനുമായി ബന്ധപ്പെടുക.");
      } else {
        setError(res.error || "തെറ്റായ മൊബൈൽ നമ്പർ അല്ലെങ്കിൽ പാസ്‌വേഡ്.");
      }
    }
  };

  // Handle Discreet Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    if (!adminPassword.trim()) {
      setAdminError("പാസ്‌വേഡ് നൽകുക.");
      return;
    }

    setAdminLoading(true);
    const res = await login({ role: 'super_admin', username: 'admin', password: adminPassword.trim() });
    setAdminLoading(false);

    if (res.success) {
      setShowAdminModal(false);
      router.push('/admin');
    } else {
      setAdminError(res.error || "തെറ്റായ പാസ്‌വേഡ്. വീണ്ടും ശ്രമിക്കുക.");
    }
  };

  const madrasaName = settings?.madrasaName || 'നൂറുൽ ഹുദാ ഇസ്ലാമിക് മദ്റസ';

  return (
    <div className="min-h-[80vh] flex flex-col justify-between py-2 sm:py-6 max-w-md mx-auto relative px-2">
      
      {/* Top Bar: Discreet, subtle Admin button at top right - inconspicuous and understated */}
      <div className="flex items-center justify-between py-1 mb-2">
        <span className="text-[11px] text-gray-400/60 dark:text-gray-500/60 font-medium">
          Tarbiyah Portal
        </span>
        <button
          type="button"
          onClick={() => {
            setShowAdminModal(true);
            setAdminError(null);
            setAdminPassword('');
          }}
          className="text-[11px] text-gray-400 hover:text-emerald-700 dark:text-gray-500 dark:hover:text-emerald-400 transition-colors px-2 py-0.5 rounded opacity-60 hover:opacity-100 cursor-pointer"
          title="Admin"
        >
          admin
        </button>
      </div>

      <div className="space-y-4 my-auto">
        <BismillahBanner />

        {/* Main Student Login Card */}
        <div className="bg-white dark:bg-islamic-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-tarbiyah-100 dark:border-islamic-border">
          
          {/* Header & Logo */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-tarbiyah-900 to-tarbiyah-700 flex items-center justify-center shadow-lg border border-gold-400/40">
              <RubElHizb className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-tarbiyah-950 dark:text-white tracking-tight">
              {madrasaName}
            </h1>
            <p className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
              വിദ്യാർത്ഥി ലോഗിൻ (Student Login)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Pending Approval Notice */}
          {pendingWarning && (
            <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="font-bold mb-1">അഡ്മിൻ അപ്പ്രൂവൽ ആവശ്യമാണ്</p>
                <p>{pendingWarning}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleStudentLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                മൊബൈൽ നമ്പർ (Mobile Number)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  required
                  placeholder="10 അക്ക മൊബൈൽ നമ്പർ"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50/60 dark:bg-islamic-dark text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-tarbiyah-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                പാസ്‌വേഡ് (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="പാസ്‌വേഡ് നൽകുക"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50/60 dark:bg-islamic-dark text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-tarbiyah-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-tarbiyah-800 to-tarbiyah-900 hover:from-tarbiyah-700 hover:to-tarbiyah-800 text-gold-300 shadow-lg shadow-tarbiyah-900/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 border border-gold-500/20 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gold-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>ലോഗിൻ ചെയ്യുക (Login)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Small Register Link at Bottom */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-islamic-border text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              പുതിയ വിദ്യാർത്ഥിയാണോ?{' '}
              <Link
                href="/register"
                className="font-bold text-tarbiyah-800 dark:text-gold-400 hover:underline inline-flex items-center gap-1"
              >
                രജിസ്റ്റർ ചെയ്യുക (Register)
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Secret / Discreet Admin Access Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs bg-white dark:bg-islamic-card rounded-2xl p-5 shadow-2xl border border-tarbiyah-200 dark:border-islamic-border relative">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1 mb-4">
              <div className="w-10 h-10 mx-auto rounded-xl bg-tarbiyah-900 flex items-center justify-center text-gold-400 mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-tarbiyah-950 dark:text-white">
                അഡ്മിൻ പ്രവേശനം
              </h3>
              <p className="text-[11px] text-gray-500">
                തുടരാൻ പാസ്‌വേഡ് നൽകുക
              </p>
            </div>

            {adminError && (
              <div className="mb-3 p-2 rounded-lg bg-red-50 text-red-700 text-[11px] text-center font-medium border border-red-200">
                {adminError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input
                type="password"
                required
                autoFocus
                placeholder="പാസ്‌വേഡ് നൽകുക"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2.5 text-center tracking-widest text-lg rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark focus:outline-none focus:ring-2 focus:ring-tarbiyah-700 font-mono"
              />

              <button
                type="submit"
                disabled={adminLoading}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-tarbiyah-800 hover:bg-tarbiyah-700 text-gold-300 shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {adminLoading ? (
                  <div className="w-4 h-4 border-2 border-gold-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>തുടങ്ങുക</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Discreet Footer Note */}
      <div className="text-center py-2">
        <p className="text-[10px] text-gray-400">
          © {new Date().getFullYear()} {madrasaName}
        </p>
      </div>

    </div>
  );
}
