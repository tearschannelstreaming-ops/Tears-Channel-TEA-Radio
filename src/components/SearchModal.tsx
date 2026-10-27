import React, { useState } from 'react';
import { Search, X, Tv, Building2, Radio, Play, Film, Tag } from 'lucide-react';
import { CHANNELS, SCHEDULE, REAL_ESTATE_LISTINGS, VOD_ITEMS, CHANNEL_CONFIG } from '../data/mockData';
import { VodItem, RealEstateListing } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVod: (vod: VodItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectVod,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedVod = q ? VOD_ITEMS.filter(v => 
    v.title.toLowerCase().includes(q) || 
    v.description.toLowerCase().includes(q) || 
    v.category.toLowerCase().includes(q) ||
    (v.genre && v.genre.toLowerCase().includes(q))
  ) : [];

  const matchedListings = q ? REAL_ESTATE_LISTINGS.filter(l => 
    l.title.toLowerCase().includes(q) || 
    l.location.toLowerCase().includes(q) || 
    l.description.toLowerCase().includes(q)
  ) : [];

  const matchedPrograms = q ? SCHEDULE.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.host.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  ) : [];

  // Genre categories directly from Screenshot 7 & channel catalog
  const searchGenres = [
    { name: 'Action', color: 'from-red-600 to-rose-700' },
    { name: 'Children', color: 'from-amber-600 to-yellow-600' },
    { name: 'Educational', color: 'from-blue-700 to-cyan-700' },
    { name: 'Religious', color: 'from-purple-700 to-indigo-800' },
    { name: 'Soul & Motown', color: 'from-orange-700 to-amber-700' },
    { name: 'Real Estate', color: 'from-emerald-700 to-teal-800' },
    { name: 'Entertainment', color: 'from-pink-700 to-rose-800' },
    { name: 'Viral Reels', color: 'from-sky-600 to-blue-800' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-16">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Input Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3 flex-1 mr-4">
            <Search className="w-5 h-5 text-amber-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies, Johnnie Taylor, Detroit land, genres..."
              className="w-full bg-transparent text-white text-base focus:outline-none placeholder-slate-500"
            />
          </div>
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white mr-2"
            >
              Clear
            </button>
          )}
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results or Genre Grid */}
        <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-1">
          {!q ? (
            <div className="space-y-4">
              {/* Screenshot 7: Browse by Genre */}
              {!CHANNEL_CONFIG.disable_mobile_search_genres && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Browse Channel Genres</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {searchGenres.map(genre => (
                      <button
                        key={genre.name}
                        onClick={() => setQuery(genre.name)}
                        className={`h-20 rounded-xl bg-gradient-to-br ${genre.color} p-3 text-left font-bold text-white shadow-md hover:scale-105 transition-transform flex flex-col justify-end text-xs sm:text-sm border border-white/10`}
                      >
                        <span>{genre.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => { onNavigateTab('faq'); onClose(); }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-amber-300 font-medium transition-colors"
                >
                  Network &amp; Real Estate FAQ →
                </button>
                <button
                  onClick={() => { onNavigateTab('taxes'); onClose(); }}
                  className="px-3 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 font-medium transition-colors"
                >
                  Creator Tax Portal (1099 &amp; Filming Costs) →
                </button>
                <button
                  onClick={() => { onNavigateTab('music'); onClose(); }}
                  className="px-3 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 rounded-lg text-xs text-purple-300 font-medium transition-colors"
                >
                  T.E.A.R.adio Music Distro (Spotify / Apple) →
                </button>
                <button
                  onClick={() => { onNavigateTab('biometrics'); onClose(); }}
                  className="px-3 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 rounded-lg text-xs text-cyan-300 font-medium transition-colors"
                >
                  Face Biometrics &amp; Sovereign ID →
                </button>
                <a
                  href="https://mls-client.com/AC8E6C053"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 rounded-lg text-xs text-cyan-300 font-medium transition-colors"
                >
                  MLS Mobile App (Code: AC8E6C053) →
                </a>
              </div>

              <div className="pt-1 text-center text-xs text-slate-500 font-mono">
                Type any title above or select a genre to filter all 24/7 channel broadcasts.
              </div>
            </div>
          ) : matchedVod.length === 0 && matchedListings.length === 0 && matchedPrograms.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <Film className="w-8 h-8 text-slate-600 mx-auto" />
              <div>No results found for &quot;{query}&quot;.</div>
              <div className="text-slate-500">Try searching for &quot;Johnnie Taylor&quot;, &quot;Murder&quot;, &quot;Woodward&quot;, or &quot;Action&quot;.</div>
            </div>
          ) : (
            <>
              {matchedVod.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                    Videos &amp; Features ({matchedVod.length})
                  </div>
                  {matchedVod.map(v => (
                    <div
                      key={v.id}
                      onClick={() => {
                        onSelectVod(v);
                        onClose();
                      }}
                      className="p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center shrink-0">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-white">{v.title}</h5>
                          <p className="text-xs text-slate-400">{v.duration} · {v.category}</p>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 font-medium shrink-0">Watch Now →</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedListings.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase">
                    Real Estate &amp; Land ({matchedListings.length})
                  </div>
                  {matchedListings.map(l => (
                    <div
                      key={l.id}
                      onClick={() => {
                        onNavigateTab('realestate');
                        onClose();
                      }}
                      className="p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                          <h5 className="text-sm font-bold text-white">{l.title}</h5>
                          <p className="text-xs text-slate-400">{l.price} · {l.size} · {l.location}</p>
                        </div>
                      </div>
                      <span className="text-xs text-cyan-400 font-medium shrink-0">View Parcel →</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedPrograms.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-purple-400 font-semibold uppercase">
                    Scheduled Broadcasts ({matchedPrograms.length})
                  </div>
                  {matchedPrograms.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onNavigateTab('guide');
                        onClose();
                      }}
                      className="p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Tv className="w-4 h-4 text-purple-400 shrink-0" />
                        <div>
                          <h5 className="text-sm font-bold text-white">{p.title}</h5>
                          <p className="text-xs text-slate-400">{p.timeSlot} · Host: {p.host}</p>
                        </div>
                      </div>
                      <span className="text-xs text-purple-400 font-medium shrink-0">View in Guide →</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
