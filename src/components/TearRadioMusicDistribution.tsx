import React, { useState } from 'react';
import { useMusicDistributionStore } from '../hooks/useMusicDistributionStore';
import { AudioTrackRelease } from '../types';
import { 
  Radio, Play, Pause, Volume2, VolumeX, Music, Disc, Upload, 
  Sparkles, CheckCircle2, Globe, Layers, Download, Plus, Trash2, 
  Share2, ArrowRight, ExternalLink, Sliders, DollarSign, Award,
  Headphones, Check, Copy, Flame
} from 'lucide-react';

interface TearRadioMusicDistributionProps {
  onTuneInToRadio?: () => void;
}

export const TearRadioMusicDistribution: React.FC<TearRadioMusicDistributionProps> = ({ onTuneInToRadio }) => {
  const {
    releases,
    activeTrack,
    setActiveTrack,
    isPlayingAudio,
    setIsPlayingAudio,
    addTrackRelease,
    toggleTearRadioAirplay,
    dispatchDspDelivery,
    deleteRelease,
    generateDdexXml
  } = useMusicDistributionStore();

  const [isAddTrackOpen, setIsAddTrackOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedDdexTrack, setSelectedDdexTrack] = useState<AudioTrackRelease | null>(null);
  const [isDdexModalOpen, setIsDdexModalOpen] = useState(false);

  // New Track Intake Form State
  const [trackTitle, setTrackTitle] = useState('');
  const [artistName, setArtistName] = useState('Jeanell Land');
  const [featuredArtists, setFeaturedArtists] = useState('');
  const [genre, setGenre] = useState<AudioTrackRelease['genre']>('Detroit Soul & Motown');
  const [bpm, setBpm] = useState<number>(105);
  const [musicalKey, setMusicalKey] = useState('E♭ Major');
  const [explicit, setExplicit] = useState(false);
  const [duration, setDuration] = useState('03:45');
  const [songwriterSplit, setSongwriterSplit] = useState(50);
  const [producerSplit, setProducerSplit] = useState(30);
  const [vocalistSplit, setVocalistSplit] = useState(20);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle.trim()) return;

    const gradients = [
      'from-amber-600 via-red-700 to-purple-900',
      'from-cyan-600 via-blue-800 to-indigo-950',
      'from-purple-700 via-rose-800 to-black',
      'from-emerald-600 via-teal-800 to-slate-900'
    ];
    const pickedGradient = gradients[Math.floor(Math.random() * gradients.length)];

    addTrackRelease({
      title: trackTitle.trim(),
      artist: artistName.trim() || 'Detroit Sovereign Artist',
      featuredArtists: featuredArtists.trim() || undefined,
      albumOrSingle: 'Single',
      genre,
      bpm,
      musicalKey,
      explicit,
      releaseDate: new Date().toISOString().split('T')[0],
      duration: duration.trim() || '03:30',
      audioFileName: `${trackTitle.trim().replace(/\s+/g, '_')}_Master_24bit_48k.wav`,
      artworkGradient: pickedGradient,
      tearRadioAirplayActive: true,
      royaltySplits: {
        songwriter: songwriterSplit,
        producer: producerSplit,
        vocalist: vocalistSplit,
        publisher: 0
      }
    });

    setTrackTitle('');
    setFeaturedArtists('');
    setIsAddTrackOpen(false);
  };

  const handleDownloadDdex = (track: AudioTrackRelease) => {
    const xml = generateDdexXml(track);
    const dataStr = 'data:text/xml;charset=utf-8,' + encodeURIComponent(xml);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DDEX-ERN43-${track.isrc}-${track.title.replace(/\s+/g, '_')}.xml`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const totalStreams = releases.reduce((sum, r) => sum + r.streamCount, 0);
  const totalRoyalties = releases.reduce((sum, r) => sum + r.totalRoyaltiesEarned, 0);
  const airplayCount = releases.filter(r => r.tearRadioAirplayActive).length;

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-[#180a2c] border border-purple-500/40 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            <Radio className="w-4 h-4 text-purple-400" />
            <span>T.E.A.R.ADIO MUSIC DISTRIBUTION · DISTROKID / SPOTIFY / APPLE MUSIC HUB</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Audio Music Distribution &amp; T.E.A.R.adio Airplay Hub
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Distribute your master recordings globally to <strong>Spotify, Apple Music, Tidal, Amazon Music, and YouTube Music</strong> with official <strong>ISRC codes &amp; DDEX metadata</strong>. Queue your singles directly onto <strong>T.E.A.R.adio 24/7 live stream</strong> with <strong>100% artist royalties and zero distributor cuts</strong>.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% Master Ownership</span>
            </span>
            <span>·</span>
            <span className="text-purple-300">Instant T.E.A.R.adio 24/7 Airplay Queue</span>
            <span>·</span>
            <span className="text-cyan-400">DDEX ERN 4.3 XML Standard</span>
            <span>·</span>
            <span className="text-amber-400">Automated Split-Sheet Royalties</span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mb-16" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block">
            Catalog Track Releases
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {releases.length} Tracks
          </div>
          <span className="text-[11px] text-slate-400 block font-mono">
            Singles &amp; Master Recordings
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
            T.E.A.R.adio Airplay Status
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {airplayCount} Active On-Air
          </div>
          <span className="text-[11px] text-slate-400 block font-mono">
            Broadcasting 24/7 Worldwide
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-1">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
            Global DSP Streams
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalStreams.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 block font-mono">
            Spotify, Apple, Tidal, Amazon
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40 space-y-1">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
            Total Royalties Earned
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            ${totalRoyalties.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 block font-mono">
            100% Direct to Artist Vault
          </span>
        </div>

      </div>

      {/* Featured Live Player Console */}
      {activeTrack && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0e111d] to-slate-950 border-2 border-purple-500/40 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            
            {/* Track Info with Gradient Vinyl Cover Art */}
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${activeTrack.artworkGradient} flex items-center justify-center shadow-2xl border border-white/20 shrink-0 relative group`}>
                <Disc className={`w-10 h-10 text-white/90 ${isPlayingAudio ? 'animate-spin' : ''}`} />
                <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 text-white fill-current" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 font-mono border border-purple-500/30">
                    NOW AUDITIONING
                  </span>
                  {activeTrack.tearRadioAirplayActive && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 font-mono border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>ON T.E.A.R.ADIO ROTATION</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  {activeTrack.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {activeTrack.artist} {activeTrack.featuredArtists && <span className="text-slate-400">(feat. {activeTrack.featuredArtists})</span>}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-0.5">
                  <span className="text-cyan-300">{activeTrack.genre}</span>
                  <span>·</span>
                  <span>{activeTrack.bpm} BPM</span>
                  <span>·</span>
                  <span>Key: {activeTrack.musicalKey}</span>
                  <span>·</span>
                  <span>ISRC: {activeTrack.isrc}</span>
                </div>
              </div>
            </div>

            {/* Audio Transport Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-105"
              >
                {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                <span>{isPlayingAudio ? 'Pause Track' : 'Audition Audio Stream'}</span>
              </button>

              <button
                onClick={() => handleDownloadDdex(activeTrack)}
                className="w-full sm:w-auto px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                title="Download DDEX ERN 4.3 XML metadata standard for Spotify & Apple Music"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export DDEX XML</span>
              </button>
            </div>

          </div>

          {/* Waveform Scrubber Simulation */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-500">01:14</span>
            <div className="flex-1 flex items-end gap-1 h-8 bg-black/60 p-1.5 rounded-lg border border-slate-800">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    i < 18 
                      ? 'bg-amber-400' 
                      : i < 30 
                      ? 'bg-purple-500/80' 
                      : 'bg-slate-700'
                  }`}
                  style={{ height: `${(Math.sin(i * 0.4) * 40 + 50)}%` }}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-500">{activeTrack.duration}</span>
          </div>

        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Disc className="w-4 h-4 text-purple-400" />
            <span>Master Audio Catalog &amp; Multi-DSP Delivery Pipeline</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Deliver singles and albums to worldwide streaming platforms and maintain 100% of your royalties.
          </p>
        </div>

        <button
          onClick={() => setIsAddTrackOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Upload Audio Single (DistroKid Flow)</span>
        </button>
      </div>

      {/* Releases Catalog Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Track &amp; Artist</th>
                <th className="py-3 px-4 font-semibold">Genre &amp; Key</th>
                <th className="py-3 px-4 font-semibold">ISRC &amp; UPC</th>
                <th className="py-3 px-4 font-semibold text-center">T.E.A.R.adio Airplay</th>
                <th className="py-3 px-4 font-semibold">DSP Status</th>
                <th className="py-3 px-4 font-semibold text-right">Streams</th>
                <th className="py-3 px-4 font-semibold text-right">Royalties</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {releases.map(track => (
                <tr 
                  key={track.id} 
                  className={`hover:bg-slate-800/40 transition-colors ${
                    activeTrack?.id === track.id ? 'bg-purple-950/20' : ''
                  }`}
                >
                  
                  {/* Title & Artist */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${track.artworkGradient} flex items-center justify-center shrink-0`}>
                        <Music className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{track.title}</span>
                          {track.explicit && (
                            <span className="px-1 rounded text-[9px] bg-red-950 text-red-400 font-mono">E</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{track.artist}</span>
                      </div>
                    </div>
                  </td>

                  {/* Genre & Key */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-200">{track.genre}</div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {track.bpm} BPM · {track.musicalKey}
                    </span>
                  </td>

                  {/* ISRC & UPC */}
                  <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                    <div className="flex items-center gap-1 text-cyan-300">
                      <span>{track.isrc}</span>
                      <button
                        onClick={() => copyToClipboard(track.isrc, `isrc-${track.id}`)}
                        className="text-slate-500 hover:text-white"
                        title="Copy ISRC"
                      >
                        {copiedId === `isrc-${track.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-500">UPC: {track.upc}</div>
                  </td>

                  {/* T.E.A.R.adio Airplay Toggle */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => toggleTearRadioAirplay(track.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono transition-all ${
                        track.tearRadioAirplayActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                      }`}
                    >
                      {track.tearRadioAirplayActive ? '● ON AIR 24/7' : 'OFF AIR'}
                    </button>
                  </td>

                  {/* DSP Status Badges */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span 
                        onClick={() => dispatchDspDelivery(track.id, 'spotify')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                          track.dspDistributions.spotify === 'Live & Streaming' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-slate-800 text-slate-400'
                        }`}
                        title="Spotify Delivery Status"
                      >
                        Spotify
                      </span>
                      <span 
                        onClick={() => dispatchDspDelivery(track.id, 'appleMusic')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                          track.dspDistributions.appleMusic === 'Live & Streaming' 
                            ? 'bg-pink-950 text-pink-400 border border-pink-500/30' 
                            : 'bg-slate-800 text-slate-400'
                        }`}
                        title="Apple Music Delivery Status"
                      >
                        Apple
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30"
                        title="Tidal & Amazon Music"
                      >
                        Tidal
                      </span>
                    </div>
                  </td>

                  {/* Streams */}
                  <td className="py-3 px-4 font-mono text-right text-slate-300 whitespace-nowrap">
                    {track.streamCount.toLocaleString()}
                  </td>

                  {/* Royalties */}
                  <td className="py-3 px-4 font-mono font-bold text-right text-amber-400 whitespace-nowrap">
                    ${track.totalRoyaltiesEarned.toFixed(2)}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setActiveTrack(track);
                          setIsPlayingAudio(true);
                        }}
                        className="p-1.5 bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-black rounded-lg transition-colors"
                        title="Play in Console"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={() => handleDownloadDdex(track)}
                        className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 rounded-lg transition-colors"
                        title="Export DDEX XML"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteRelease(track.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Remove Track"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: UPLOAD AUDIO SINGLE / DISTROKID INTAKE */}
      {/* ============================================================== */}
      {isAddTrackOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Distribute New Single (DistroKid / Spotify Flow)
                </h3>
              </div>
              <button
                onClick={() => setIsAddTrackOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateTrackSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Track Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Detroit Riverfront Twilight Soul"
                  value={trackTitle}
                  onChange={e => setTrackTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Primary Artist Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={artistName}
                    onChange={e => setArtistName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Featured Artists (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Detroit Symphony Brass"
                    value={featuredArtists}
                    onChange={e => setFeaturedArtists(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Genre *
                  </label>
                  <select
                    value={genre}
                    onChange={e => setGenre(e.target.value as any)}
                    className="w-full px-3 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Detroit Soul & Motown">Detroit Soul &amp; Motown</option>
                    <option value="Urban R&B">Urban R&amp;B</option>
                    <option value="Smooth Jazz">Smooth Jazz</option>
                    <option value="Hip-Hop & Trap">Hip-Hop &amp; Trap</option>
                    <option value="Gospel">Urban Gospel</option>
                    <option value="Instrumental & Score">Instrumental &amp; Film Score</option>
                    <option value="Electronic / House">Electronic / Detroit House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tempo (BPM)
                  </label>
                  <input
                    type="number"
                    value={bpm}
                    onChange={e => setBpm(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 bg-black border border-slate-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Musical Key
                  </label>
                  <input
                    type="text"
                    value={musicalKey}
                    onChange={e => setMusicalKey(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-slate-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Duration (MM:SS)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="03:45"
                    className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={explicit}
                      onChange={e => setExplicit(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                    />
                    <span className="text-slate-300 text-xs">Explicit Lyrics Advisory</span>
                  </label>
                </div>
              </div>

              {/* Split Sheets Configuration */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block">Automated Royalty Split Sheet:</span>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-slate-400 block">Songwriter %</label>
                    <input
                      type="number"
                      value={songwriterSplit}
                      onChange={e => setSongwriterSplit(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Producer %</label>
                    <input
                      type="number"
                      value={producerSplit}
                      onChange={e => setProducerSplit(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Vocalist %</label>
                    <input
                      type="number"
                      value={vocalistSplit}
                      onChange={e => setVocalistSplit(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddTrackOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg transition-all"
                >
                  Release to T.E.A.R.adio &amp; DSPs
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
