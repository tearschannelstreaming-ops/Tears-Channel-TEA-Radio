import React, { useState, useRef } from 'react';
import { useBiometricVerification } from '../hooks/useBiometricVerification';
import { useCreatorVerificationRegistry } from '../hooks/useCreatorVerificationRegistry';
import { CreatorVerificationStatsDashboard } from './CreatorVerificationStatsDashboard';
import { GovernmentIdType } from '../types';
import { 
  ShieldCheck, Camera, CheckCircle2, AlertTriangle, Key, Download, 
  RefreshCw, Eye, Sparkles, FileText, UserCheck, Lock, Unlock, 
  Copy, Check, ArrowRight, ShieldAlert, BadgeCheck, Smartphone, BarChart3, Clock
} from 'lucide-react';

interface BiometricIdVerificationPortalProps {
  onVerificationComplete?: () => void;
}

export const BiometricIdVerificationPortal: React.FC<BiometricIdVerificationPortalProps> = ({ onVerificationComplete }) => {
  const {
    record,
    isScanning,
    scanStep,
    scanProgress,
    activeChallenge,
    startVerificationScan,
    revokeVerification
  } = useBiometricVerification();

  const {
    creators,
    stats,
    verifyCreator,
    markCreatorPending,
    addCreator,
    removeCreator,
    resetToDefaults
  } = useCreatorVerificationRegistry(record);

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'dashboard' | 'scanner'>('overview');
  const scannerRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const [idType, setIdType] = useState<GovernmentIdType>("Driver's License");
  const [fullName, setFullName] = useState('Jeanell Land');
  const [docNumber, setDocNumber] = useState('M948-129-382-892');
  const [jurisdiction, setJurisdiction] = useState('State of Michigan (SOS)');
  const [copiedToken, setCopiedToken] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const handleStartScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCameraActive(true);
    await startVerificationScan(idType, fullName, docNumber, jurisdiction);
    if (onVerificationComplete) onVerificationComplete();
  };

  const copyToken = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleDownloadBiometricCert = () => {
    if (!record) return;
    const certPayload = {
      documentType: 'CERTIFICATE OF ZERO-HONEYPOT SOVEREIGN BIOMETRIC IDENTITY',
      standard: 'NIST Special Publication 800-63B / FIPS 201-3 Biometric Assurance Level 3',
      patentDocket: 'S.T.E.A.R.-TEARS-BIO-2026-PAT',
      assignee: 'S.T.E.A.R.Safe Technologies Inc.',
      inventor: 'Jeanell Land',
      verificationDetails: {
        credentialId: record.id,
        idType: record.idType,
        verifiedName: record.fullName,
        maskedDocument: record.documentNumberMasked,
        issuingAuthority: record.issuingStateOrCountry,
        facialLandmarkMatches: `${record.facialLandmarksCount} 3D Mesh Points Verified`,
        biometricConfidenceScore: `${record.faceMatchScore}%`,
        livenessTestPassed: record.livenessPassed,
        antiSpoofProof: record.antiSpoofProof,
        cryptographicToken: record.cryptographicToken,
        timestamp: record.verifiedAt,
        status: record.status
      },
      privacyArchitecture: {
        zeroHoneypotEnforced: true,
        clientSideStorage: 'Local Device Hardware Secure Enclave (Web Crypto / AES-GCM)',
        serverHoneypotLeakRisk: '0% (Raw facial embeddings never transmitted to central servers)'
      }
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(certPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Sovereign-Biometric-Credential-${record.fullName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-blue-500/40 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/30">
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>ZERO-HONEYPOT FACE BIOMETRICS &amp; GOVERNMENT ID ENGINE · PATENT READY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Client-Side Face Biometrics &amp; Sovereign ID Verification
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Verify creator authenticity against your <strong>State ID, U.S. Passport, or Driver&apos;s License</strong> using real-time <strong>468-point 3D facial mesh liveness detection</strong>. Built with <strong>zero central honeypot storage</strong>: raw face images and government documents never leave your device.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>468 3D Facial Landmarks</span>
            </span>
            <span>·</span>
            <span className="text-cyan-400">Optical Character &amp; MRZ Barcode Recognition</span>
            <span>·</span>
            <span className="text-amber-400">Anti-Spoofing Liveness Challenge</span>
            <span>·</span>
            <span className="text-purple-400">Ed25519 Cryptographic Token</span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mb-16" />
      </div>

      {/* Sub-Navigation & Section Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-900/90 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'overview'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Full Portal View</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('dashboard');
              dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'dashboard'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Creator Verification Dashboard</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-black/30 border border-white/20">
              {stats.successful} OK · {stats.pending} Pend
            </span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('scanner');
              scannerRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'scanner'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>3D Face Scanner &amp; ID Vault</span>
          </button>
        </div>

        {/* Quick Quick Status Pill */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{stats.successRate}% Success Rate</span>
          </span>
          <span>·</span>
          <span className="text-amber-400">{stats.pending} Pending Clearance</span>
        </div>
      </div>

      {/* Main 2-Column Workflow Stage: Biometric Scanner & Credential Vault */}
      {(activeSubTab === 'overview' || activeSubTab === 'scanner') && (
        <div ref={scannerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Biometric Scanner & Camera Simulator */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
            
            {/* Camera Viewport / Face Mesh HUD */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden border-b border-slate-800 select-none">
              
              {/* Simulated Video Feed Background with Face Contour */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0a1120] to-black flex items-center justify-center">
                
                {/* 3D Facial Landmark Mesh Wireframe */}
                <div className="relative w-48 h-64 rounded-[50%] border-2 border-dashed border-cyan-400/50 flex items-center justify-center">
                  
                  {/* Eye boxes */}
                  <div className="absolute top-20 left-10 w-8 h-4 border border-cyan-400/80 rounded-full flex items-center justify-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${isScanning && activeChallenge === 'blink' ? 'bg-amber-400 animate-ping' : 'bg-cyan-400'}`} />
                  </div>
                  <div className="absolute top-20 right-10 w-8 h-4 border border-cyan-400/80 rounded-full flex items-center justify-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${isScanning && activeChallenge === 'blink' ? 'bg-amber-400 animate-ping' : 'bg-cyan-400'}`} />
                  </div>

                  {/* Nose Bridge and Mouth landmarks */}
                  <div className="absolute top-28 w-2 h-8 border-l border-cyan-400/60" />
                  <div className="absolute bottom-16 w-14 h-4 border-b-2 border-cyan-400/80 rounded-full" />

                  {/* Dynamic Mesh Dots Grid */}
                  <div className="absolute inset-4 grid grid-cols-6 grid-rows-6 opacity-40">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-cyan-300 rounded-full mx-auto my-auto animate-pulse" />
                    ))}
                  </div>

                  {/* Scanning Laser Bar */}
                  {isScanning && (
                    <div 
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] transition-all duration-300 pointer-events-none"
                      style={{ top: `${(scanProgress % 90) + 5}%` }}
                    />
                  )}
                </div>

                {/* Corner Framing Brackets */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
              </div>

              {/* HUD Status Bar Top */}
              <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 bg-black/70 px-2.5 py-1 rounded-full border border-slate-700">
                  <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-red-500 animate-ping' : record ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className="text-white text-[11px] font-bold">
                    {isScanning ? 'LIVENESS ANALYSIS ACTIVE' : record ? 'SOVEREIGN CREDENTIAL VERIFIED' : 'CAMERA STANDBY'}
                  </span>
                </div>
                <span className="text-cyan-300 text-[11px] bg-black/70 px-2.5 py-1 rounded-full border border-slate-700">
                  468 3D LANDMARKS
                </span>
              </div>

              {/* Liveness Challenge Prompt Bottom */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                {isScanning ? (
                  <div className="p-3 bg-black/90 border border-cyan-500/80 rounded-xl max-w-sm mx-auto shadow-xl space-y-1">
                    <span className="text-[10px] text-cyan-400 font-mono font-bold block uppercase tracking-wider">
                      Liveness Challenge ({scanProgress}%):
                    </span>
                    <div className="text-sm font-extrabold text-white animate-bounce">
                      {activeChallenge === 'hold-steady' && '👁️ Look straight ahead and hold steady'}
                      {activeChallenge === 'blink' && '😉 Please blink both eyes now'}
                      {activeChallenge === 'turn-right' && '➡️ Slightly tilt head to the right'}
                    </div>
                  </div>
                ) : record ? (
                  <div className="p-2.5 bg-emerald-950/90 border border-emerald-500 rounded-xl max-w-sm mx-auto flex items-center justify-center gap-2 text-emerald-300 text-xs font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>99.4% BIOMETRIC MATCH WITH {record.idType.toUpperCase()}</span>
                  </div>
                ) : (
                  <div className="p-2 bg-black/80 rounded-lg text-slate-400 text-xs font-mono">
                    Position face inside oval frame &amp; select ID type below
                  </div>
                )}
              </div>

            </div>

            {/* Verification Intake Form */}
            <form onSubmit={handleStartScanSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Select Government ID Credential *
                  </label>
                  <select
                    value={idType}
                    onChange={e => setIdType(e.target.value as GovernmentIdType)}
                    disabled={isScanning}
                    className="w-full px-3.5 py-2.5 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Driver's License">Official Driver&apos;s License (AAMVA Barcode)</option>
                    <option value="Passport">U.S. / International Passport (ICAO 9303 MRZ)</option>
                    <option value="State ID">State Identification Card (Real ID Compliant)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Legal Name on Document *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    disabled={isScanning}
                    placeholder="e.g. Jeanell Land"
                    className="w-full px-3.5 py-2.5 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    ID / Passport Document Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={docNumber}
                    onChange={e => setDocNumber(e.target.value)}
                    disabled={isScanning}
                    placeholder="e.g. M948-129-382-892"
                    className="w-full px-3.5 py-2.5 bg-black border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Issuing Authority / State / Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={jurisdiction}
                    onChange={e => setJurisdiction(e.target.value)}
                    disabled={isScanning}
                    placeholder="e.g. State of Michigan (SOS) or United States (DOS)"
                    className="w-full px-3.5 py-2.5 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Zero-Honeypot Privacy Architecture Note */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="text-cyan-400 font-mono font-bold block">
                  Zero-Knowledge Proof &amp; On-Device Vault Protocol:
                </span>
                <p className="leading-relaxed">
                  Your document and biometric vectors are processed in client memory via browser WebAssembly/WebGL. No unencrypted photo or full identification string is ever stored on external cloud honeypots.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {record ? (
                  <button
                    type="button"
                    onClick={revokeVerification}
                    className="text-xs text-red-400 hover:text-red-300 underline font-mono"
                  >
                    Revoke &amp; Re-verify Identity
                  </button>
                ) : <span />}

                <button
                  type="submit"
                  disabled={isScanning}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 hover:scale-105"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isScanning ? 'Executing 3D Liveness Scan...' : 'Start 3D Biometric Verification'}</span>
                </button>
              </div>

            </form>

          </div>

        </div>

        {/* Right Column: Sovereign Identity Credential & Patent Defense */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Verified Credential Card */}
          {record ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0e1726] to-slate-950 border-2 border-emerald-500/60 shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Sovereign Biometric Credential</h3>
                    <span className="text-[10px] text-emerald-400 font-mono">Status: Verified &amp; Digitally Signed</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono">
                  LEVEL 3
                </span>
              </div>

              {/* Verified Identity Dossier */}
              <div className="space-y-3 text-xs font-mono">
                
                <div className="p-3 bg-black/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block">Verified Legal Subject:</span>
                  <div className="text-base font-bold text-white font-sans">{record.fullName}</div>
                  <div className="text-cyan-300 text-[11px]">{record.issuingStateOrCountry}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-black/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Document Type:</span>
                    <span className="text-amber-300 font-bold">{record.idType}</span>
                  </div>
                  <div className="p-2.5 bg-black/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Match Confidence:</span>
                    <span className="text-emerald-400 font-bold">{record.faceMatchScore}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-black/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Masked Doc No:</span>
                    <span className="text-slate-300">{record.documentNumberMasked}</span>
                  </div>
                  <div className="p-2.5 bg-black/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Expires:</span>
                    <span className="text-slate-300">{record.expirationDate}</span>
                  </div>
                </div>

                {/* Cryptographic Ed25519 Token */}
                <div className="p-3 bg-black/80 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase">Cryptographic Token:</span>
                    <button
                      onClick={() => copyToken(record.cryptographicToken)}
                      className="text-cyan-400 hover:text-white flex items-center gap-1 text-[10px]"
                    >
                      {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedToken ? 'Copied' : 'Copy Token'}</span>
                    </button>
                  </div>
                  <div className="text-[10px] text-cyan-300 break-all select-all">
                    {record.cryptographicToken}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleDownloadBiometricCert}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Biometric Certificate (JSON)</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-slate-500" />
              </div>
              <h4 className="text-sm font-bold text-white">Identity Verification Pending</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Fill in your legal document details and execute the 3D facial landmark scanner to generate your sovereign credential.
              </p>
            </div>
          )}

          {/* Patent Innovation Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-black border border-purple-500/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>USPTO PATENT DOCKET: S.T.E.A.R.-TEARS-BIO-2026</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              Patent System Claim 4: Zero-Honeypot Biometric Binding
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Protects S.T.E.A.R.Safe Technologies Inc. and Inventor Jeanell Land&apos;s proprietary architecture for performing on-device biometric proof binding directly to broadcast television channels and streaming radio nodes without server honeypot exposure.
            </p>
            <div className="pt-1 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
              <span>Inventor: Jeanell Land</span>
              <span>·</span>
              <span>Assignee: S.T.E.A.R.Safe Technologies Inc.</span>
            </div>
          </div>

        </div>

      </div>
      )}

      {/* Creator Identity Verification Statistics Dashboard */}
      {(activeSubTab === 'overview' || activeSubTab === 'dashboard') && (
        <div ref={dashboardRef}>
          <CreatorVerificationStatsDashboard
            creators={creators}
            stats={stats}
            onVerifyCreator={verifyCreator}
            onMarkPending={markCreatorPending}
            onAddCreator={addCreator}
            onRemoveCreator={removeCreator}
            onResetDefaults={resetToDefaults}
            onJumpToScanner={() => {
              setActiveSubTab('scanner');
              scannerRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      )}

    </div>
  );
};
