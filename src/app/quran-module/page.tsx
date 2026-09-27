'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BismillahBanner, RubElHizb } from '@/components/common/IslamicMotif';
import { 
  BookOpen, 
  Volume2, 
  CheckCircle, 
  Sparkles, 
  Flame, 
  Bookmark, 
  Layers, 
  Play, 
  Award,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export default function QuranModulePage() {
  const { t } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<'reading' | 'qaida' | 'tajweed' | 'hifz'>('reading');
  const [selectedSurahIndex, setSelectedSurahIndex] = useState(0);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [hifzCompletedJuz, setHifzCompletedJuz] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  const surahs = [
    {
      number: 1,
      name: "Al-Fatihah",
      arabicName: "الفاتحة",
      meaning: "The Opening",
      versesCount: 7,
      verses: [
        { num: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
        { num: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "[All] praise is [due] to Allah, Lord of the worlds -" },
        { num: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "The Entirely Merciful, the Especially Merciful," },
        { num: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", translation: "Sovereign of the Day of Recompense." },
        { num: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "It is You we worship and You we ask for help." },
        { num: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Guide us to the straight path -" },
        { num: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." }
      ]
    },
    {
      number: 67,
      name: "Al-Mulk",
      arabicName: "الملك",
      meaning: "The Sovereignty",
      versesCount: 30,
      verses: [
        { num: 1, arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", translation: "Blessed is He in whose hand is dominion, and He is over all things competent -" },
        { num: 2, arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", translation: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -" },
        { num: 3, arabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ", translation: "[And] who created seven heavens in layers. You see not in the creation of the Most Merciful any inconsistency." }
      ]
    },
    {
      number: 112,
      name: "Al-Ikhlas",
      arabicName: "الإخلاص",
      meaning: "The Sincerity",
      versesCount: 4,
      verses: [
        { num: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Say, 'He is Allah, [who is] One,'" },
        { num: 2, arabic: "اللَّهُ الصَّمَدُ", translation: "Allah, the Eternal Refuge." },
        { num: 3, arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "He neither begets nor is born," },
        { num: 4, arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translation: "Nor is there to Him any equivalent." }
      ]
    }
  ];

  const qaidaLetters = [
    { letter: "ا", name: "Alif", sound: "Ah" },
    { letter: "ب", name: "Baa", sound: "Ba" },
    { letter: "ت", name: "Taa", sound: "Ta" },
    { letter: "ث", name: "Thaa", sound: "Tha" },
    { letter: "ج", name: "Jeem", sound: "Ja" },
    { letter: "ح", name: "Haa", sound: "Ha" },
    { letter: "خ", name: "Khaa", sound: "Kha" },
    { letter: "د", name: "Daal", sound: "Da" },
    { letter: "ذ", name: "Zhaal", sound: "Zha" },
    { letter: "ر", name: "Raa", sound: "Ra" },
    { letter: "ز", name: "Zay", sound: "Za" },
    { letter: "س", name: "Seen", sound: "Sa" },
    { letter: "ش", name: "Sheen", sound: "Sha" },
    { letter: "ص", name: "Saad", sound: "Saw" },
    { letter: "ض", name: "Daad", sound: "Daw" },
    { letter: "ط", name: "Taw", sound: "Taw" },
  ];

  const tajweedRules = [
    {
      title: "Izhar Halqi (Clear Pronunciation)",
      definition: "Pronouncing the Noon Sakinah or Tanween distinctly when followed by throat letters (ء, هـ, ع, ح, غ, خ).",
      example: "مَنْ آمَنَ (Man Aamana), أَنْعَمْتَ (An'amta)",
      color: "border-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
    },
    {
      title: "Idgham (Merging with/without Ghunnah)",
      definition: "Merging Noon Sakinah into the following letter from (ي, ر, م, ل, و, ن - Yarmaloon).",
      example: "مَن يَقُولُ (May-yaqool), مِن رَّبِّهِمْ (Mir-rabbihim)",
      color: "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
    },
    {
      title: "Iqlab (Conversion to Meem)",
      definition: "Converting Noon Sakinah or Tanween into a light 'Meem' with nasal humming when followed by Baa (ب).",
      example: "مِن بَعْدِ (Mim-ba'di), سَمِيعٌ بَصِيرٌ (Samee'um-Baseer)",
      color: "border-amber-400 bg-amber-50/50 dark:bg-amber-950/20"
    },
    {
      title: "Ikhfa Haqiqi (Concealment with Ghunnah)",
      definition: "Pronouncing between Izhar and Idgham with 2 harakah nasalization for the 15 Ikhfa letters.",
      example: "مِن قَبْلِ (Ming-qabli), كُنتُمْ (Kuntum)",
      color: "border-purple-400 bg-purple-50/50 dark:bg-purple-950/20"
    }
  ];

  const currentSurah = surahs[selectedSurahIndex];

  const toggleJuz = (juzNumber: number) => {
    if (hifzCompletedJuz.includes(juzNumber)) {
      setHifzCompletedJuz(hifzCompletedJuz.filter(j => j !== juzNumber));
    } else {
      setHifzCompletedJuz([...hifzCompletedJuz, juzNumber]);
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      <BismillahBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-islamic-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-tarbiyah-950 dark:text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-gold-500" />
            {t.quran.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Comprehensive Quranic syllabus: Qaida foundation, Tilawah reading, Tajweed mastery, and Hifz tracking.
          </p>
        </div>

        {/* Sub-module Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-islamic-card rounded-2xl border border-gray-200 dark:border-islamic-border overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'reading', label: t.quran.quranReading },
            { id: 'qaida', label: t.quran.qaida },
            { id: 'tajweed', label: t.quran.tajweed },
            { id: 'hifz', label: t.quran.hifz },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-tarbiyah-800 text-gold-300 shadow-sm border border-gold-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: QURAN READING (TILAWAH) */}
      {activeSubTab === 'reading' && (
        <div className="space-y-6">
          
          {/* Surah Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {surahs.map((s, idx) => (
              <button
                key={s.number}
                onClick={() => setSelectedSurahIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold transition-all ${
                  selectedSurahIndex === idx
                    ? 'bg-tarbiyah-900 text-gold-300 border-gold-500/60 shadow-md'
                    : 'bg-white dark:bg-islamic-card border-gray-200 dark:border-islamic-border text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-500 text-[10px] flex items-center justify-center font-bold">
                  {s.number}
                </span>
                <span>{s.name}</span>
                <span className="font-arabic font-normal text-sm">{s.arabicName}</span>
              </button>
            ))}
          </div>

          {/* Reading Display Container */}
          <div className="bg-white dark:bg-islamic-card rounded-3xl p-6 sm:p-10 shadow-xl border border-tarbiyah-100 dark:border-islamic-border space-y-8">
            
            {/* Surah Header Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-tarbiyah-950 via-tarbiyah-900 to-tarbiyah-950 text-white text-center border border-gold-500/40 relative overflow-hidden">
              <div className="relative z-10 space-y-1">
                <span className="font-arabic text-3xl sm:text-4xl text-gold-300 font-bold block">
                  سُورَةُ {currentSurah.arabicName}
                </span>
                <h3 className="text-lg font-bold">{currentSurah.name} ({currentSurah.meaning})</h3>
                <p className="text-xs text-emerald-200/80">
                  {currentSurah.versesCount} Ayahs • Makki Revelation • Holy Quran
                </p>

                <div className="pt-3">
                  <button
                    onClick={() => setPlayingAudio(!playingAudio)}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500 text-tarbiyah-950 text-xs font-bold shadow hover:bg-gold-400 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{playingAudio ? "Pause Audio Recitation" : t.quran.audioListen}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Ayahs List */}
            <div className="space-y-6">
              {currentSurah.verses.map(ayah => (
                <div
                  key={ayah.num}
                  className="p-5 rounded-2xl bg-gray-50/50 dark:bg-islamic-dark/50 border border-gray-100 dark:border-islamic-border/60 hover:border-gold-400/40 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-islamic-border">
                    <span className="w-7 h-7 rounded-xl bg-gold-100 dark:bg-gold-950/80 text-gold-800 dark:text-gold-300 text-xs font-bold flex items-center justify-center border border-gold-300 dark:border-gold-800">
                      {ayah.num}
                    </span>
                    <button className="text-gray-400 hover:text-gold-500 transition-colors" title="Bookmark Ayah">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Arabic Verse */}
                  <p className="font-arabic text-2xl sm:text-3xl text-right text-tarbiyah-950 dark:text-white leading-[2.2] select-text">
                    {ayah.arabic}
                    <span className="font-arabic text-gold-600 dark:text-gold-400 text-xl mx-2 font-normal">
                      ۝{ayah.num}
                    </span>
                  </p>

                  {/* Translation */}
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic pt-1">
                    {ayah.translation}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 2: QAIDA NOORANIYAH */}
      {activeSubTab === 'qaida' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-tarbiyah-950 dark:text-white">
                Qaida Nooraniyah - Lesson 1: Single Arabic Letters (الحروف المفردة)
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Click on any letter to practice accurate articulation and Tajweed resonance.
              </p>
            </div>

            {/* Letter Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
              {qaidaLetters.map(item => (
                <button
                  key={item.name}
                  onClick={() => alert(`Playing pronunciation for letter: ${item.name} (${item.sound})`)}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-islamic-dark border border-gray-200 dark:border-islamic-border hover:border-gold-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-1 group"
                >
                  <span className="font-arabic text-4xl text-tarbiyah-950 dark:text-white group-hover:scale-125 transition-transform text-gold-500">
                    {item.letter}
                  </span>
                  <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 mt-1">{item.name}</span>
                  <span className="text-[10px] text-gray-400">/{item.sound}/</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TAJWEED PRINCIPLES */}
      {activeSubTab === 'tajweed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tajweedRules.map(rule => (
            <div key={rule.title} className={`p-6 rounded-3xl border ${rule.color} shadow-sm space-y-3`}>
              <h3 className="font-bold text-base text-tarbiyah-950 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-500" />
                {rule.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {rule.definition}
              </p>
              <div className="p-3 rounded-xl bg-white/80 dark:bg-islamic-dark/80 border border-gray-200/50 dark:border-islamic-border">
                <span className="text-[10px] uppercase font-bold text-gold-600 dark:text-gold-400 tracking-wider">Quranic Example:</span>
                <p className="font-arabic text-lg text-tarbiyah-900 dark:text-white mt-1">{rule.example}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 4: HIFZ MEMORIZATION & MURAJA'AH TRACKER */}
      {activeSubTab === 'hifz' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-islamic-card border border-tarbiyah-100 dark:border-islamic-border shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-tarbiyah-950 dark:text-white flex items-center gap-2">
                <Flame className="w-6 h-6 text-gold-500" />
                Quran Hifz Completion Board (30 Ajza')
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Toggle completed Juz to track your memorization and schedule regular Muraja'ah revision.
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-tarbiyah-900 text-gold-300 font-bold text-sm">
              {hifzCompletedJuz.length} of 30 Juz Memorized ({Math.round((hifzCompletedJuz.length / 30) * 100)}%)
            </div>
          </div>

          {/* 30 Juz Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 pt-4">
            {Array.from({ length: 30 }, (_, i) => i + 1).map(juzNum => {
              const isCompleted = hifzCompletedJuz.includes(juzNum);
              return (
                <button
                  key={juzNum}
                  onClick={() => toggleJuz(juzNum)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isCompleted
                      ? 'bg-tarbiyah-800 text-gold-300 border-gold-500 shadow-md font-bold'
                      : 'bg-gray-50 dark:bg-islamic-dark text-gray-600 dark:text-gray-400 border-gray-200 dark:border-islamic-border hover:border-gold-400'
                  }`}
                >
                  <span className="text-[10px] text-gray-400">Juz</span>
                  <span className="text-base font-extrabold">{juzNum}</span>
                  {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-gold-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
