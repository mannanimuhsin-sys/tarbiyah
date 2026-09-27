import React from 'react';

export function IslamicStar({ className = "w-6 h-6 text-gold-500" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8L12 2z" />
      <circle cx="12" cy="12" r="3" fill="#ffffff" fillOpacity="0.4" />
    </svg>
  );
}

export function RubElHizb({ className = "w-8 h-8 text-gold-500" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6">
      <rect x="25" y="25" width="50" height="50" rx="4" />
      <rect x="25" y="25" width="50" height="50" rx="4" transform="rotate(45 50 50)" />
      <circle cx="50" cy="50" r="10" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

export function BismillahBanner() {
  return (
    <div className="flex flex-col items-center justify-center my-4 sm:my-6 select-none px-2 max-w-full overflow-hidden">
      <div className="flex items-center justify-center gap-1.5 sm:gap-3 max-w-full">
        <div className="h-[1px] w-6 sm:w-24 bg-gradient-to-r from-transparent to-gold-500/60 shrink" />
        <RubElHizb className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500 shrink-0" />
        <span className="font-arabic text-base sm:text-2xl text-gold-600 dark:text-gold-400 font-bold tracking-wide text-center">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </span>
        <RubElHizb className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500 shrink-0" />
        <div className="h-[1px] w-6 sm:w-24 bg-gradient-to-l from-transparent to-gold-500/60 shrink" />
      </div>
      <p className="text-[10px] sm:text-xs text-emerald-800/70 dark:text-emerald-300/60 mt-1 italic tracking-wider text-center">
        In the name of Allah, the Most Gracious, the Most Merciful
      </p>
    </div>
  );
}
