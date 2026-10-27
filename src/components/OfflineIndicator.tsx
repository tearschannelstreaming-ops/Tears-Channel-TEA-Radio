import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, ArrowRight, Calendar, Film } from 'lucide-react';

interface OfflineIndicatorProps {
  onOpenOfflineFallback?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ onOpenOfflineFallback }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto z-50 flex items-center justify-between sm:justify-start gap-3 rounded-2xl bg-amber-400 text-black px-4 py-2.5 text-xs font-bold shadow-2xl border-2 border-black/20 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-black text-amber-400 flex items-center justify-center shrink-0">
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div>
          <span className="block leading-tight font-extrabold">Offline Mode Active</span>
          <span className="text-[10px] text-black/75 font-mono block">Cached VODs &amp; Calendar Safeguards Armed</span>
        </div>
      </div>

      {onOpenOfflineFallback && (
        <button
          onClick={onOpenOfflineFallback}
          className="px-3 py-1.5 rounded-xl bg-black text-amber-400 hover:text-white text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          <span>Offline Hub</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
