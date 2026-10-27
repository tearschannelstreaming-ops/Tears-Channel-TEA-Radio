import React, { useState } from 'react';
import { SCHEDULE, CHANNELS } from '../data/mockData';
import { ChannelId } from '../types';
import { useChannelFavorites } from '../hooks/useChannelFavorites';
import { 
  Bell, Check, Clock, User, Star, Tv, Radio, Sparkles, Filter, 
  ChevronRight, Volume2, ShieldCheck, Heart 
} from 'lucide-react';

interface ProgramGuideProps {
  onTuneIn: (channelId: ChannelId) => void;
}

export const ProgramGuide: React.FC<ProgramGuideProps> = ({ onTuneIn }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedChannelId, setSelectedChannelId] = useState<ChannelId | 'All'>('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'info' | 'star' } | null>(null);

  const { favorites, isFavorite, toggleFavorite, clearFavorites } = useChannelFavorites();

  const categories = ['All', 'Entertainment', 'Real Estate', 'Radio & Music', 'Business & News'];

  const handleToggleFavorite = (channelId: ChannelId, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const wasFav = isFavorite(channelId);
    toggleFavorite(channelId);
    
    const targetChannel = CHANNELS.find(c => c.id === channelId);
    const channelName = targetChannel ? `${targetChannel.number}: ${targetChannel.name}` : channelId;
    
    setToastMessage({
      text: wasFav 
        ? `★ Removed ${channelName} from your favorite channels.` 
        : `★ Added ${channelName} to your favorite channels (saved to localStorage)!`,
      type: 'star'
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleReminder = (id: string, title: string) => {
    setReminders(prev => {
      const nextState = !prev[id];
      const message = nextState 
        ? `Reminder set for "${title}"` 
        : `Reminder cancelled for "${title}"`;
      setToastMessage({ text: message, type: 'info' });
      setTimeout(() => setToastMessage(null), 3000);
      return { ...prev, [id]: nextState };
    });
  };

  // Filter schedule based on category, channel selection, and favorites
  const filteredSchedule = SCHEDULE.filter(prog => {
    const matchesCategory = selectedCategory === 'All' || prog.category === selectedCategory;
    const matchesChannel = selectedChannelId === 'All' || prog.channelId === selectedChannelId;
    const matchesFavorites = !showFavoritesOnly || isFavorite(prog.channelId);
    return matchesCategory && matchesChannel && matchesFavorites;
  });

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              24/7 Broadcast Schedule &amp; EPG
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{favorites.length} Starred Channels</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Electronic Program Guide
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Real-time daily broadcasting schedule. Star your favorite channels to persist your custom lineup across devices.
          </p>
        </div>

        {/* Global Favorites & Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              showFavoritesOnly
                ? 'bg-amber-400 text-black ring-2 ring-amber-400/50 shadow-amber-400/20'
                : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
            title="Filter schedule to only show starred favorite channels"
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-black text-black' : 'fill-amber-400 text-amber-400'}`} />
            <span>Starred Channels Only</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black ${
              showFavoritesOnly ? 'bg-black/20 text-black' : 'bg-amber-400/20 text-amber-300'
            }`}>
              {favorites.length}
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CHANNEL FAVORITES STRIP (Interactive Star & Tune Control) */}
      {/* ============================================================== */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="uppercase tracking-wider">Select &amp; Star Channels:</span>
          <span>Click ★ to persist favorites</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CHANNELS.map(ch => {
            const favorited = isFavorite(ch.id);
            const isSelectedChannel = selectedChannelId === ch.id;

            return (
              <div
                key={ch.id}
                onClick={() => setSelectedChannelId(selectedChannelId === ch.id ? 'All' : ch.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                  favorited
                    ? 'bg-gradient-to-br from-slate-900/90 via-[#111928] to-slate-900 border-amber-500/50 shadow-md'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                } ${isSelectedChannel ? 'ring-2 ring-cyan-400' : ''}`}
              >
                {/* Channel Header + Star Button */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-black/60 border border-slate-700 font-mono font-bold text-xs text-amber-400">
                      {ch.number}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {ch.resolution}
                    </span>
                  </div>

                  {/* Star Favorite Button */}
                  <button
                    onClick={(e) => handleToggleFavorite(ch.id, e)}
                    className={`p-1.5 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                      favorited
                        ? 'bg-amber-400/20 text-amber-400 hover:bg-amber-400/30'
                        : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
                    }`}
                    title={favorited ? `Unstar ${ch.name}` : `Star ${ch.name} as favorite`}
                    aria-label={`Star ${ch.name}`}
                  >
                    <Star className={`w-4 h-4 ${favorited ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                  </button>
                </div>

                {/* Channel Info */}
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {ch.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {ch.tagline}
                  </p>
                </div>

                {/* Now Playing & Tune Button */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[10px] font-mono text-cyan-300 truncate max-w-[140px]">
                    {ch.nowPlaying}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTuneIn(ch.id);
                    }}
                    className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[10px] rounded-md transition-colors shrink-0"
                  >
                    Tune
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {selectedChannelId !== 'All' && (
          <button
            onClick={() => setSelectedChannelId('All')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Showing: {CHANNELS.find(c => c.id === selectedChannelId)?.number}</span>
            <span>(Show All Channels ✕)</span>
          </button>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
          toastMessage.type === 'star'
            ? 'bg-amber-950/80 border-amber-500/50 text-amber-200 shadow-lg'
            : 'bg-slate-900 border-slate-700 text-slate-200 shadow'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'star' ? (
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
            ) : (
              <Bell className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* Empty State for Favorites or Category Filters */}
      {filteredSchedule.length === 0 && (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <Star className="w-8 h-8 text-amber-400/50 mx-auto" />
          <h3 className="text-base font-bold text-white">
            {showFavoritesOnly ? 'No Starred Channels in this Category' : 'No Programs Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {showFavoritesOnly 
              ? 'You can star any of the 4 T.E.A.R.S. channels above using the ★ icon to see their programs here.'
              : 'Try selecting "All" categories or reset your channel filter.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            {showFavoritesOnly && (
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
              >
                View All Channels
              </button>
            )}
            <button
              onClick={() => {
                CHANNELS.forEach(c => {
                  if (!isFavorite(c.id)) toggleFavorite(c.id);
                });
                setShowFavoritesOnly(true);
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold rounded-xl"
            >
              Star All Channels (★)
            </button>
          </div>
        </div>
      )}

      {/* Program Timeline List */}
      <div className="space-y-3">
        {filteredSchedule.map(prog => {
          const isReminded = !!reminders[prog.id];
          const channel = CHANNELS.find(c => c.id === prog.channelId);
          const channelFavorited = isFavorite(prog.channelId);

          return (
            <div
              key={prog.id}
              className={`p-5 rounded-xl border transition-all ${
                prog.isLiveNow
                  ? 'bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-slate-900 border-amber-500/40 shadow-lg'
                  : channelFavorited
                  ? 'bg-slate-900/70 border-slate-700/80 hover:border-amber-500/40'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left: Time & Information */}
                <div className="space-y-2 flex-1">
                  
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    
                    {/* Channel Tag with Favorite Star */}
                    <button
                      onClick={(e) => handleToggleFavorite(prog.channelId, e)}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono font-bold transition-all ${
                        channelFavorited
                          ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                          : 'bg-black/40 text-slate-300 border border-slate-800 hover:border-amber-400/40'
                      }`}
                      title={channelFavorited ? 'Starred channel (Click to unstar)' : 'Click to star channel'}
                    >
                      <Star className={`w-3 h-3 ${channelFavorited ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                      <span>{channel?.number || prog.channelId}</span>
                    </button>

                    <span aria-hidden="true" className="text-slate-600">·</span>

                    <span className="flex items-center gap-1 text-amber-400 font-mono font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {prog.timeSlot}
                    </span>

                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-300 font-medium">{prog.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <User className="w-3 h-3 text-slate-500" />
                      {prog.host}
                    </span>
                    {prog.isLiveNow && (
                      <>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-red-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                          <span>ON AIR NOW</span>
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{prog.title}</span>
                    {channelFavorited && (
                      <span className="text-[10px] font-mono text-amber-400/80 font-normal">
                        ★ Favorite Channel
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                    {prog.description}
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <button
                    onClick={() => toggleReminder(prog.id, prog.title)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                      isReminded
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                    }`}
                    title={isReminded ? 'Cancel reminder' : 'Set reminder'}
                  >
                    {isReminded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bell className="w-3.5 h-3.5" />}
                    <span>{isReminded ? 'Reminded' : 'Remind Me'}</span>
                  </button>

                  <button
                    onClick={() => onTuneIn(prog.channelId)}
                    className="px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-400/20"
                  >
                    {prog.isLiveNow ? 'Watch Live' : 'Tune Channel'}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
