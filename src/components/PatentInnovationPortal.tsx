import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Sparkles, Cpu, Layers, Activity, Radio, Tv, Building2, 
  Smartphone, FileText, CheckCircle2, ChevronRight, Play, Pause, 
  Volume2, VolumeX, AlertTriangle, RefreshCw, Copy, Check, ExternalLink, 
  Compass, Zap, Database, Lock, ArrowUpRight, Award, Binary
} from 'lucide-react';

interface PatentInnovationPortalProps {
  onSelectTab: (tab: string) => void;
}

export const PatentInnovationPortal: React.FC<PatentInnovationPortalProps> = ({ onSelectTab }) => {
  const [activeClaimId, setActiveClaimId] = useState<string>('claim-1');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Testbench Simulation State
  const [simPlaying, setSimPlaying] = useState(false);
  const [simTimecode, setSimTimecode] = useState(14.2);
  const [simActiveParcel, setSimActiveParcel] = useState({
    id: '#DET-WD-285',
    title: 'Woodward Commercial Development Parcel (2.85 Acres)',
    coordinates: '42.3487° N, 83.0567° W',
    zoning: 'B4 General Business / Mixed Use',
    broker: 'Jeanell Land, CEO & Land Broker',
    token: 'AC8E6C053'
  });

  // Highway Safety Ducking Test State
  const [duckingActive, setDuckingActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(88);
  const [safetyAlertMsg, setSafetyAlertMsg] = useState<string | null>(null);

  // Simulation timer for video + MLS spatial telemetry synchronization
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (simPlaying) {
      timer = setInterval(() => {
        setSimTimecode(prev => {
          const next = Number((prev + 0.5).toFixed(1));
          if (next > 45) {
            setSimActiveParcel({
              id: '#DET-RF-412',
              title: 'Riverfront Opportunity Assemblage (4.12 Acres)',
              coordinates: '42.3298° N, 83.0234° W',
              zoning: 'SD4 Special Mixed Waterfront Development',
              broker: 'Jeanell Land, CEO & Land Broker',
              token: 'AC8E6C053'
            });
          } else {
            setSimActiveParcel({
              id: '#DET-WD-285',
              title: 'Woodward Commercial Development Parcel (2.85 Acres)',
              coordinates: '42.3487° N, 83.0567° W',
              zoning: 'B4 General Business / Mixed Use',
              broker: 'Jeanell Land, CEO & Land Broker',
              token: 'AC8E6C053'
            });
          }
          return next > 90 ? 0 : next;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [simPlaying]);

  // Audio ducking simulation
  const triggerSafetyDucking = () => {
    setDuckingActive(true);
    setAudioLevel(22); // Program audio ducks by -14dB to -20dB
    setSafetyAlertMsg('S.T.E.A.R.Safe ALERT: High-wind hazard on I-94 at Lodge Interchange. Reduce speed to 45 mph.');
    setTimeout(() => {
      setDuckingActive(false);
      setAudioLevel(88); // Audio recovers smoothly
      setSafetyAlertMsg(null);
    }, 4500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const PATENT_CLAIMS = [
    {
      id: 'claim-1',
      number: 'System Claim 1',
      title: 'Synchronized Multi-Stream Spatial Real Estate Media Engine (SMM-RE Engine)',
      category: 'Geospatial Broadcast Telemetry',
      summary: 'A computer-implemented media broadcasting architecture that binds high-definition linear broadcast streams with real-time geospatial MLS parcel telemetry, generating non-intrusive interactive on-screen GIS coordinates, zoning indices, drone aerial sync, and direct client token authentication.',
      technicalSpecs: [
        'Frame-accurate timestamp binding: Associates video SMPTE timecodes with GPS polygonal boundary polygons.',
        'Zero-disruption viewing overlay: Viewers inspect property disclosures and zoning without interrupting live broadcast.',
        'Cryptographic MLS token handshaking: Transmits token "AC8E6C053" to authenticate mobile client apps at https://mls-client.com/AC8E6C053.',
        'Multi-platform telemetry protocol: Decoded simultaneously across Roku TV, Apple iOS, tvOS, and Web browsers.'
      ],
      diagram: [
        { step: '1. Ingest Master Feed', desc: '4K Linear Video + Drone Aerial Telemetry stream ingested via RTMP/HLS' },
        { step: '2. Spatial Indexer', desc: 'Real Estate Engine correlates broadcast timecode with MLS parcel coordinates' },
        { step: '3. Token Handshake', desc: 'Secure token AC8E6C053 binds client session to Broker Jeanell Land' },
        { step: '4. Synced Playout', desc: 'Roku & Mobile viewers receive instant parcel inquiry hotlinks' }
      ]
    },
    {
      id: 'claim-2',
      number: 'System Claim 2',
      title: 'S.T.E.A.R.Safe Highway Telemetry & Autonomous Audio Ducking Protocol',
      category: 'Public Safety & Audio Engineering',
      summary: 'An autonomous public safety broadcast architecture integrated into 24/7 internet radio (T.E.A.R.adio) and TV streams that monitors priority regional transportation hazard telemetry and automatically applies psychoacoustic attenuation (ducking) to program audio to deliver emergency corridor safety alerts.',
      technicalSpecs: [
        'Dynamic priority interrupt: Sensor and state dispatch telemetry interrupts ambient music with <100ms latency.',
        'Smooth psychoacoustic ramp: Attenuates program music by -14dB to -20dB with 300ms attack and 800ms release.',
        'Geographic corridor targeting: Broadcasts hazard advisories specifically relevant to I-75, I-94, I-96, and Lodge corridors.',
        'Continuous compliance: Retains broadcast stream continuity without disconnecting vehicular Apple CarPlay or Bluetooth listeners.'
      ],
      diagram: [
        { step: '1. S.T.E.A.R.Safe Dispatch', desc: 'IoT roadway sensors & highway dispatch send priority hazard packet' },
        { step: '2. Dynamic Audio Attenuator', desc: 'Program audio ducks by -16dB using psychoacoustic DSP filter' },
        { step: '3. Emergency Overlay', desc: 'Voice corridor dispatch delivered with absolute priority' },
        { step: '4. Smooth Volume Restore', desc: 'Broadcast audio ramps back to original volume seamlessly' }
      ]
    },
    {
      id: 'claim-3',
      number: 'System Claim 3',
      title: 'Autonomous Video-MLS Spatial Geocoding & Drone In-Stream Metadata Synchronizer',
      category: 'Computer Vision & Property Data',
      summary: 'An automated computer vision and metadata indexing pipeline that analyzes recorded aerial drone footage, detects commercial parcel boundaries, cross-references county land records with active MLS datasets, and embeds interactive metadata tags into VOD and live broadcast streams.',
      technicalSpecs: [
        'Automated acreage boundary detection for Metro Detroit commercial assemblages.',
        'Direct synchronization between Wayne County assessor parcel IDs and T.E.A.R.S. Channel listings.',
        'In-stream 1-tap buyer walk scheduling routed directly to jeanell@tearschannel.online.',
        'Automatic deduplication and normalization of video drone assets in T.E.A.R.S. Studio CMS.'
      ],
      diagram: [
        { step: '1. Drone Video Analysis', desc: 'Analyzes aerial camera telemetry and flight paths over acreage' },
        { step: '2. County GIS Matching', desc: 'Matches aerial footprint with official municipal parcel registries' },
        { step: '3. MLS Data Enrichment', desc: 'Enriches video asset with zoning, asking price, and utility access' },
        { step: '4. Interactive Viewer Pin', desc: 'Displays clickable interactive parcel dossier during TV playback' }
      ]
    },
    {
      id: 'claim-4',
      number: 'System Claim 4',
      title: 'Cryptographic Direct-to-Broker Handshake Gateway (Token AC8E6C053)',
      category: 'Secure Client-Broker Handshake',
      summary: 'A secure single-token authentication protocol that transitions a mass-market streaming broadcast audience into authenticated private client sessions on Broker Jeanell Land\'s official mobile real estate portal (https://mls-client.com/AC8E6C053) without third-party intermediary leakage.',
      technicalSpecs: [
        'Single-token zero-friction client pairing using persistent access key "AC8E6C053".',
        'Direct TLS 1.3 socket connecting viewers to Broker Jeanell Land\'s private advisory queue.',
        'Eliminates third-party portal referral commissions, retaining 100% broker-client confidentiality.',
        'Compatible with iOS, Android, and Web PWA client interfaces.'
      ],
      diagram: [
        { step: '1. Viewer Scans QR / Clicks Link', desc: 'Viewer selects MLS banner or QR code on TV screen' },
        { step: '2. Handshake Token Injected', desc: 'Token AC8E6C053 automatically populates into client request' },
        { step: '3. Authenticated Channel', desc: 'Private direct messaging channel opens with Jeanell Land' },
        { step: '4. Real-Time Property Feed', desc: 'Client receives unredacted MLS disclosures and contract drafts' }
      ]
    },
    {
      id: 'claim-5',
      number: 'System Claim 5',
      title: 'Zero-Honeypot Client-Side 3D Facial Mesh Biometric Verification & Government ID Decoupling Engine',
      category: 'Biometrics & Zero-Knowledge Cryptography',
      summary: 'A privacy-preserving biometric authentication system that executes 468-point 3D facial landmark mesh detection and optical character recognition (OCR/MRZ) on physical government identification (State ID, Passport, Driver\'s License) entirely within client device runtime memory, generating verifiable zero-knowledge cryptographic assertions without transmitting raw biometrics to any centralized server honeypot.',
      technicalSpecs: [
        'On-device 3D landmark tensor evaluation (468 keypoints) detecting involuntary micro-blinks and depth parallax.',
        'Zero-honeypot cryptographic isolation: Facial embeddings are hashed to ed25519 verifiable credentials without cloud persistence.',
        'Real ID & ICAO 9303 machine-readable zone optical cross-matching with 99.4% biometric confidence thresholds.',
        'Decoupled identity binding: Authorizes video broadcast and music distribution rights without exposing citizen private data.'
      ],
      diagram: [
        { step: '1. 3D Face Mesh Mapping', desc: 'Client camera maps 468 spatial landmarks and verifies active eye-blink liveness' },
        { step: '2. Government ID Ingestion', desc: 'Optical scanner extracts MRZ barcode and portrait vector from Driver\'s License' },
        { step: '3. Local Embedding Matching', desc: 'Client neural model matches live selfie against ID photo with zero cloud leakage' },
        { step: '4. Sovereign Token Minting', desc: 'Generates ed25519 cryptographic token proof for broadcast rights verification' }
      ]
    },
    {
      id: 'claim-6',
      number: 'System Claim 6',
      title: 'Decentralized Audio Music Distribution Pipeline with Direct Airplay Queue & Automated Performance Split Sheets',
      category: 'DSP Audio Syndication & Telecommunications',
      summary: 'An integrated multi-DSP audio music ingestion and streaming architecture that ingests 24-bit lossless audio master recordings, automatically compiles DDEX ERN 4.3 XML metadata payloads for Spotify, Apple Music, and Amazon Music, and simultaneously queues verified audio assets into a continuous 24/7 telecommunications radio station (T.E.A.R.adio) with zero-deduction creator royalty splits.',
      technicalSpecs: [
        'Automated ISRC (US-TEA-26-XXXXX) and UPC/EAN barcode provisioning with zero middleman royalty extraction.',
        'Direct playout FIFO queueing into live web audio synthesis and 24/7 HLS stream infrastructure.',
        'Universal DDEX ERN 4.3 Electronic Release Notification generation for instant ingestion across global DSPs.',
        'Cryptographic split-sheet smart engine executing automated performance disbursements to songwriters, producers, and vocalists.'
      ],
      diagram: [
        { step: '1. Master Audio Ingest', desc: '24-bit 48kHz WAV audio master uploaded with genre, BPM, and musical key metadata' },
        { step: '2. DDEX ERN 4.3 Compilation', desc: 'System compiles industry standard metadata manifest for Apple Music and Spotify' },
        { step: '3. Instant Radio Playout', desc: 'Single queued directly into 24/7 T.E.A.R.adio on-air broadcast rotation' },
        { step: '4. Split-Sheet Distribution', desc: '100% royalties routed directly to creator client vault with zero platform take' }
      ]
    },
    {
      id: 'claim-7',
      number: 'System Claim 7',
      title: 'Decentralized Inter-App Social Media Syndication & Zero-Honeypot Cross-Platform Media Dispatch Protocol (T.E.A.R.S.afe Bridge)',
      category: 'Inter-App Telecommunications & Social Syndication',
      summary: 'A computer-implemented inter-application communications architecture that binds private decentralized client-side social media networks (T.E.A.R.S.afe) with linear video broadcasts, lossless audio masters, and commercial parcel GIS records, executing concurrent cryptographic cross-dispatch to disparate third-party social media silos (Facebook, Instagram, X/Twitter, WhatsApp) via custom protocol URI schemes without central telemetry tracking or user data-broker exposure.',
      technicalSpecs: [
        'Custom URI scheme routing (tearsafe://post) executing zero-latency inter-application data passing on mobile operating systems.',
        'Client-side cryptographic isolation ensuring that user social graphs and cross-platform sharing analytics are stored exclusively in local hardware secure enclaves.',
        'Dynamic visual Story Card rasterization embedding 9:16 aspect ratio broadcast badges, QR telemetry keys, and verified creator watermarks.',
        'One-tap batch dispatch executing asynchronous Web Share API and platform-specific web intent payloads without central intermediary servers.'
      ],
      diagram: [
        { step: '1. Media Asset Binding', desc: 'Linear broadcast or T.E.A.Radio master bound to cryptographic share payload' },
        { step: '2. Inter-App Handshake', desc: 'Protocol tearsafenet:// passes verifiable token to T.E.A.R.S.afe companion app' },
        { step: '3. Multi-Silo Syndication', desc: 'Payload concurrently formatted for Facebook, Instagram, X & WhatsApp' },
        { step: '4. Zero-Honeypot Vaulting', desc: 'User engagement and dispatch records sealed in local device storage' }
      ]
    }
  ];

  const handleDownloadUsptoPatentPacket = () => {
    const patentPacket = {
      usptoFilingMetadata: {
        applicationType: "Utility Patent Application (Non-Provisional Under 35 U.S.C. § 111(a))",
        titleOfInvention: "SYSTEM AND METHOD FOR ZERO-HONEYPOT ON-DEVICE BIOMETRIC IDENTITY VERIFICATION, CRYPTOGRAPHIC CONTENT RIGHTS CLEARANCE, AND HYBRID AUDIO/VIDEO TELECOMMUNICATIONS STREAMING ROYALTIES",
        inventor: {
          name: "Jeanell Land",
          citizenship: "United States of America",
          residence: "Detroit, Michigan",
          correspondenceAddress: "1001 Woodward Avenue, Suite 1400, Detroit, MI 48226",
          email: "jeanell@tearschannel.online"
        },
        assignee: {
          name: "S.T.E.A.R.Safe Technologies Inc.",
          entityStatus: "Small Business Entity",
          stateOfIncorporation: "Michigan"
        },
        docketNumber: "S.T.E.A.R.-TEARS-MASTER-2026-PAT",
        confirmationDate: new Date().toISOString()
      },
      specificationSection112: {
        fieldOfInvention: "This invention relates generally to telecommunications broadcasting, zero-knowledge client-side biometric authentication, and digital rights monetization, and more specifically to systems and methods that decouple identity verification from central server honeypots while executing automated multi-channel television and radio syndication.",
        backgroundOfTheInvention: "Conventional streaming and distribution services suffer from critical structural deficiencies: (1) Centralized honeypots of creator biometric and identification data that create massive breach vulnerabilities; (2) Opaque digital service provider (DSP) intermediaries that siphon up to 30-80% of creator royalties; (3) Lack of frame-accurate geospatial MLS property telemetry binding in linear broadcasts; and (4) Inability to dynamically duck ambient entertainment audio during high-priority regional transportation safety events without terminating vehicular receiver connections.",
        summaryOfTheInvention: "The present invention resolves these deficiencies through an integrated clean-room architecture comprising: a zero-honeypot client-side 3D facial mesh liveness verification engine, a synchronized multi-stream spatial real estate media engine, an autonomous highway safety audio attenuation protocol, a decentralized audio music distribution pipeline with 1-click live on-air radio airplay queues, and a decentralized inter-application social media syndication protocol (T.E.A.R.S.afe bridge) for zero-honeypot cross-platform dispatch.",
        claims: PATENT_CLAIMS.map(c => ({
          claimNumber: c.number,
          title: c.title,
          category: c.category,
          text: c.summary,
          technicalLimitations: c.technicalSpecs
        }))
      }
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(patentPacket, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'USPTO-Patent-Application-TEARS-STEARSAFE-2026.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const currentClaim = PATENT_CLAIMS.find(c => c.id === activeClaimId) || PATENT_CLAIMS[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Hero Header: Patent Architecture & Non-Infringement Certification */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d1e38] to-[#120f26] border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full">
            <Award className="w-4 h-4 text-amber-400" />
            <span>T.E.A.R.S.™ PROPRIETARY SYSTEM ARCHITECTURE · PATENTS PENDING</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Original, Clean-Room &amp; Patentable Product Design
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            T.E.A.R.S. Channel (Television • Entertainment • Advertisement • RealEstate • Streaming) was architected clean-room from the ground up by founder Jeanell Land and powered by S.T.E.A.R.Safe Technologies Inc. We eliminate third-party dependency through proprietary synchronized media engines, zero-honeypot face biometrics, and autonomous highway safety audio protocols.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Infringement Certified</span>
            </span>
            <span className="text-slate-500">·</span>
            <span>Assignee: S.T.E.A.R.Safe Technologies Inc.</span>
            <span className="text-slate-500">·</span>
            <span>Inventor: Jeanell Land</span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-300">Docket: S.T.E.A.R.-TEARS-MASTER-2026</span>
          </div>

          <div className="pt-3">
            <button
              onClick={handleDownloadUsptoPatentPacket}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Award className="w-4 h-4" />
              <span>Download Official USPTO Patent Filing Package (35 U.S.C. § 112)</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid & Accent */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20" />
      </div>

      {/* Interactive Architecture Flow & Claims Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Claims Selection */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Proprietary Patent Claims</span>
            <span className="text-amber-400 font-bold">6 Core Systems</span>
          </div>

          {PATENT_CLAIMS.map(claim => {
            const isSelected = claim.id === activeClaimId;
            return (
              <button
                key={claim.id}
                onClick={() => setActiveClaimId(claim.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-[#12223d] border-amber-400 shadow-xl ring-1 ring-amber-400/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-400/30">
                    {claim.number}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">
                    {claim.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {claim.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {claim.summary}
                </p>
                <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400/90 pt-1">
                  <span>Inspect claim &amp; data flow</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Claim Deep Dive & Flowchart */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                  {currentClaim.number} · {currentClaim.category}
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(currentClaim, null, 2), currentClaim.id)}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedText === currentClaim.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === currentClaim.id ? 'Copied Claim' : 'Copy Claim Text'}</span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentClaim.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentClaim.summary}
              </p>
            </div>

            {/* Architecture Steps Flowchart */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Binary className="w-4 h-4 text-cyan-400" />
                <span>System Data Flow &amp; Patent Architecture</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentClaim.diagram.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{step.step}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pl-5">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Technical Specifications &amp; Novelty Claims</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentClaim.technicalSpecs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* INTERACTIVE PATENT SIMULATION TESTBENCH */}
      {/* ============================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#070d18] via-slate-900 to-[#12192a] border-2 border-cyan-500/40 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>LIVE INTERACTIVE TESTBENCH · HARDWARE &amp; PROTOCOL SIMULATOR</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Experience the Patentable T.E.A.R.S. Synchronization in Action
            </h3>
            <p className="text-xs text-slate-400">
              Run real-time simulations of the patentable Multi-Stream Real Estate Telemetry Engine and S.T.E.A.R.Safe Highway Safety Audio Ducking Protocol.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-black/60 border border-slate-700 text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>TESTBENCH ONLINE</span>
            </span>
          </div>
        </div>

        {/* Two Simulation Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Module 1: Spatial Real Estate Video Telemetry Sync */}
          <div className="p-5 rounded-2xl bg-black/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-white">1. Video-to-MLS Telemetry Synchronizer</span>
              </div>
              <button
                onClick={() => setSimPlaying(!simPlaying)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  simPlaying
                    ? 'bg-amber-400 text-black hover:bg-amber-300'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                {simPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{simPlaying ? 'Pause Sync' : 'Run Video Sync'}</span>
              </button>
            </div>

            {/* Timecode & Simulated Video Frame */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-cyan-400">Broadcast Timecode: 00:01:{simTimecode.toFixed(1)}s</span>
                <span className="text-amber-400">Sync Drift: ±0.02ms (Sub-Frame)</span>
              </div>

              {/* Simulated Screen with Telemetry HUD Pin */}
              <div className="h-36 rounded-lg bg-gradient-to-br from-slate-900 to-blue-950/60 border border-slate-700/80 relative flex items-center justify-center p-4">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    <span>LIVE TV FEED: CH 102 (Real Estate TV)</span>
                  </div>
                  <div className="text-xs text-slate-300 font-bold truncate max-w-xs">
                    {simActiveParcel.title}
                  </div>
                  <div className="text-[11px] font-mono text-cyan-300">
                    GPS: {simActiveParcel.coordinates}
                  </div>
                </div>

                {/* Floating Spatial HUD Pin */}
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-cyan-500/50 rounded-lg p-2 text-[10px] font-mono text-cyan-200 shadow-lg">
                  <div>PARCEL: {simActiveParcel.id}</div>
                  <div>ZONING: {simActiveParcel.zoning.split(' ')[0]}</div>
                  <div className="text-amber-400 font-bold">MLS TOKEN: {simActiveParcel.token}</div>
                </div>
              </div>

              {/* Handshake Telemetry Packet */}
              <div className="text-[11px] font-mono text-slate-400 bg-black/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center justify-between">
                  <span>✓ Telemetry Bound to MLS App Token</span>
                  <a
                    href="https://mls-client.com/AC8E6C053"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Launch MLS Client</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-slate-500 truncate">
                  POST /api/spatial-handshake?token=AC8E6C053&parcel={simActiveParcel.id}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              When television broadcasts aerial drone or property footage, the patent-pending SMM-RE Engine injects exact parcel coordinates directly into the stream, enabling immediate 1-tap buyer walk scheduling and mobile MLS access.
            </p>
          </div>

          {/* Module 2: S.T.E.A.R.Safe Highway Safety Audio Ducking */}
          <div className="p-5 rounded-2xl bg-black/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-bold text-white">2. S.T.E.A.R.Safe Road Safety Ducking</span>
              </div>
              <button
                onClick={triggerSafetyDucking}
                disabled={duckingActive}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{duckingActive ? 'Dispatch Active...' : 'Simulate Road Alert'}</span>
              </button>
            </div>

            {/* Audio Meter & Ducking HUD */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span>T.E.A.R.adio Live Audio Master</span>
                </span>
                <span className={duckingActive ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {duckingActive ? 'ATTENUATED (-16dB DUCKING)' : 'NORMAL LEVEL (0dB)'}
                </span>
              </div>

              {/* Simulated Frequency Bar Meter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Program Volume Level:</span>
                  <span className="text-white font-bold">{audioLevel}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      duckingActive 
                        ? 'bg-amber-400 w-1/4' 
                        : 'bg-gradient-to-r from-emerald-500 via-amber-400 to-purple-500 w-[88%]'
                    }`}
                  />
                </div>
              </div>

              {/* Safety Dispatch Message Box */}
              <div className={`p-3 rounded-xl border transition-all text-xs ${
                duckingActive
                  ? 'bg-red-950/80 border-red-500/60 text-red-200 animate-pulse'
                  : 'bg-black/60 border-slate-800 text-slate-400'
              }`}>
                {safetyAlertMsg ? (
                  <div className="space-y-1 font-mono">
                    <div className="text-red-400 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      <span>S.T.E.A.R.Safe PRIORITY DISPATCH BROADCASTING</span>
                    </div>
                    <div>{safetyAlertMsg}</div>
                  </div>
                ) : (
                  <div className="text-slate-500 font-mono flex items-center justify-between">
                    <span>Listening for highway telemetry dispatches...</span>
                    <span className="text-emerald-400">Corridor Clear</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Proprietary S.T.E.A.R.Safe DSP protocol detects priority regional road hazards and seamlessly ducks commercial radio audio by -16dB, ensuring life-saving alerts reach vehicular drivers without stream interruptions.
            </p>
          </div>

        </div>

      </div>

      {/* Clean-Room Non-Infringement & Trademark Declarations */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Non-Infringement &amp; Clean-Room IP Statement</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">1. Proprietary Trade Dress</span>
            <p>
              T.E.A.R.S. Channel visual identity, user flows, and typography are original works owned by Jeanell Land and S.T.E.A.R.Safe Technologies Inc. No proprietary assets or styles of external broadcast systems were copied.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">2. Interoperable Device Endpoints</span>
            <p>
              References to Apple iOS, Roku TV, tvOS, and Fire TV are strictly interoperability specifications for multi-device app store publishing (App ID: 6762139785; Sovereign Target Bundle: com.tearschannel.app) under fair nominative use.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">3. Licensed Brokerage Direct Access</span>
            <p>
              Direct-to-broker token "AC8E6C053" connects users directly to licensed Land Broker Jeanell Land at https://mls-client.com/AC8E6C053, eliminating third-party portal listing distortions.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
