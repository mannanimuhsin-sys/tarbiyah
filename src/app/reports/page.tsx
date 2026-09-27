'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { BismillahBanner } from '@/components/common/IslamicMotif';
import { ProgressReport, Student } from '@/lib/types';
import { 
  FileText, 
  Printer, 
  TrendingUp, 
  Calendar, 
  Award, 
  CheckCircle2, 
  BarChart2, 
  User,
  Download
} from 'lucide-react';

export default function ReportsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-001');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        if (data.students) {
          setStudents(data.students);
          if (user && user.role === 'student') {
            setSelectedStudentId(user.id);
          }
        }
      })
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (selectedStudentId) {
      setLoading(true);
      fetch(`/api/reports?studentId=${selectedStudentId}`)
        .then(res => res.json())
        .then(data => setReportData(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedStudentId]);

  const handlePrint = () => {
    window.print();
  };

  const student = reportData?.student;
  const report = reportData?.report;

  return (
    <div className="space-y-8 py-4">
      
      <div className="no-print">
        <BismillahBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-islamic-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-tarbiyah-950 dark:text-white flex items-center gap-2">
              <FileText className="w-7 h-7 text-gold-500" />
              {t.nav.reports}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Comprehensive student progress reports, monthly attendance evaluations, and academic standing.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tarbiyah-800 text-gold-300 font-bold text-xs hover:bg-tarbiyah-700 shadow-md border border-gold-500/30 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report (PDF)</span>
          </button>
        </div>

        {/* Student Selector (If Admin or switching) */}
        {user?.role === 'super_admin' && (
          <div className="bg-white dark:bg-islamic-card p-4 rounded-2xl border border-tarbiyah-100 dark:border-islamic-border flex items-center gap-4">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Select Student for Report:
            </span>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-islamic-border bg-gray-50 dark:bg-islamic-dark text-xs font-bold w-full sm:w-80"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.mobileNumber})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Printable Report Document */}
      <div className="bg-white dark:bg-islamic-card rounded-3xl p-8 sm:p-12 shadow-xl border border-tarbiyah-100 dark:border-islamic-border space-y-8 max-w-4xl mx-auto">
        
        {/* Report Top Header */}
        <div className="border-b-2 border-tarbiyah-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-arabic text-xl text-gold-600 dark:text-gold-400 font-bold block">
              تَرْبِيَّة - الأَكَادِيمِيَّةُ الإِسْلَامِيَّةُ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-tarbiyah-950 dark:text-white">
              Tarbiyah Islamic Academy
            </h2>
            <p className="text-xs text-gray-500">Student Academic & Spiritual Character Progress Evaluation</p>
          </div>

          <div className="text-right text-xs space-y-1">
            <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold inline-block border border-emerald-300">
              Evaluation: September 2026
            </div>
            <p className="text-gray-400 font-mono text-[11px]">Report ID: REP-2026-09-{selectedStudentId}</p>
          </div>
        </div>

        {/* Student Info Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-islamic-dark border border-gray-200 dark:border-islamic-border text-xs">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Student Name</span>
            <span className="font-extrabold text-sm text-tarbiyah-950 dark:text-white">{student?.fullName || "Zayd Muhammad"}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Registration / Mobile</span>
            <span className="font-mono font-semibold">{student?.mobileNumber || "9876543210"}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Curriculum Level</span>
            <span className="font-semibold text-gold-600 dark:text-gold-400">{student?.currentLevel || "Intermediate"}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Parent / Guardian</span>
            <span className="font-semibold">{student?.parentName || "Muhammad Farooq"}</span>
          </div>
        </div>

        {/* Performance Metrics Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-tarbiyah-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-gold-500" />
            Curriculum Marks & Performance Metrics
          </h3>

          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-islamic-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-islamic-dark text-gray-600 dark:text-gray-400 uppercase font-bold">
                <tr>
                  <th className="p-3.5">Subject Area</th>
                  <th className="p-3.5">Evaluation Metric</th>
                  <th className="p-3.5">Score / Progress</th>
                  <th className="p-3.5">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-islamic-border">
                <tr>
                  <td className="p-3.5 font-bold">Monthly Class Attendance</td>
                  <td className="p-3.5 text-gray-500">Live Zoom & Meet Sessions</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-600">{report?.attendanceRate || 94.5}%</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Mumtaz (A+)</span></td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Tajweed al-Quran Precision</td>
                  <td className="p-3.5 text-gray-500">Makharij & Noon Sakinah Rules</td>
                  <td className="p-3.5 font-mono font-bold text-tarbiyah-800 dark:text-gold-300">{report?.tajweedScore || 92} / 100</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Mumtaz (A+)</span></td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Qaida Nooraniyah Mastery</td>
                  <td className="p-3.5 text-gray-500">Phonetics and Letter Joining</td>
                  <td className="p-3.5 font-mono font-bold text-tarbiyah-800 dark:text-gold-300">{report?.qaidaProgress || 100}% Completed</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-800 text-[10px] font-bold">Certified</span></td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Hifz Memorization & Muraja'ah</td>
                  <td className="p-3.5 text-gray-500">Daily Dawn Revision Session</td>
                  <td className="p-3.5 font-semibold text-gray-700 dark:text-gray-300">
                    {student?.hifzJuzCompleted || 6} Ajza' Memorized
                  </td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Jayyid Jiddan</span></td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Islamic Adab & Character (Akhlaq)</td>
                  <td className="p-3.5 text-gray-500">Teacher and Peer Interaction</td>
                  <td className="p-3.5 font-semibold text-emerald-600">Exemplary Conduct</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">Excellence</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Teacher Qualitative Remarks */}
        <div className="p-5 rounded-2xl bg-gold-50/50 dark:bg-gold-950/30 border border-gold-200 dark:border-gold-800 space-y-2">
          <span className="text-xs font-bold text-gold-900 dark:text-gold-300 uppercase tracking-wider block">
            Ustadh Observation & Spiritual Recommendation:
          </span>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
            "{report?.teacherNotes || "Zayd demonstrates remarkable diligence in his daily Muraja'ah. His recitation of Surah Al-Kahf was clear with accurate Madd. We recommend entering him into the State Musabaqa under the 5 Juz category."}"
          </p>
          <div className="pt-2 text-[11px] font-bold text-gold-800 dark:text-gold-400 flex items-center justify-between">
            <span>Teacher: Ustadh Abdullah Al-Azhari</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Official Signatures */}
        <div className="pt-8 border-t border-gray-200 dark:border-islamic-border grid grid-cols-2 text-center text-xs">
          <div className="space-y-1">
            <div className="font-serif italic text-base font-bold text-tarbiyah-950 dark:text-white">Ustadh Abdullah Al-Azhari</div>
            <div className="h-0.5 w-32 bg-gray-300 mx-auto" />
            <span className="text-gray-400 text-[10px] uppercase font-bold">Head of Quran Department</span>
          </div>
          <div className="space-y-1">
            <div className="font-serif italic text-base font-bold text-tarbiyah-950 dark:text-white">Dr. Salih Al-Madani</div>
            <div className="h-0.5 w-32 bg-gray-300 mx-auto" />
            <span className="text-gray-400 text-[10px] uppercase font-bold">Madrasa Principal</span>
          </div>
        </div>

      </div>

    </div>
  );
}
