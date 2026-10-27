import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2, Tv } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'hero' | 'minimal';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '',
  variant = 'header'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop / TV browser flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black text-xs font-extrabold rounded-lg shadow-sm transition-all hover:scale-105 ${className}`}
        title="Install T.E.A.R.S. Channel as a standalone native app on this device"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not fired on WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/30 text-xs font-bold rounded-lg shadow-sm transition-all hover:scale-105 ${className}`}
          title="Install T.E.A.R.S. Channel on iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-white">
                    Install on iPhone / iPad
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Add <strong>T.E.A.R.S. Channel</strong> to your home screen for fullscreen 4K streaming, 24/7 radio background audio, and offline access.
              </p>

              <div className="p-3.5 bg-black/60 rounded-xl border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-extrabold text-[11px] flex items-center justify-center">1</span>
                  <span>Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-1 text-cyan-400" /> in Safari&#39;s bottom toolbar.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-extrabold text-[11px] flex items-center justify-center">2</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-extrabold text-[11px] flex items-center justify-center">3</span>
                  <span>Tap <strong>Add</strong> in the top-right corner to finish.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold rounded-xl transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for desktop browsers without prompt triggered yet
  return (
    <button
      onClick={() => {
        alert('To install T.E.A.R.S. Channel, click the Install App icon in your browser address bar or use Chrome/Edge menu > "Install T.E.A.R.S. Channel".');
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-lg shadow-sm transition-all ${className}`}
      title="Install standalone app"
    >
      <Download className="w-3.5 h-3.5 text-amber-400" />
      <span>Install App</span>
    </button>
  );
};
