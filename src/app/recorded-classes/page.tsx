'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BismillahBanner } from '@/components/common/IslamicMotif';
import { RecordedClass, SubjectType } from '@/lib/types';
import { 
  Tv, 
  Play, 
  Eye, 
  Clock, 
  Filter, 
  CheckCircle, 
  Sparkles, 
  X,
  Share2,
  Film
} from 'lucide-react';

export default function RecordedClassesPage() {
  const { t } = useLanguage();

  const [videos, setVideos] = useState<RecordedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [activeVideo, setActiveVideo] = useState<RecordedClass | null>(null);

  useEffect(() => {
    fetch('/api/recorded-classes')
      .then(res => res.json())
      .then(data => {
        if (data.videos) setVideos(data.videos);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredVideos = videos.filter(v => {
    const matchesSubject = selectedSubject === 'all' || v.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'all' || v.level === selectedLevel;
    return matchesSubject && matchesLevel;
  });

  return (
    <div className="space-y-8 py-4">
      <BismillahBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-islamic-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-tarbiyah-950 dark:text-white flex items-center gap-2">
            <Tv className="w-7 h-7 text-gold-500" />
            {t.recorded.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.recorded.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-gold-600 dark:text-gold-400 px-3 py-1.5 rounded-full bg-gold-50 dark:bg-gold-950/60 border border-gold-200 dark:border-gold-800">
          <Film className="w-3.5 h-3.5 text-gold-500" />
          <span>Cloudflare R2 Encoded Streams</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-islamic-card p-4 rounded-2xl border border-tarbiyah-100 dark:border-islamic-border">
        {/* Subject Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-bold text-gray-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Subject:
          </span>
          {[
            { id: 'all', label: 'All Subjects' },
            { id: 'qaida', label: 'Qaida' },
            { id: 'tajweed', label: 'Tajweed' },
            { id: 'quran_reading', label: 'Recitation' },
            { id: 'hifz', label: 'Hifz' },
          ].map(sub => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedSubject === sub.id
                  ? 'bg-tarbiyah-800 text-gold-300'
                  : 'bg-gray-100 dark:bg-islamic-dark text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-bold text-gray-500 mr-2">Level:</span>
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                selectedLevel === lvl
                  ? 'bg-gold-500 text-tarbiyah-950 font-bold'
                  : 'bg-gray-100 dark:bg-islamic-dark text-gray-600 dark:text-gray-400'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-500 text-sm">{t.common.loading}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border hover:border-gold-400/60 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Thumbnail with duration & play button */}
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                {video.thumbnailUrl && (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-90"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gold-500 text-tarbiyah-950 flex items-center justify-center group-hover:scale-110 shadow-lg transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-mono">
                  {Math.floor((video.durationSeconds || 1200) / 60)} mins
                </div>

                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-tarbiyah-900/80 backdrop-blur-sm text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                  {video.level}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gold-600 dark:text-gold-400 font-semibold uppercase tracking-wider">
                  <span>{(video.subject || 'islamic_studies').replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{video.classNumber || video.teacherName || 'ക്ലാസ്'}</span>
                </div>

                <h3 className="font-bold text-sm text-tarbiyah-950 dark:text-white leading-snug group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                  {video.title}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>

                <div className="pt-2 border-t border-gray-100 dark:border-islamic-border flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {video.viewsCount} views
                  </span>
                  <span className="text-gold-600 dark:text-gold-400 font-bold group-hover:underline">
                    {t.recorded.watchNow} →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-islamic-card rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-tarbiyah-100 dark:border-islamic-border">
            
            {/* Modal Video Player */}
            <div className="relative aspect-video bg-black">
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Details */}
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gold-600 dark:text-gold-400 uppercase tracking-wider">
                  {(activeVideo.subject || 'islamic_studies').replace('_', ' ')} • {activeVideo.level || 'All Levels'}
                </span>
                <span className="text-xs text-gray-400">{activeVideo.classNumber || ''}</span>
              </div>
              <h2 className="text-xl font-bold text-tarbiyah-950 dark:text-white">
                {activeVideo.title}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {activeVideo.description}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Instructor: <strong>{activeVideo.teacherName}</strong></span>
                <button
                  onClick={() => alert("Lecture link copied to clipboard!")}
                  className="flex items-center gap-1 text-gold-600 hover:underline"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share Lecture
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
