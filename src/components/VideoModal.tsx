import React, { useState } from 'react';
import { VodItem } from '../types';
import { X, Play, Pause, Volume2, VolumeX, Clock, Eye, Share2, Check, Download } from 'lucide-react';

interface VideoModalProps {
  item: VodItem;
  onClose: () => void;
  onSelectAnother: (item: VodItem) => void;
  relatedItems: VodItem[];
}

export const VideoModal: React.FC<VideoModalProps> = ({
  item,
  onClose,
  onSelectAnother,
  relatedItems
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(35);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
              T.E.A.R.S. ON DEMAND
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">{item.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Canvas */}
        <div className={`relative aspect-video w-full bg-gradient-to-tr ${item.gradient} flex items-center justify-center overflow-hidden`}>
          <div className="scanlines absolute inset-0 opacity-30 pointer-events-none" />

          {/* Animated Video Playback Graphics */}
          <div className="text-center px-6 z-10 max-w-lg">
            <div className="text-xs font-mono text-amber-400 mb-2 uppercase tracking-wider">
              {item.badge}
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2">
              {item.description}
            </p>
          </div>

          {/* Player Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex flex-col gap-2 z-20">
            {/* Scrubber */}
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setProgress(Math.round(pos * 100));
              }}
              className="w-full h-1.5 bg-slate-700/80 rounded-full cursor-pointer relative overflow-hidden"
            >
              <div 
                className="h-full bg-amber-400 transition-all duration-100" 
                style={{ width: `${progress}%` }} 
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 text-slate-300 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-slate-400 font-mono text-[11px]">
                  08:14 / {item.duration}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info & Related */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
              <span>{item.date}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {item.duration}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {item.views} Views
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {item.title}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Related Videos */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              More From T.E.A.R.S. Channel
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedItems.slice(0, 2).map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onSelectAnother(rel)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <div className={`w-14 h-12 rounded-lg bg-gradient-to-tr ${rel.gradient} shrink-0 flex items-center justify-center`}>
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{rel.title}</h5>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{rel.duration} · {rel.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
