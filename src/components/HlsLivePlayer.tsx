import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { AlertCircle, RefreshCw, Play, Volume2, VolumeX, ShieldCheck, Tv, Layers } from 'lucide-react';

interface HlsLivePlayerProps {
  streamUrl?: string;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  onPlayStateChange?: (playing: boolean) => void;
  channelName?: string;
}

export const HlsLivePlayer: React.FC<HlsLivePlayerProps> = ({
  streamUrl = 'https://stream.ott.tvstartup.com/261dc2bf-9097-485f-8beb-88e8b3d303ff/master.m3u8',
  isPlaying,
  isMuted,
  volume,
  onPlayStateChange,
  channelName = 'T.E.A.R.S. Channel 24/7 Primetime'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const clapprContainerRef = useRef<HTMLDivElement>(null);
  const clapprInstanceRef = useRef<any>(null);

  const [playerMode, setPlayerMode] = useState<'hlsjs' | 'clappr'>('hlsjs');
  const [streamStatus, setStreamStatus] = useState<'loading' | 'playing' | 'error' | 'paused'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clapprLoaded, setClapprLoaded] = useState(false);

  // -------------------------------------------------------------
  // MODE 1: HLS.JS & NATIVE HTML5 PLAYBACK (Zero-dependency, clean React)
  // -------------------------------------------------------------
  useEffect(() => {
    if (playerMode !== 'hlsjs') return;

    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    setStreamStatus('loading');
    setErrorMessage(null);

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setStreamStatus('playing');
        if (isPlaying) {
          video.play().catch(() => {
            // Autoplay with audio was blocked by browser policy, fallback to muted
            video.muted = true;
            video.play().catch(() => setStreamStatus('paused'));
          });
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorMessage('Network connection to live stream node interrupted. Reconnecting...');
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setErrorMessage('Media decoding error. Recovering stream playback...');
              hls?.recoverMediaError();
              break;
            default:
              setStreamStatus('error');
              setErrorMessage('Unable to connect to live stream feed.');
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari / iOS HLS support
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setStreamStatus('playing');
        if (isPlaying) {
          video.play().catch(() => {
            video.muted = true;
            video.play().catch(() => setStreamStatus('paused'));
          });
        }
      });
      video.addEventListener('error', () => {
        setStreamStatus('error');
        setErrorMessage('Native video playback encountered an error.');
      });
    } else {
      setStreamStatus('error');
      setErrorMessage('HLS live streaming is not supported on this browser.');
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl, playerMode]);

  // Sync play/pause with parent controls
  useEffect(() => {
    if (playerMode !== 'hlsjs') return;
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, playerMode]);

  // Sync volume and mute with parent controls
  useEffect(() => {
    if (playerMode !== 'hlsjs') return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.volume = volume;
  }, [isMuted, volume, playerMode]);

  // -------------------------------------------------------------
  // MODE 2: CLAPPR OFFICIAL EMBED (User-provided exact snippet)
  // -------------------------------------------------------------
  useEffect(() => {
    if (playerMode !== 'clappr') return;

    let isMounted = true;
    setStreamStatus('loading');

    const loadClapprScripts = async () => {
      // Helper to dynamically load script tag if not already loaded
      const loadScript = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const s = document.createElement('script');
          s.type = 'text/javascript';
          s.src = src;
          s.async = false;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error(`Failed to load ${src}`));
          document.head.appendChild(s);
        });
      };

      try {
        await loadScript('https://vod-lb-cdn.tvstartupengine.com/tvs-asset/library/clappr.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/hls.js@latest');
        await loadScript('https://cdn.jsdelivr.net/npm/@clappr/hlsjs-playback@latest/dist/hlsjs-playback.min.js');

        if (!isMounted) return;

        setClapprLoaded(true);

        const Clappr = (window as any).Clappr;
        const HlsjsPlayback = (window as any).HlsjsPlayback;

        if (Clappr && clapprContainerRef.current) {
          // Clean previous instance if any
          clapprContainerRef.current.innerHTML = '<div id="video_holder" style="width:100%;height:100%;"></div>';

          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          const player = new Clappr.Player({
            parentId: '#video_holder',
            source: streamUrl,
            width: '100%',
            height: '100%',
            autoPlay: true,
            mute: true,
            playback: { playsinline: true },
            plugins: isMobile ? [] : (HlsjsPlayback ? [HlsjsPlayback] : [])
          });

          clapprInstanceRef.current = player;
          setStreamStatus('playing');
        }
      } catch (err) {
        if (isMounted) {
          setStreamStatus('error');
          setErrorMessage('Could not load TVStartup Clappr CDN libraries.');
        }
      }
    };

    loadClapprScripts();

    return () => {
      isMounted = false;
      if (clapprInstanceRef.current && typeof clapprInstanceRef.current.destroy === 'function') {
        try {
          clapprInstanceRef.current.destroy();
        } catch {}
      }
    };
  }, [playerMode, streamUrl]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      
      {/* Mode 1: Hls.js native HTML5 video */}
      {playerMode === 'hlsjs' && (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          autoPlay
          muted={isMuted}
          onPlay={() => {
            setStreamStatus('playing');
            onPlayStateChange?.(true);
          }}
          onPause={() => {
            setStreamStatus('paused');
            onPlayStateChange?.(false);
          }}
          onError={() => {
            setStreamStatus('error');
          }}
        />
      )}

      {/* Mode 2: Clappr Player Container */}
      {playerMode === 'clappr' && (
        <div 
          ref={clapprContainerRef}
          className="w-full h-full relative"
          style={{ width: '100%', height: '100%' }}
        >
          <div id="video_holder" style={{ width: '100%', height: '100%' }} />
        </div>
      )}

      {/* Engine Switcher / Status Pill (Floating discreetly in top right) */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-emerald-400 font-bold">HLS LIVE</span>
        <span className="text-slate-600">·</span>
        <button
          onClick={() => setPlayerMode(playerMode === 'hlsjs' ? 'clappr' : 'hlsjs')}
          className="text-amber-400 hover:text-white transition-colors cursor-pointer"
          title={`Currently using ${playerMode === 'hlsjs' ? 'Native Hls.js' : 'Clappr Player'}. Click to toggle.`}
        >
          {playerMode === 'hlsjs' ? 'Engine: HLS.js' : 'Engine: Clappr'}
        </button>
      </div>

      {/* Loading state indicator */}
      {streamStatus === 'loading' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20 pointer-events-none">
          <div className="flex flex-col items-center gap-2 text-center p-4">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              CONNECTING TO LIVE BROADCAST FEED...
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              stream.ott.tvstartup.com / master.m3u8
            </span>
          </div>
        </div>
      )}

      {/* Error / Fallback display */}
      {streamStatus === 'error' && (
        <div className="absolute inset-0 bg-slate-950 flex items-center justify-center p-6 z-20 text-center">
          <div className="max-w-md space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <h4 className="text-white font-bold text-sm">
              Live Stream Connection Diagnostics
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {errorMessage || 'The live broadcast server stream is buffering or undergoing scheduled feed maintenance.'}
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setPlayerMode('hlsjs');
                  setStreamStatus('loading');
                }}
                className="px-3.5 py-1.5 bg-amber-400 text-black font-bold text-xs rounded-lg hover:bg-amber-300 cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Stream</span>
              </button>
              <button
                onClick={() => setPlayerMode('clappr')}
                className="px-3.5 py-1.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg hover:text-white border border-slate-700 cursor-pointer"
              >
                <span>Try Clappr Embed</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
