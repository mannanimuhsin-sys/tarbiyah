'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { BismillahBanner, RubElHizb } from '@/components/common/IslamicMotif';
import { LiveClass } from '@/lib/types';
import { 
  Video, 
  Clock, 
  Calendar, 
  User, 
  ExternalLink, 
  Bell, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function LiveClassesPage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminderSet, setReminderSet] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/live-classes')
      .then(res => res.json())
      .then(data => {
        if (data.classes) setClasses(data.classes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleReminder = (classId: string) => {
    if (reminderSet.includes(classId)) {
      setReminderSet(reminderSet.filter(id => id !== classId));
    } else {
      setReminderSet([...reminderSet, classId]);
      alert("Reminder enabled! You will receive an alert 15 minutes before the session starts.");
    }
  };

  return (
    <div className="space-y-8 py-4">
      <BismillahBanner />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-islamic-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-tarbiyah-950 dark:text-white flex items-center gap-2">
            <Video className="w-7 h-7 text-gold-500" />
            {t.live.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time interactive circles conducted by qualified Ustadhs via Zoom and Google Meet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Classroom Gateway
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500 text-sm">{t.common.loading}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(cls => {
            const hasReminder = reminderSet.includes(cls.id);
            const dateObj = new Date(cls.startTime);

            return (
              <div
                key={cls.id}
                className="p-6 rounded-3xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border hover:border-gold-400/60 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      cls.provider === 'zoom'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {cls.provider === 'zoom' ? 'Zoom Live' : 'Google Meet'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold-500" />
                      {cls.durationMinutes} mins
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-tarbiyah-950 dark:text-white leading-snug">
                      {cls.title}
                    </h3>
                    <p className="text-xs text-gold-600 dark:text-gold-400 font-semibold mt-1">
                      Level: {cls.level}
                    </p>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {cls.description}
                  </p>

                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-islamic-dark border border-gray-100 dark:border-islamic-border space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gold-500" />
                      <span>Ustadh: <strong>{cls.teacherName}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gold-500" />
                      <span>{dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {cls.meetingPasscode && (
                      <div className="text-[11px] text-gray-500 font-mono">
                        Passcode: <span className="font-bold">{cls.meetingPasscode}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={cls.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-tarbiyah-800 to-tarbiyah-700 hover:from-tarbiyah-700 hover:to-tarbiyah-600 text-gold-300 font-bold text-xs shadow-md border border-gold-500/30 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>{cls.provider === 'zoom' ? t.live.joinViaZoom : t.live.joinViaMeet}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => toggleReminder(cls.id)}
                    className={`p-3 rounded-xl border transition-colors ${
                      hasReminder
                        ? 'bg-gold-500 text-tarbiyah-950 border-gold-600'
                        : 'bg-gray-100 dark:bg-islamic-dark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-islamic-border'
                    }`}
                    title="Toggle class reminder"
                  >
                    <Bell className="w-4 h-4" />
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
