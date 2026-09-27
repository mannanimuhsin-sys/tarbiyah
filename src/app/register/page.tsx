'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { BismillahBanner, RubElHizb } from '@/components/common/IslamicMotif';
import { 
  User, 
  Phone, 
  Lock, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    password: '',
    gender: 'male',
    age: '',
    address: '',
    parentName: '',
    parentMobile: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Basic validation
    if (!formData.fullName || !formData.mobileNumber || !formData.password || !formData.age || !formData.address || !formData.parentName || !formData.parentMobile) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    const res = await register({
      ...formData,
      age: parseInt(formData.age, 10),
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to register.");
    } else {
      setSuccessMsg(res.message || t.registration.successMsg);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10">
      <BismillahBanner />

      <div className="bg-white dark:bg-islamic-card rounded-3xl p-6 sm:p-10 shadow-2xl border border-tarbiyah-100 dark:border-islamic-border">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-tarbiyah-50 dark:bg-tarbiyah-900/60 flex items-center justify-center border border-gold-500/30">
            <RubElHizb className="w-7 h-7 text-gold-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-tarbiyah-950 dark:text-white">
            {t.registration.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {t.registration.subtitle}
          </p>

          {/* Registration Rules Notice */}
          <div className="mt-4 p-3.5 rounded-xl bg-gold-50/80 dark:bg-gold-950/40 border border-gold-200 dark:border-gold-800/60 text-left flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
            <div className="text-xs text-gold-900 dark:text-gold-200 space-y-1">
              <p className="font-bold">Important Enrollment Rules:</p>
              <ul className="list-disc list-inside space-y-0.5 text-gold-800/90 dark:text-gold-300">
                <li>One mobile number can register only once. Mobile numbers must be unique.</li>
                <li>Registration status is <strong>Pending</strong> by default.</li>
                <li>Student cannot login until application is approved by the Super Admin.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <p className="font-bold text-sm">Application Received!</p>
                <p className="text-xs">{successMsg}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Status: Pending Verification</span>
              <Link
                href="/login"
                className="text-xs font-bold text-emerald-800 dark:text-gold-400 hover:underline inline-flex items-center gap-1"
              >
                Go to Login <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Student Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                {t.registration.fullName} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Zayd Muhammad"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50/50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600 dark:focus:ring-gold-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Mobile Number & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  {t.registration.mobile} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={formData.mobileNumber}
                    onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50/50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600 dark:focus:ring-gold-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  {t.auth.password} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50/50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600 dark:focus:ring-gold-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Gender & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  {t.registration.gender} *
                </label>
                <div className="flex gap-4 p-1 rounded-xl bg-gray-50 dark:bg-islamic-dark border border-gray-200 dark:border-islamic-border">
                  <label className="flex-1 flex items-center justify-center gap-2 py-2 cursor-pointer text-xs font-bold rounded-lg transition-colors has-[:checked]:bg-tarbiyah-800 has-[:checked]:text-gold-300">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={() => setFormData({ ...formData, gender: 'male' })}
                      className="hidden"
                    />
                    <span>{t.registration.male}</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 py-2 cursor-pointer text-xs font-bold rounded-lg transition-colors has-[:checked]:bg-tarbiyah-800 has-[:checked]:text-gold-300">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={() => setFormData({ ...formData, gender: 'female' })}
                      className="hidden"
                    />
                    <span>{t.registration.female}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  {t.registration.age} *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="number"
                    min="4"
                    max="99"
                    required
                    placeholder="e.g. 11"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50/50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600 dark:focus:ring-gold-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                {t.registration.address} *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <textarea
                  required
                  rows={2}
                  placeholder="House name, street, locality, district"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50/50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600 dark:focus:ring-gold-500 text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>

            {/* Parent Details */}
            <div className="pt-2 border-t border-gray-100 dark:border-islamic-border space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                Parent / Guardian Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.registration.parentName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Farooq"
                    value={formData.parentName}
                    onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50/50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600 dark:focus:ring-gold-500 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.registration.parentMobile} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Parent mobile number"
                    value={formData.parentMobile}
                    onChange={e => setFormData({ ...formData, parentMobile: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50/50 dark:bg-islamic-dark text-sm focus:outline-none focus:ring-2 focus:ring-tarbiyah-600 dark:focus:ring-gold-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-tarbiyah-800 to-tarbiyah-700 hover:from-tarbiyah-700 hover:to-tarbiyah-600 text-gold-300 font-bold text-sm shadow-xl shadow-tarbiyah-900/20 border border-gold-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? t.common.loading : t.registration.submit}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Bottom link to login */}
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
              <Link href="/login" className="text-tarbiyah-800 dark:text-gold-400 font-bold hover:underline">
                {t.auth.alreadyRegistered}
              </Link>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
