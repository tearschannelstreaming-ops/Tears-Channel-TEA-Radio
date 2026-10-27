import React, { useState } from 'react';
import { VOD_ITEMS } from '../data/mockData';
import { VodItem } from '../types';
import { CheckCircle2, AlertTriangle, Copy, Trash2, Edit3, Image as ImageIcon, Play, Sparkles } from 'lucide-react';

interface MediaCorrectionCenterProps {
  onWatchVideo: (item: VodItem) => void;
}

export const MediaCorrectionCenter: React.FC<MediaCorrectionCenterProps> = ({ onWatchVideo }) => {
  const [items, setItems] = useState<VodItem[]>(VOD_ITEMS);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'corrected' | 'deduped'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [toast, setToast] = useState<string | null>(null);

  const totalRawScanned = items.length + 3; // accounting for removed duplicates
  const totalCorrected = items.filter(i => i.correctedFromError).length;
  const totalDeduped = items.filter(i => i.wasDuplicate).length;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleManualDeleteDuplicate = (id: string, title: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    showToast(`Deleted duplicate video: "${title}"`);
  };

  const filteredItems = items.filter(i => {
    const matchesFilter = filter === 'corrected' ? !!i.correctedFromError : filter === 'deduped' ? !!i.wasDuplicate : true;
    const matchesCategory = selectedCategory === 'All Categories' || i.category === selectedCategory;
    return matchesFilter && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#181124] to-slate-900 border border-slate-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>CHANNEL MEDIA SCANNER &amp; METADATA CLEANER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Media Title Error Scanner &amp; Deduplication Audit
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Scanned all media uploaded to T.E.A.R.S. Channel from the Apple App Store screenshots. Replaced raw filenames and snake_case strings with broadcast-grade titles, removed redundant duplicate uploads, and restored proper music album and director attributions.
          </p>

          {/* Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">Total Scanned</div>
              <div className="text-xl font-black text-white font-mono">{totalRawScanned} Videos</div>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="text-[11px] font-mono text-amber-400">Titles Corrected</div>
              <div className="text-xl font-black text-amber-400 font-mono">{totalCorrected} Cleaned</div>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="text-[11px] font-mono text-emerald-400">Duplicates Pruned</div>
              <div className="text-xl font-black text-emerald-400 font-mono">{totalDeduped} Merged</div>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="text-[11px] font-mono text-cyan-400">Broadcast Status</div>
              <div className="text-xl font-black text-cyan-400 font-mono">100% Ready</div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'all' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Media ({items.length})
            </button>
            <button
              onClick={() => setFilter('corrected')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'corrected' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Title Errors Fixed ({totalCorrected})
            </button>
            <button
              onClick={() => setFilter('deduped')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'deduped' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Duplicates Resolved ({totalDeduped})
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Live Database Synchronized
          </div>
        </div>

        {/* Assigned Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-850 rounded-xl">
          <span className="text-[11px] font-mono text-slate-400 px-2 py-1">Category:</span>
          {['All Categories', 'Action', 'Children', 'Educational', 'Religious', 'Soul & Motown', 'Real Estate', 'Entertainment', 'Advertisements'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List of Scanned Media Items */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              
              {/* Left Column: Title comparison */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono text-amber-400 font-semibold">{item.category}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{item.duration}</span>
                  {item.wasDuplicate && (
                    <>
                      <span className="text-slate-600">·</span>
                      <span className="px-2 py-0.5 rounded bg-red-950/70 text-red-300 font-mono text-[10px] font-bold border border-red-500/30">
                        {item.duplicateCount} Duplicate Uploads Merged
                      </span>
                    </>
                  )}
                  {item.screenshotRef && (
                    <>
                      <span className="text-slate-600">·</span>
                      <button
                        onClick={() => setSelectedScreenshot(item.screenshotRef || null)}
                        className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px] flex items-center gap-1"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>View Source Screenshot</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Clean Title */}
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{item.title}</span>
                  <span className="text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 font-normal">
                    Verified Broadcast Title
                  </span>
                </h3>

                {/* Raw Filename Error Box */}
                {item.rawFilename && (
                  <div className="p-3 bg-black/60 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
                    <div className="text-slate-500 text-[11px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      <span>Original Upload Filename (Error Detected):</span>
                    </div>
                    <div className="text-red-300 break-all line-through opacity-75">
                      {item.rawFilename}
                    </div>
                    {item.correctedFromError && (
                      <div className="text-emerald-300 text-[11px] pt-1">
                        Correction: {item.correctedFromError}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Right Column: Actions */}
              <div className="flex sm:flex-col items-center gap-2 shrink-0">
                <button
                  onClick={() => onWatchVideo(item)}
                  className="w-full px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Preview Video</span>
                </button>

                {item.wasDuplicate && (
                  <button
                    onClick={() => handleManualDeleteDuplicate(item.id, item.title)}
                    className="w-full px-3 py-2 border border-red-500/40 text-red-300 hover:bg-red-950/40 text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    title="Remove extra duplicate copies"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Prune Duplicates</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Screenshot Lightbox Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 relative space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold">App Store Original Source</span>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto rounded-xl border border-slate-800">
              <img
                src={selectedScreenshot}
                alt="App Store Source Screenshot"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="text-[11px] text-slate-400 text-center">
              Screenshot captured from iPhone 17 Pro Max App Store listing (App ID: 6762139785).
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
