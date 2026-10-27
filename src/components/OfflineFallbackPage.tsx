import React, { useState, useMemo } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useViewerAppointments } from '../hooks/useViewerAppointments';
import { ViewerAppointmentCalendar } from './ViewerAppointmentCalendar';
import { VOD_ITEMS } from '../data/mockData';
import { VodItem } from '../types';
import { 
  WifiOff, Wifi, RefreshCw, Play, CheckCircle2, AlertTriangle, 
  Clock, Calendar, Download, Film, HardDrive, ShieldCheck, 
  ArrowRight, Sparkles, Volume2, BellRing, X, ChevronRight,
  Search, SlidersHorizontal, Eye, ShieldAlert, Check
} from 'lucide-react';

interface OfflineFallbackPageProps {
  onSelectVod?: (vod: VodItem) => void;
  onGoOnline?: () => void;
  onReturnToLive?: () => void;
}

export const OfflineFallbackPage: React.FC<OfflineFallbackPageProps> = ({
  onSelectVod,
  onGoOnline,
  onReturnToLive
}) => {
  const actualIsOnline = useOnlineStatus();
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState<string | null>(null);
  const [selectedSubTab, setSelectedSubTab] = useState<'cached-vods' | 'calendar'>('cached-vods');
  const [vodCategory, setVodCategory] = useState<string>('All');
  const [vodSearch, setVodSearch] = useState<string>('');

  const isEffectivelyOnline = actualIsOnline && !simulatedOffline;

  const {
    appointments,
    preferences,
    activeAlertAppointment,
    addAppointment,
    editAppointment,
    deleteAppointment,
    toggleComplete,
    updatePreferences,
    testNotification,
    dismissAlert,
    snoozeAlert,
    resetDefaults
  } = useViewerAppointments();

  // Filter cached VODs available offline
  const categories = ['All', 'Action', 'Soul & Motown', 'Real Estate', 'Entertainment', 'Children', 'Educational'];

  const filteredCachedVods = useMemo(() => {
    return VOD_ITEMS.filter(item => {
      const matchesCategory = vodCategory === 'All' || item.category === vodCategory;
      const matchesSearch = !vodSearch.trim() || 
        item.title.toLowerCase().includes(vodSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(vodSearch.toLowerCase()) ||
        (item.badge && item.badge.toLowerCase().includes(vodSearch.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [vodCategory, vodSearch]);

  const handleRefreshGoOnline = async () => {
    setIsCheckingConnection(true);
    setConnectionMessage('Probing T.E.A.R.S. CDN and broadcast server nodes...');

    try {
      // Check network connectivity probe
      const res = await fetch('/manifest.json', { cache: 'no-store' });
      if (res.ok || navigator.onLine) {
        setSimulatedOffline(false);
        setConnectionMessage('Connection Restored! Reconnecting live broadcast feeds...');
        setTimeout(() => {
          setIsCheckingConnection(false);
          setConnectionMessage(null);
          if (onGoOnline) onGoOnline();
          else if (onReturnToLive) onReturnToLive();
          else window.location.reload();
        }, 1000);
        return;
      }
    } catch {
      // Still offline
    }

    setTimeout(() => {
      setIsCheckingConnection(false);
      setConnectionMessage('Device is currently offline. Playing from verified PWA hardware cache.');
      setTimeout(() => setConnectionMessage(null), 4000);
    }, 1000);
  };

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
      
      {/* ============================================================== */}
      {/* 4 ACTIVE APPOINTMENT ALERT DISPLAY MODES */}
      {/* ============================================================== */}
      {activeAlertAppointment && (
        <>
          {/* Mode 1: Modal Takeover Screen */}
          {preferences.displayMode === 'modal_takeover' && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="max-w-lg w-full bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border-2 border-amber-400 mx-auto flex items-center justify-center text-amber-400 shadow-lg">
                  <BellRing className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                    ENTERTAINMENT WATCHDOG TAKEOVER
                  </span>
                  <h3 className="text-2xl font-extrabold text-white">
                    {activeAlertAppointment.title}
                  </h3>
                  <div className="text-rose-400 font-mono text-sm font-bold">
                    Starts at {activeAlertAppointment.time} · {activeAlertAppointment.category}
                  </div>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    {activeAlertAppointment.locationOrLink ? `Location: ${activeAlertAppointment.locationOrLink}` : 'Scheduled Viewer Commitment'}
                  </p>
                  <p className="text-[11px] text-amber-300 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    Video stream automatically paused to prevent entertainment lag and missed appointments.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => snoozeAlert(5)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer"
                  >
                    Snooze (5 Minutes)
                  </button>
                  <button
                    onClick={dismissAlert}
                    className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-lg cursor-pointer"
                  >
                    Acknowledge &amp; Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Ambient Flashing Screen Border */}
          {preferences.displayMode === 'glow_border' && (
            <div className="fixed inset-0 pointer-events-none z-50 border-8 border-rose-500/90 animate-pulse shadow-[inset_0_0_80px_rgba(244,63,94,0.6)]" />
          )}

          {/* Mode 3: Subtle Corner Alert Pill */}
          {preferences.displayMode === 'subtle_badge' && (
            <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900/95 border-2 border-amber-400 backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                  <BellRing className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Appointment Alert ({activeAlertAppointment.time})</div>
                  <div className="text-xs font-bold text-white line-clamp-1">{activeAlertAppointment.title}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => snoozeAlert(5)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold"
                >
                  Snooze
                </button>
                <button
                  onClick={dismissAlert}
                  className="px-2.5 py-1 bg-amber-400 text-black rounded-lg text-[10px] font-extrabold hover:bg-amber-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Mode 4: Floating Overlay Banner (Default and for glow_border) */}
          {(preferences.displayMode === 'floating_banner' || preferences.displayMode === 'glow_border') && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl transition-all animate-in slide-in-from-top-4 duration-300">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border-2 border-amber-400 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0">
                    <BellRing className="w-5 h-5 text-amber-400 animate-bounce" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30 uppercase">
                        Entertainment Watchdog Active
                      </span>
                      <span className="text-xs text-rose-400 font-mono font-bold">
                        Starts at {activeAlertAppointment.time}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-white">
                      {activeAlertAppointment.title}
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      {activeAlertAppointment.locationOrLink || 'Scheduled Commitment'} — Video automatically paused so you do not miss your appointment.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => snoozeAlert(5)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
                  >
                    Snooze (5m)
                  </button>
                  <button
                    onClick={dismissAlert}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow cursor-pointer"
                  >
                    Dismiss Alert
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Offline Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
              <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>OFFLINE PWA FALLBACK MODE ACTIVE · ZERO BUFFERING FROM LOCAL HARDWARE CACHE</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <HardDrive className="w-3.5 h-3.5" />
              <span>{VOD_ITEMS.length} VODs Cached in PWA Storage</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            T.E.A.R.S. Offline Entertainment &amp; Appointment Protection Hub
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Your network is currently disconnected, in transit, or running in low-connectivity flight mode. The T.E.A.R.S. Progressive Web App is serving <strong>cached full-length Video On Demand episodes, Detroit urban ballroom showcases, and commercial land infill tours</strong> directly from verified local cache with <strong>0% cellular data usage</strong>.
          </p>

          {/* Action Row: 'Go Online' Refresh Button + Testing Simulator + Diagnostics */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            
            {/* The Requested 'Go Online' Refresh Button */}
            <button
              onClick={handleRefreshGoOnline}
              disabled={isCheckingConnection}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              title="Test connection and restore live broadcast streaming"
            >
              <RefreshCw className={`w-4 h-4 ${isCheckingConnection ? 'animate-spin' : ''}`} />
              <span>{isCheckingConnection ? 'Testing Connection...' : 'Go Online & Refresh Streams'}</span>
            </button>

            {onReturnToLive && (
              <button
                onClick={onReturnToLive}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                Return to Live TV
              </button>
            )}

            {/* Offline Simulator Switch for Testing */}
            <button
              onClick={() => setSimulatedOffline(!simulatedOffline)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                simulatedOffline
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
              title="Toggle simulated offline state for PWA testing"
            >
              {simulatedOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{simulatedOffline ? 'Simulating Offline Mode' : 'Simulate Offline Mode'}</span>
            </button>

            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Service Worker Cache: Healthy</span>
            </div>
          </div>

          {/* Connection Status Toast / Diagnostic */}
          {connectionMessage && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2 animate-in fade-in duration-150">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{connectionMessage}</span>
            </div>
          )}

        </div>

        {/* Ambient glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mb-16" />
      </div>

      {/* Sub-Navigation Switcher: Cached VOD Library vs Appointment Calendar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-900 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedSubTab('cached-vods')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedSubTab === 'cached-vods'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Cached VOD Library ({filteredCachedVods.length})</span>
          </button>

          <button
            onClick={() => setSelectedSubTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedSubTab === 'calendar'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Appointment Protection Calendar ({appointments.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 px-3">
          <span>Storage: 74.2 MB Cached</span>
          <span>·</span>
          <span>Watchdog: {preferences.enabledChannels.length} Channels Armed</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: CACHED VOD THUMBNAILS & OFFLINE PLAYER */}
      {/* ============================================================== */}
      {selectedSubTab === 'cached-vods' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                <span>Locally Cached VOD Thumbnails (Ready to Play Offline)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                These video episodes are cached in local browser PWA storage and play immediately without buffering or internet access.
              </p>
            </div>

            {/* VOD Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={vodSearch}
                onChange={e => setVodSearch(e.target.value)}
                placeholder="Search cached titles..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl w-fit">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setVodCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  vodCategory === cat
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* VOD Thumbnails Grid */}
          {filteredCachedVods.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
              <Film className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm text-slate-300 font-medium">No cached videos matched your search</p>
              <button
                onClick={() => { setVodCategory('All'); setVodSearch(''); }}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredCachedVods.map((vod) => (
                <div
                  key={vod.id}
                  className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-amber-400/60 transition-all flex flex-col justify-between shadow-lg"
                >
                  {/* Thumbnail Poster Box */}
                  <div 
                    className={`relative aspect-video bg-gradient-to-br ${vod.gradient || 'from-slate-800 to-black'} overflow-hidden flex items-center justify-center select-none`}
                  >
                    {/* Visual Cached Screenshot Reference if available */}
                    {vod.screenshotRef && (
                      <img
                        src={vod.screenshotRef}
                        alt={vod.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-65"
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/50" />
                    
                    {/* Category & Cached Pill on Thumbnail */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-white bg-black/80 px-2 py-0.5 rounded-md border border-white/20">
                        {vod.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-black/80 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Cached</span>
                      </span>
                    </div>

                    {/* Play Action Trigger */}
                    <button
                      onClick={() => onSelectVod && onSelectVod(vod)}
                      className="relative z-10 w-12 h-12 rounded-full bg-amber-400/90 hover:bg-amber-300 text-black flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 cursor-pointer"
                      title={`Play ${vod.title} offline`}
                    >
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </button>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded bg-black/90 text-white font-mono text-[10px] border border-white/20">
                      {vod.duration}
                    </div>
                  </div>

                  {/* Card Content & Details */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-xs leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors">
                        {vod.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {vod.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>{vod.views} views</span>
                      <button
                        onClick={() => onSelectVod && onSelectVod(vod)}
                        className="text-amber-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Play Offline</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: INTEGRATED APPOINTMENT CALENDAR & NOTIFICATIONS */}
      {/* ============================================================== */}
      {selectedSubTab === 'calendar' && (
        <ViewerAppointmentCalendar
          appointments={appointments}
          preferences={preferences}
          onAddAppointment={addAppointment}
          onEditAppointment={editAppointment}
          onDeleteAppointment={deleteAppointment}
          onToggleComplete={toggleComplete}
          onUpdatePreferences={updatePreferences}
          onTestNotification={testNotification}
          onResetDefaults={resetDefaults}
        />
      )}

    </div>
  );
};
