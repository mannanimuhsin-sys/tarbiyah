'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BismillahBanner, RubElHizb } from '@/components/common/IslamicMotif';
import { Certificate } from '@/lib/types';
import { 
  Award, 
  Printer, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  QrCode,
  Download
} from 'lucide-react';

export default function CertificatesPage() {
  const { t } = useLanguage();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [searchCode, setSearchCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<Certificate | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/certificates')
      .then(res => res.json())
      .then(data => {
        if (data.certificates) {
          setCertificates(data.certificates);
          if (data.certificates.length > 0) {
            setSelectedCert(data.certificates[0]);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode) return;
    setVerifyError(null);
    setVerifyResult(null);

    const res = await fetch(`/api/certificates?code=${encodeURIComponent(searchCode.trim())}`);
    const data = await res.json();

    if (res.ok && data.certificate) {
      setVerifyResult(data.certificate);
      setSelectedCert(data.certificate);
    } else {
      setVerifyError(data.error || "No valid certificate found with this verification code.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 py-4">
      <div className="no-print">
        <BismillahBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-islamic-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-tarbiyah-950 dark:text-white flex items-center gap-2">
              <Award className="w-7 h-7 text-gold-500" />
              {t.certificates.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Cryptographically verified credentials issued under Tarbiyah Islamic Education Curriculum.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tarbiyah-800 text-gold-300 font-bold text-xs hover:bg-tarbiyah-700 shadow-md border border-gold-500/30 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{t.certificates.downloadPdf}</span>
          </button>
        </div>

        {/* Verification Search Bar */}
        <div className="bg-white dark:bg-islamic-card p-4 rounded-2xl border border-tarbiyah-100 dark:border-islamic-border shadow-sm">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Certificate Serial or Verification Code (e.g. TRB-VERIF-987654-ZM)"
                value={searchCode}
                onChange={e => setSearchCode(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-islamic-dark border border-gray-200 dark:border-islamic-border text-xs focus:outline-none focus:ring-2 focus:ring-tarbiyah-600"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gold-500 text-tarbiyah-950 text-xs font-bold hover:bg-gold-400 transition-colors whitespace-nowrap"
            >
              Verify Credential
            </button>
          </form>

          {verifyError && (
            <p className="text-xs text-red-600 mt-2 font-medium">{verifyError}</p>
          )}

          {verifyResult && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verified Authentic Certificate for {verifyResult.studentName}
              </span>
              <span className="font-mono text-[11px]">{verifyResult.certificateNumber}</span>
            </div>
          )}
        </div>

        {/* Certificate Selector Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {certificates.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCert(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCert?.id === c.id
                  ? 'bg-tarbiyah-900 text-gold-300 border-gold-500 shadow-md'
                  : 'bg-white dark:bg-islamic-card border-gray-200 dark:border-islamic-border text-gray-700 dark:text-gray-300'
              }`}
            >
              {c.studentName} - {c.certificateNumber}
            </button>
          ))}
        </div>
      </div>

      {/* CERTIFICATE DISPLAY FRAME (PREMIUM ISLAMIC ORNAMENT) */}
      {selectedCert && (
        <div className="certificate-frame bg-gradient-to-br from-[#fdfbf7] to-[#f4ede1] text-gray-900 rounded-3xl p-8 sm:p-14 shadow-2xl border-[12px] border-double border-gold-600 relative overflow-hidden max-w-4xl mx-auto my-4 select-text">
          
          {/* Subtle Arabesque Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <RubElHizb className="w-[500px] h-[500px] text-tarbiyah-950" />
          </div>

          <div className="relative z-10 text-center space-y-6">
            
            {/* Top Bismillah Calligraphy */}
            <div className="space-y-1">
              <span className="font-arabic text-2xl sm:text-3xl text-gold-700 font-bold block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <span className="text-[11px] uppercase tracking-widest text-emerald-900 font-bold">
                Tarbiyah Academy for Quranic Sciences & Islamic Character
              </span>
            </div>

            {/* Certificate Header */}
            <div className="space-y-2 pt-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-tarbiyah-900 text-gold-400 flex items-center justify-center shadow-lg border-2 border-gold-400">
                <RubElHizb className="w-10 h-10" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-serif text-tarbiyah-950 tracking-wide uppercase pt-1">
                Certificate of Excellence
              </h2>
              <span className="text-xs uppercase tracking-widest text-gold-700 font-bold block">
                شهادة تقدير وإجازة
              </span>
            </div>

            {/* Recipient */}
            <div className="space-y-2 py-4">
              <p className="text-xs uppercase tracking-wider text-gray-600 font-medium">
                {t.certificates.issuedTo}
              </p>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-tarbiyah-950 underline decoration-gold-500 underline-offset-8">
                {selectedCert.studentName}
              </h3>
              <p className="text-xs text-gray-600 pt-2 max-w-xl mx-auto leading-relaxed">
                {t.certificates.reason}:
              </p>
              <p className="text-lg sm:text-xl font-bold text-tarbiyah-900 font-serif">
                "{selectedCert.courseOrAchievement}"
              </p>
              <div className="inline-block px-4 py-1 rounded-full bg-gold-100 border border-gold-400 text-gold-900 text-xs font-bold mt-2">
                Honors Grade: {selectedCert.grade}
              </div>
            </div>

            {/* Signatures & QR Code */}
            <div className="pt-8 border-t-2 border-gold-300 grid grid-cols-3 items-end text-xs">
              
              {/* Principal Signature */}
              <div className="text-center space-y-1">
                <div className="font-serif italic text-lg text-tarbiyah-950 font-bold">
                  Dr. Salih Al-Madani
                </div>
                <div className="h-0.5 w-32 bg-gray-400 mx-auto" />
                <p className="text-[11px] text-gray-600 uppercase font-bold">Principal & Chief Ustadh</p>
              </div>

              {/* Center Verification QR Code */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="p-2 rounded-xl bg-white border-2 border-gold-600 shadow-md">
                  {/* Embedded SVG QR Symbol */}
                  <svg className="w-16 h-16 text-tarbiyah-950" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h2v4h-2v-4zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h4v2h-4v-2zm0 6h4v2h-4v-2z" />
                  </svg>
                </div>
                <span className="font-mono text-[9px] text-gray-500 font-bold block">
                  {selectedCert.verificationCode}
                </span>
                <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider">
                  ✓ Verified Authentic
                </span>
              </div>

              {/* Head of Academic Board */}
              <div className="text-center space-y-1">
                <div className="font-serif italic text-lg text-tarbiyah-950 font-bold">
                  Ustadh Abdullah Al-Azhari
                </div>
                <div className="h-0.5 w-32 bg-gray-400 mx-auto" />
                <p className="text-[11px] text-gray-600 uppercase font-bold">Chairman, Academic Board</p>
              </div>

            </div>

            {/* Serial & Date */}
            <div className="pt-4 flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <span>Serial: {selectedCert.certificateNumber}</span>
              <span>Issue Date: {new Date(selectedCert.issueDate).toLocaleDateString()}</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
