'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { BismillahBanner, RubElHizb } from '@/components/common/IslamicMotif';
import { Program } from '@/lib/types';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  ArrowRight,
  Gift
} from 'lucide-react';

export default function ProgramsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [participated, setParticipated] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.programs) setPrograms(data.programs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleParticipate = async (programId: string) => {
    if (!user) {
      alert("Please login as a student to register for programs.");
      return;
    }

    const res = await fetch('/api/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'participate', programId, studentId: user.id })
    });

    if (res.ok) {
      setParticipated([...participated, programId]);
      alert("Alhamdulillah! You have successfully registered for this event.");
    }
  };

  const filteredPrograms = activeTab === 'all' 
    ? programs 
    : programs.filter(p => p.category === activeTab);

  return (
    <div className="space-y-8 py-4">
      <BismillahBanner />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-islamic-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-tarbiyah-950 dark:text-white flex items-center gap-2">
            <Trophy className="w-7 h-7 text-gold-500" />
            {t.nav.programs}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Islamic competitions, Musabaqa recitation events, and annual spiritual camps.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-islamic-card rounded-2xl border border-gray-200 dark:border-islamic-border overflow-x-auto w-full sm:w-auto">
          {['all', 'Musabaqa', 'Islamic Competition', 'Annual Program'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                activeTab === cat
                  ? 'bg-tarbiyah-800 text-gold-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              {cat === 'all' ? 'All Events' : cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500 text-sm">{t.common.loading}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPrograms.map(prog => {
            const isReg = (prog.registeredStudentIds && user && prog.registeredStudentIds.includes(user.id)) || participated.includes(prog.id);

            return (
              <div
                key={prog.id}
                className="p-6 rounded-3xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border hover:border-gold-400/60 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-gold-50 dark:bg-gold-950/80 text-gold-800 dark:text-gold-300 text-[10px] font-bold uppercase tracking-wider border border-gold-300 dark:border-gold-800">
                      {prog.category}
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {(prog.registeredStudentIds?.length || 0) + (participated.includes(prog.id) ? 1 : 0)} Enrolled
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-tarbiyah-950 dark:text-white leading-snug">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="space-y-1.5 pt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-islamic-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                      <span>{new Date(prog.startDate).toLocaleDateString()} to {new Date(prog.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                      <span>{prog.venueOrLink}</span>
                    </div>
                    {prog.rewards && (
                      <div className="flex items-start gap-2 pt-1 text-gold-700 dark:text-gold-300 font-semibold">
                        <Gift className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                        <span>Awards: {prog.rewards}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleParticipate(prog.id)}
                    disabled={isReg}
                    className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                      isReg
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-gradient-to-r from-tarbiyah-800 to-tarbiyah-700 hover:from-tarbiyah-700 text-gold-300 border border-gold-500/30'
                    }`}
                  >
                    {isReg ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Registered for Event</span>
                      </>
                    ) : (
                      <>
                        <span>Register to Participate</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
