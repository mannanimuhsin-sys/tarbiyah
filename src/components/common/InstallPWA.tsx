'use client';

import { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    // Check if already in standalone mode (already installed as app)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    // Check if iOS Safari
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIos && !window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      alert(
        lang === 'ml'
          ? 'മൊബൈൽ ബ്രൗസറിന്റെ മെനുവിൽ (3 ഡോട്ടുകൾ) ക്ലിക്ക് ചെയ്ത് "Install app" അല്ലെങ്കിൽ "Add to Home screen" അമർത്തുക.'
          : 'Tap your browser menu (3 dots) and select "Install app" or "Add to Home screen".'
      );
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || dismissed) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-bounce-subtle">
        <div className="bg-gradient-to-r from-tarbiyah-800 to-tarbiyah-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-gold-400/40 flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gold-400/20 border border-gold-400/50 flex items-center justify-center shrink-0 text-gold-300">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gold-300 flex items-center gap-1.5">
                <span>{lang === 'ml' ? 'ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യൂ' : 'Install Tarbiyah App'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">PWA</span>
              </h4>
              <p className="text-xs text-gray-200 mt-0.5">
                {lang === 'ml'
                  ? 'മൊബൈൽ ഹോം സ്ക്രീനിൽ ആപ്പായി ഉപയോഗിക്കാം!'
                  : 'Get the full-screen mobile app on your phone!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-tarbiyah-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow transition flex items-center gap-1.5 whitespace-nowrap active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'ml' ? 'ഇൻസ്റ്റാൾ' : 'Install'}</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 border border-gold-400/40 shadow-2xl">
            <h3 className="text-lg font-bold text-tarbiyah-800 dark:text-gold-400 mb-2">
              {lang === 'ml' ? 'iPhone / iPad-ൽ ഇൻസ്റ്റാൾ ചെയ്യാൻ' : 'Install on iPhone / iPad'}
            </h3>
            <ol className="text-sm space-y-3 text-gray-600 dark:text-gray-300 my-4 list-decimal list-inside">
              <li>{lang === 'ml' ? 'താഴെയുള്ള Share ബട്ടൺ അമർത്തുക (ചതുരവും അമ്പടയാളവും)' : 'Tap the Share button at the bottom of Safari'}</li>
              <li>{lang === 'ml' ? 'താഴേക്ക് സ്ക്രോൾ ചെയ്ത് "Add to Home Screen" ക്ലിക്ക് ചെയ്യുക' : 'Scroll down and tap "Add to Home Screen"'}</li>
              <li>{lang === 'ml' ? 'മുകളിൽ വലതുവശത്ത് "Add" അമർത്തുക' : 'Tap "Add" in the top right corner'}</li>
            </ol>
            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full bg-tarbiyah-700 text-white font-medium py-2.5 rounded-xl hover:bg-tarbiyah-800 transition"
            >
              {lang === 'ml' ? 'മനസ്സിലായി' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
