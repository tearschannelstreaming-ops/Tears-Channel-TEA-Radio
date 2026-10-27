import React, { useState, useEffect } from 'react';
import { Radio, Play, Pause, Volume2, VolumeX, Car, ShieldAlert, Award, Music, ArrowRight } from 'lucide-react';
import { tearRadioAudio } from '../utils/audioSynth';

interface TearRadioBarProps {
  onNavigateToDistribution?: () => void;
}

export const TearRadioBar: React.FC<TearRadioBarProps> = ({ onNavigateToDistribution }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [trafficFeed, setTrafficFeed] = useState([
    { route: 'I-75 Northbound', condition: 'Clear', speed: '65 mph', update: 'No delays through downtown Detroit corridor.' },
    { route: 'I-94 Eastbound', condition: 'Moderate', speed: '48 mph', update: 'Brief bridge work near Conner St exit.' },
    { route: 'M-10 Lodge Freeway', condition: 'Fluid', speed: '55 mph', update: 'All lanes open and flowing smoothly.' },
    { route: 'Southfield Freeway', condition: 'Clear', speed: '60 mph', update: 'Clear pavement and optimal visibility.' }
  ]);
  const [eqBars, setEqBars] = useState<number[]>([30, 50, 75, 40, 85, 90, 60, 45, 70, 80, 65, 50]);

  useEffect(() => {
    if (!isPlaying) {
      tearRadioAudio.stop();
      return;
    }
    tearRadioAudio.setVolume(isMuted ? 0 : volume);
    tearRadioAudio.start();

    const interval = setInterval(() => {
      setEqBars(Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 15));
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying, isMuted, volume]);

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

  return (
    <div className="space-y-8">
      
      {/* Radio Station Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-[#120824] border border-purple-500/30 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-300">
              <Radio className="w-4 h-4 text-purple-400" />
              <span>24/7 NATIONWIDE BROADCAST NETWORK</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              T.E.A.R.adio Live Broadcast
            </h2>
            <p className="text-purple-100/80 text-sm sm:text-base leading-relaxed">
              Delivering urban R&amp;B classics, smooth jazz, real-time driver traffic safety dispatch, wealth &amp; financial empowerment news nationwide. Proudly affiliated with S.T.E.A.R.Safe Technologies Inc.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-purple-300 font-mono pt-1">
              <span>LOSSLESS WEB STREAM</span>
              <span>·</span>
              <span>DETROIT BROADCAST DESK</span>
              <span>·</span>
              <span>COMMERCIAL-FREE SESSIONS</span>
            </div>
          </div>

          {/* Interactive Radio Player Console */}
          <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-md w-full lg:w-80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">NOW PLAYING</span>
                <h4 className="text-sm font-bold text-white truncate">Detroit Smooth Soul &amp; Jazz</h4>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isPlaying ? 'bg-red-500/80 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {isPlaying ? 'ON AIR' : 'OFFLINE'}
              </span>
            </div>

            {/* EQ Visualizer */}
            <div className="flex items-end justify-center gap-1.5 h-12 bg-slate-950/60 p-2 rounded-lg border border-purple-900/40">
              {eqBars.map((val, idx) => (
                <div
                  key={idx}
                  className="w-2 rounded-t bg-gradient-to-t from-purple-500 via-amber-400 to-amber-200 transition-all duration-150"
                  style={{ height: isPlaying ? `${val}%` : '6%' }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                onClick={togglePlay}
                className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-400/20"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause Station' : 'Listen Live'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 text-slate-400 hover:text-white"
                  title="Mute / Unmute"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  aria-label="Radio volume"
                />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* T.E.A.R.adio Music Distribution Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
            <Radio className="w-4 h-4 text-purple-400" />
            <span>ARTIST &amp; MUSIC CREATOR LAUNCHPAD (DISTROKID / SPOTIFY / APPLE MUSIC)</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Distribute Your Music to Global DSPs &amp; Broadcast Live on T.E.A.R.adio
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Upload your master audio recordings, generate DDEX ERN 4.3 XML, queue tracks directly onto live 24/7 on-air rotation, and retain 100% of your streaming royalties.
          </p>
        </div>
        <button
          onClick={() => {
            if (onNavigateToDistribution) onNavigateToDistribution();
            else {
              const url = new URL(window.location.href);
              url.searchParams.set('tab', 'music');
              window.history.pushState({}, '', url.toString());
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg transition-all hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <Music className="w-4 h-4" />
          <span>Launch Music Distribution Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Traffic Dispatch Center & Road Safety Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Real-Time Detroit Highway Traffic Dispatch
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">UPDATED CONTINUOUSLY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trafficFeed.map((route, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{route.route}</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">{route.condition}</span>
              </div>
              <div className="text-xs text-amber-300 font-mono">Flow: {route.speed}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{route.update}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Driver Safety & Technology Affiliation */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">S.T.E.A.R.Safe Technologies Inc. Safety Mission</h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-2xl">
              T.E.A.R.adio provides drivers with vital real-time audio guidance to prevent highway collisions, protect commercial transit operators, and deliver actionable road alerts when every second matters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-slate-400">Nationwide Broadcast</span>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-mono text-amber-400 font-semibold">T.E.A.R.S. Audio Network</span>
        </div>
      </div>

    </div>
  );
};
