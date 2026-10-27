import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Radio,
  Tv, Building2, Briefcase, Eye, Share2, Sparkles, AlertCircle, MessageSquare
} from 'lucide-react';
import { Channel, ChannelId } from '../types';
import { CHANNELS, TICKER_HEADLINES, CHANNEL_CONFIG } from '../data/mockData';
import { tearRadioAudio } from '../utils/audioSynth';
import { LiveBroadcastChat } from './LiveBroadcastChat';
import { HlsLivePlayer } from './HlsLivePlayer';

interface LivePlayerProps {
  currentChannelId: ChannelId;
  onSelectChannel: (channelId: ChannelId) => void;
  onNavigateToRealEstate?: () => void;
  onNavigateToAdvertise?: () => void;
  onNavigateToSchedule?: () => void;
}

export const LivePlayer: React.FC<LivePlayerProps> = ({
  currentChannelId,
  onSelectChannel,
  onNavigateToRealEstate,
  onNavigateToAdvertise,
  onNavigateToSchedule
}) => {
  // Respect "disable_mobile_live_autoplay: true" from sovereign channel production config
  const [isPlaying, setIsPlaying] = useState(!CHANNEL_CONFIG.disable_mobile_live_autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showCaptions, setShowCaptions] = useState(true);
  const [streamQuality, setStreamQuality] = useState('4K HDR');
  const [viewerCount, setViewerCount] = useState(14820);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [streamViewMode, setStreamViewMode] = useState<'live-hls' | 'station-graphic'>('live-hls');
  const [audioVisualizerLevels, setAudioVisualizerLevels] = useState<number[]>([40, 65, 80, 50, 90, 75, 45, 85, 60, 70, 95, 55]);
  const playerRef = useRef<HTMLDivElement>(null);

  const activeChannel = CHANNELS.find(c => c.id === currentChannelId) || CHANNELS[0];

  // Viewer count jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 11) - 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Equalizer visualizer animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAudioVisualizerLevels(
        Array.from({ length: 14 }, () => Math.floor(Math.random() * 75) + 20)
      );
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Audio handling for T.E.A.R.adio channel
  useEffect(() => {
    if (currentChannelId === 'tear-radio' && isPlaying && !isMuted) {
      tearRadioAudio.setVolume(volume);
      tearRadioAudio.start();
    } else {
      tearRadioAudio.stop();
    }
    return () => {
      tearRadioAudio.stop();
    };
  }, [currentChannelId, isPlaying, isMuted, volume]);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      tearRadioAudio.setVolume(volume);
    } else {
      setIsMuted(true);
      tearRadioAudio.setVolume(0);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
      tearRadioAudio.setVolume(val);
    }
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Broadcast Stage & Interactive Live Chat */}
      <div className={`grid grid-cols-1 ${showChat ? 'lg:grid-cols-12 gap-5' : 'gap-5'} items-start`}>
        
        {/* Broadcast Player Column */}
        <div className={showChat ? 'lg:col-span-8 space-y-3' : 'w-full space-y-3'}>
          {/* Primary Video Screen Frame */}
          <div 
            ref={playerRef}
            className="relative bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group select-none"
          >
        {/* 16:9 Aspect Ratio Container */}
        <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden">
          
          {/* Live Video Broadcast Stream for T.E.A.R.S. Channel Primetime */}
          {currentChannelId === 'tears-prime' && streamViewMode === 'live-hls' && (
            <HlsLivePlayer
              streamUrl="https://stream.ott.tvstartup.com/261dc2bf-9097-485f-8beb-88e8b3d303ff/master.m3u8"
              isPlaying={isPlaying}
              isMuted={isMuted}
              volume={volume}
              onPlayStateChange={setIsPlaying}
              channelName={activeChannel.name}
            />
          )}

          {/* Fallback Animated Station Billboard for T.E.A.R.S. Channel */}
          {currentChannelId === 'tears-prime' && streamViewMode === 'station-graphic' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-zinc-900 to-amber-950/40 flex items-center justify-center p-4">
              {/* Studio Stage Lighting Simulation */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-red-500/10 blur-[90px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 text-center px-4 max-w-xl flex flex-col items-center">
                {/* Silver Medallion Logo (Screenshot 5 Hero Style - Completely Filling Circle) */}
                <div className="relative mb-3 group/logo">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full shadow-2xl border-2 border-slate-300 overflow-hidden flex items-center justify-center bg-slate-900">
                    <img
                      src="/app-media/app_logo.jpg"
                      alt="T.E.A.R.S. Channel Medallion"
                      className="w-full h-full object-cover scale-[1.46] transition-transform group-hover:scale-[1.54]"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 px-2 py-0.5 bg-red-600 text-white font-black text-[10px] rounded-full uppercase tracking-wider shadow">
                    LIVE
                  </div>
                </div>

                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  T.E.A.R.S. Channel 24/7 Primetime
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md">
                  Now Airing: <strong className="text-amber-400">A Perfect Murder (2025)</strong> — True Crime Mystery Special
                </p>

                {/* View Schedule Button (matching Screenshot 5) */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={onNavigateToSchedule}
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>View Schedule</span>
                  </button>
                  <button
                    onClick={() => setStreamViewMode('live-hls')}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Switch to Live Video</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentChannelId === 'real-estate-tv' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#05131e] via-[#091b2c] to-[#12283d] flex items-center justify-center">
              {/* Real Estate Grid Lines and Blueprint Simulation */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
              
              <div className="relative z-10 text-center px-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/80 backdrop-blur-md rounded-md border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-4">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>EXCLUSIVE LAND TOUR</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                  Woodward Commercial Corridor Acquisition
                </h2>
                <p className="text-cyan-100/80 text-sm sm:text-base leading-relaxed">
                  2.85 Acres of B4-Zoned Commercial Land with high-volume vehicular traffic. Clean title, shovel-ready site inspection with Jeanell Land.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button 
                    onClick={onNavigateToRealEstate}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs rounded-lg transition-colors shadow-lg"
                  >
                    View Parcel Dossier & Acreage
                  </button>
                  <span className="text-xs font-mono text-cyan-400/90 py-2">
                    MLS / LAND ID: #DET-WD-285
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentChannelId === 'tear-radio' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#180e29] via-[#0e0717] to-[#040108] flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px]" />
              
              <div className="relative z-10 text-center px-6 max-w-xl">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-xl shadow-purple-900/40">
                  <Radio className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  T.E.A.R.adio 24/7 Nationwide Broadcast
                </h2>
                <p className="text-purple-200/90 text-sm mb-4">
                  Now Streaming: Motown Afternoon Soul, Smooth Jazz & Driver Traffic Safety Dispatch
                </p>

                {/* Animated Audio Equalizer Bars */}
                <div className="flex items-end justify-center gap-1.5 h-16 py-2 px-4 bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/20 max-w-xs mx-auto">
                  {audioVisualizerLevels.map((lvl, idx) => (
                    <div 
                      key={idx}
                      className="w-2 rounded-t transition-all duration-150 bg-gradient-to-t from-purple-500 via-amber-400 to-amber-200"
                      style={{ height: isPlaying ? `${lvl}%` : '8%' }}
                    />
                  ))}
                </div>

                <p className="text-xs text-slate-400 mt-4 font-mono">
                  {isPlaying ? 'AUDIO ON-AIR · LIVE FROM DETROIT' : 'AUDIO PAUSED'}
                </p>
              </div>
            </div>
          )}

          {currentChannelId === 'business-spotlight' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950/50 flex items-center justify-center">
              <div className="relative z-10 text-center px-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/80 backdrop-blur-md rounded-md border border-blue-500/40 text-blue-300 text-xs font-semibold mb-4">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>INNOVATION & ADVERTISEMENT</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                  S.T.E.A.R.Safe Technologies & Motor City Commerce
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Spotlighting patented automotive safety technology, driver protection systems, and high-impact commercial advertisements across Roku TV.
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button 
                    onClick={onNavigateToAdvertise}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs rounded-lg transition-colors"
                  >
                    Book Commercial Airtime
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CRT Broadcast Scanlines Overlay */}
          <div className="scanlines absolute inset-0 z-20 pointer-events-none opacity-40" />

          {/* Top Broadcast Overlay: On-Air Bug + Resolution + Viewers */}
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600/90 text-white rounded font-bold text-xs tracking-wider uppercase shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>LIVE</span>
              </div>
              <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold rounded border border-white/10">
                {activeChannel.number}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/90">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 font-mono tabular-nums">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{viewerCount.toLocaleString()} watching</span>
              </div>
              <div className="hidden sm:block px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[11px] font-mono text-amber-400">
                {streamQuality}
              </div>
            </div>
          </div>

          {/* Lower Thirds Closed Caption Bar */}
          {showCaptions && isPlaying && (
            <div className="absolute bottom-16 left-6 right-6 z-30 pointer-events-none text-center">
              <span className="inline-block px-4 py-1.5 bg-black/85 backdrop-blur-md text-amber-200 text-xs sm:text-sm font-medium rounded-md border border-white/10 shadow-lg">
                [Jeanell Land]: &quot;Welcome to T.E.A.R.S. Channel — connecting entertainment, real estate empowerment, and nationwide broadcasting.&quot;
              </span>
            </div>
          )}

          {/* Bottom Video Controls Scrim */}
          <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 flex items-center justify-between gap-4">
            
            {/* Playback & Volume */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center transition-transform hover:scale-105"
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={toggleMute}
                  className="p-1.5 text-slate-300 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  aria-label="Volume"
                />
              </div>

              <div className="hidden sm:block text-xs text-slate-300">
                <span className="font-semibold text-white">{activeChannel.name}</span>
                <span className="mx-2 text-slate-600">·</span>
                <span className="text-slate-400">{activeChannel.tagline}</span>
              </div>
            </div>

            {/* Extra Controls */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setShowCaptions(prev => !prev)}
                className={`px-2 py-1 rounded border text-[11px] font-bold transition-colors ${
                  showCaptions 
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                    : 'text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Toggle Subtitles"
              >
                CC
              </button>

              <button
                onClick={() => setShowChat(prev => !prev)}
                className={`px-2.5 py-1 rounded border text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  showChat 
                    ? 'bg-amber-400 text-black border-amber-400 shadow-sm' 
                    : 'text-slate-300 border-slate-700 hover:text-white hover:bg-slate-800'
                }`}
                title="Toggle Real-Time Broadcast Chat (Spam Protected)"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => setStreamQuality(prev => prev === '4K HDR' ? '1080p60' : '4K HDR')}
                className="px-2 py-1 rounded border border-slate-700 text-slate-300 hover:text-white text-[11px] font-mono hidden sm:block"
                title="Change Quality"
              >
                {streamQuality}
              </button>

              <button
                onClick={handleShare}
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
                title="Share stream link"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
                title="Fullscreen"
                aria-label="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Live News & Traffic Ticker Tape */}
        <div className="bg-[#0f172a] border-t border-slate-800 py-2 px-4 flex items-center overflow-hidden">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider shrink-0 mr-4 pr-3 border-r border-slate-700">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>DISPATCH TICKER</span>
          </div>
          <div className="overflow-hidden relative w-full">
            <div className="animate-ticker text-xs text-slate-300 font-mono">
              {TICKER_HEADLINES.map((headline, idx) => (
                <span key={idx} className="mr-12">
                  <span className="text-amber-400 mr-2">◆</span>
                  {headline}
                </span>
              ))}
            </div>
          </div>
        </div>

        </div>
      </div>

        {/* Live Broadcast Chat Column */}
        {showChat && (
          <div className="lg:col-span-4 h-[540px] sm:h-[600px] lg:h-[590px] xl:h-[640px] flex flex-col">
            <LiveBroadcastChat
              channelId={currentChannelId}
              channelName={`${activeChannel.number}: ${activeChannel.name}`}
              isDocked={true}
              onToggleDock={() => setShowChat(false)}
            />
          </div>
        )}

      </div>

      {/* Live Chat Minimized Banner */}
      {!showChat && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs shadow-lg">
          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Live Broadcast Chat Minimized</span>
              <span className="text-[11px] text-slate-400">Read-only mode active for guests to prevent broadcast spam.</span>
            </div>
          </div>
          <button
            onClick={() => setShowChat(true)}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open Live Chat</span>
          </button>
        </div>
      )}

      {copiedLink && (
        <div className="text-xs text-center text-amber-400 bg-amber-400/10 border border-amber-400/30 py-2 rounded-lg">
          Direct stream link copied to clipboard!
        </div>
      )}

      {/* Quick Channel Selector Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CHANNELS.map(ch => {
          const isActive = ch.id === currentChannelId;
          return (
            <button
              key={ch.id}
              onClick={() => onSelectChannel(ch.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isActive
                  ? 'bg-slate-900 border-amber-400/70 ring-1 ring-amber-400/50 shadow-md'
                  : 'bg-[#0f172a]/70 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold text-amber-400">{ch.number}</span>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  {ch.id === 'tear-radio' ? <Radio className="w-3 h-3 text-purple-400" /> : <Tv className="w-3 h-3 text-amber-400" />}
                  <span>{ch.resolution}</span>
                </div>
              </div>
              <h4 className="text-sm font-bold text-white truncate mb-0.5">{ch.name}</h4>
              <p className="text-xs text-slate-400 truncate">{ch.nowPlaying}</p>
              {isActive && (
                <div className="mt-2 text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Currently Watching
                </div>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};
