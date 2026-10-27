import React, { useState } from 'react';
import { useCreatorVault } from '../hooks/useCreatorVault';
import { CreatorTaxPortal } from './CreatorTaxPortal';
import { 
  Upload, DollarSign, ShieldCheck, Lock, Unlock, CheckCircle2, 
  AlertTriangle, Sparkles, FileText, Film, Eye, Share2, ThumbsUp, 
  ArrowRight, Download, Trash2, RefreshCw, Key, Database, ShieldAlert,
  Play, Radio, Building2, Tv, ExternalLink, HelpCircle, Check, Copy,
  Shield, Award, Calculator, UserCheck, Camera
} from 'lucide-react';

interface CreatorCompensationStudioProps {
  onTuneIn?: (channelId: string) => void;
}

export const CreatorCompensationStudio: React.FC<CreatorCompensationStudioProps> = ({ onTuneIn }) => {
  const { profile, videos, addVideoAsset, requestPayout, purgeLocalVault } = useCreatorVault();

  const [activeTab, setActiveTab] = useState<'upload' | 'monetization' | 'insurance' | 'taxes' | 'vault' | 'catalog'>('upload');
  
  // Upload wizard states
  const [uploadStep, setUploadStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedFileName, setSelectedFileName] = useState<string>('Detroit_Woodward_Commercial_Aerial_4K.mp4');
  const [fileSize, setFileSize] = useState<string>('840 MB');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Real Estate');
  const [channelId, setChannelId] = useState<string>('real-estate-tv');
  const [licenseType, setLicenseType] = useState<'Original Work' | 'Sync Licensed' | 'Commercial Broker Clearance' | 'Work-for-Hire'>('Original Work');
  const [rightsWarrantyAccepted, setRightsWarrantyAccepted] = useState(false);
  const [enableAdShare, setEnableAdShare] = useState(true);
  const [enableTips, setEnableTips] = useState(true);
  const [enableBrokerBounty, setEnableBrokerBounty] = useState(true);
  
  // Scanning simulation state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [provenanceHash, setProvenanceHash] = useState('');

  // Payout states
  const [payoutAmount, setPayoutAmount] = useState<string>('500');
  const [payoutResult, setPayoutResult] = useState<{ message: string; receiptId: string } | null>(null);

  // RPM Calculator slider
  const [calcViews, setCalcViews] = useState<number>(50000);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Cybersecurity Insurance state
  const [selectedInsurancePlan, setSelectedInsurancePlan] = useState<'media-shield' | 'cybersure-vault' | 'broker-eo'>('cybersure-vault');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [insuredChannelName, setInsuredChannelName] = useState('Detroit Sovereign Creator');
  const [insuredEmail, setInsuredEmail] = useState('jeanelldetroit37@gmail.com');
  const [isProcessingInsurance, setIsProcessingInsurance] = useState(false);
  const [activePolicy, setActivePolicy] = useState<{
    policyNumber: string;
    planName: string;
    coverageAmount: string;
    cost: string;
    validUntil: string;
    carrier: string;
  } | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleStartScan = () => {
    if (!rightsWarrantyAccepted) return;
    setIsScanning(true);
    setScanProgress(15);

    const timer1 = setTimeout(() => setScanProgress(45), 400);
    const timer2 = setTimeout(() => setScanProgress(80), 800);
    const timer3 = setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setScanCompleted(true);
      const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setProvenanceHash(randomHash);
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleFinishUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !scanCompleted) return;

    addVideoAsset({
      title: title.trim(),
      description: description.trim() || 'Creator uploaded media cleared for broadcast.',
      category,
      channelId,
      duration: '12:30',
      rightsClearance: {
        verified: true,
        licenseType,
        sha256Proof: provenanceHash,
        rightsDeclarationAccepted: true,
        scannedAt: new Date().toISOString()
      },
      monetization: {
        adRevenueShareEnabled: enableAdShare,
        tipsEnabled: enableTips,
        brokerBountyEnabled: enableBrokerBounty,
        rpm: category === 'Real Estate' ? 28.50 : 18.00
      }
    });

    setTitle('');
    setDescription('');
    setUploadStep(1);
    setScanCompleted(false);
    setScanProgress(0);
    setRightsWarrantyAccepted(false);
    setActiveTab('catalog');
  };

  const handleRequestPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payoutAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const res = requestPayout(amountNum);
    setPayoutResult({ message: res.message, receiptId: res.receiptId });
    setTimeout(() => setPayoutResult(null), 6000);
  };

  const handleExportVaultKeyfile = () => {
    const vaultData = {
      profile,
      videos,
      activePolicy,
      exportedAt: new Date().toISOString(),
      architectureNotice: 'Zero-Honeypot Verified. All data originated on client device. Zero central storage.'
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vaultData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tears-creator-vault-${profile.creatorId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePurchaseInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingInsurance(true);

    setTimeout(() => {
      const planDetails = {
        'media-shield': { name: 'Creator Media & Copyright Defense', limit: '$250,000', cost: billingCycle === 'annual' ? '$199.00 / year' : '$19.99 / mo' },
        'cybersure-vault': { name: 'Enterprise Zero-Honeypot CyberSure™', limit: '$1,000,000', cost: billingCycle === 'annual' ? '$399.00 / year' : '$39.99 / mo' },
        'broker-eo': { name: 'Commercial Land E&O & Aerial Drone Shield', limit: '$2,000,000', cost: billingCycle === 'annual' ? '$799.00 / year' : '$79.99 / mo' }
      }[selectedInsurancePlan];

      const policyNum = `CYBER-2026-TEARS-${Math.floor(Math.random() * 900000 + 100000)}`;
      const expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + (billingCycle === 'annual' ? 1 : 0));
      if (billingCycle === 'monthly') expireDate.setMonth(expireDate.getMonth() + 1);

      setActivePolicy({
        policyNumber: policyNum,
        planName: planDetails.name,
        coverageAmount: planDetails.limit,
        cost: planDetails.cost,
        validUntil: expireDate.toISOString().split('T')[0],
        carrier: 'S.T.E.A.R.Safe Risk Solutions & CyberSure Mutual LLC'
      });
      setIsProcessingInsurance(false);
    }, 1200);
  };

  const handleDownloadCOI = () => {
    if (!activePolicy) return;
    const coiData = {
      documentType: 'CERTIFICATE OF CYBERSECURITY & MEDIA LIABILITY INSURANCE',
      policyNumber: activePolicy.policyNumber,
      insuredName: insuredChannelName,
      insuredEmail: insuredEmail,
      carrier: activePolicy.carrier,
      coverageType: activePolicy.planName,
      liabilityLimit: activePolicy.coverageAmount,
      underwritingStandards: 'Zero-Honeypot Client-Vault Compliant (NIST 800-53 / ISO 27001)',
      validUntil: activePolicy.validUntil,
      zeroPlatformLiabilityNotice: 'T.E.A.R.S. Channel Network holds 0% liability as neutral telecommunications intermediary (47 U.S.C. § 230 & 17 U.S.C. § 512). This policy defends the named insured creator directly.',
      certifiedDate: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(coiData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Certificate-Of-Insurance-${activePolicy.policyNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/30 border border-red-500/30 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>T.E.A.R.S. CREATOR STUDIO OS™ · ZERO-HONEYPOT COMPENSATION &amp; CYBER-INSURANCE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Creator Ingestion &amp; Revenue Studio
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Upload original broadcasts, earn <strong>70% ad revenue share + live viewer tips</strong>, enjoy <strong>zero platform liability</strong> as an independent creator, and protect your digital assets with optional <strong>S.T.E.A.R.Safe CyberSure™ Cybersecurity Insurance</strong>.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Honeypot Client Vault</span>
            </span>
            <span>·</span>
            <span className="text-amber-400 font-bold">Platform Holds Zero Liability</span>
            <span>·</span>
            <span className="text-purple-400">Cybersecurity Insurance Available</span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-16 -mb-16" />
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload &amp; Clear Rights</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30 font-mono">Wizard</span>
        </button>

        <button
          onClick={() => setActiveTab('monetization')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'monetization'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Compensation &amp; Payouts (${profile.pendingPayout.toFixed(2)})</span>
        </button>

        <button
          onClick={() => setActiveTab('insurance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'insurance'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Shield className="w-4 h-4 text-purple-300" />
          <span>Cybersecurity Insurance</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950 text-purple-300 font-mono">For Purchase</span>
        </button>

        <button
          onClick={() => setActiveTab('taxes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'taxes'
              ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>Tax Portal &amp; Filming Costs (1099)</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-300 font-mono">Deductions</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'vault'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Zero-Honeypot Client Vault</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-300 font-mono">Encrypted</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>My Videos ({videos.length})</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: UPLOAD & VERIFY RIGHTS (YouTube-style Flow) */}
      {/* ============================================================== */}
      {activeTab === 'upload' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Wizard Step Indicator */}
          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
            {[
              { num: 1, label: 'Select Video File' },
              { num: 2, label: 'Content Details' },
              { num: 3, label: 'Rights & Zero-Liability' },
              { num: 4, label: 'Monetize & Broadcast' }
            ].map(step => (
              <button
                key={step.num}
                onClick={() => setUploadStep(step.num as any)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  uploadStep === step.num
                    ? 'bg-red-950/60 border-red-500 text-white ring-1 ring-red-500/40'
                    : uploadStep > step.num
                    ? 'bg-slate-900 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">Step 0{step.num}</span>
                  {uploadStep > step.num && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-[11px] truncate">{step.label}</div>
              </button>
            ))}
          </div>

          {/* STEP 1: Video File Dropper */}
          {uploadStep === 1 && (
            <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/80 border-2 border-dashed border-slate-700 text-center space-y-4 hover:border-red-500/60 transition-colors">
              <div className="w-16 h-16 rounded-full bg-red-600/10 text-red-500 mx-auto flex items-center justify-center">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Select Video to Upload</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Drag and drop 4K UHD, 1080p MP4, MOV, or ProRes video files. Your raw footage stays on your device during pre-flight rights clearance.
                </p>
              </div>

              {/* Sample files ready to load */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                {[
                  { name: 'Detroit_Woodward_Commercial_Aerial_4K.mp4', size: '840 MB', type: 'Real Estate' },
                  { name: 'Motown_Soul_Jam_Live_Session.mp4', size: '1.2 GB', type: 'Radio & Music' },
                  { name: 'Michigan_True_Crime_Investigative_Doc.mp4', size: '620 MB', type: 'Entertainment' }
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setSelectedFileName(item.name);
                      setFileSize(item.size);
                      setTitle(item.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
                      setCategory(item.type);
                      setUploadStep(2);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/90 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Film className="w-3.5 h-3.5 text-red-400" />
                    <span>{item.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({item.size})</span>
                  </button>
                ))}
              </div>

              <div className="pt-4 text-[11px] font-mono text-slate-500">
                Max file size: 25 GB · Multi-track audio supported · ATSC A/85 loudness auto-calibrated
              </div>
            </div>
          )}

          {/* STEP 2: Content Details */}
          {uploadStep === 2 && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Content Metadata</h3>
                  <span className="text-xs text-slate-400">File: {selectedFileName} ({fileSize})</span>
                </div>
                <button
                  onClick={() => setUploadStep(1)}
                  className="text-xs text-slate-400 hover:text-white underline font-mono"
                >
                  Change File
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Woodward Corridor Commercial Site Walk (2.85 Acres)"
                    className="w-full px-3.5 py-2.5 bg-black border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description &amp; Highlights
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe zoning highlights, drone survey details, musical credits, or background story..."
                    className="w-full px-3.5 py-2.5 bg-black border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Content Category
                    </label>
                    <select
                      value={category}
                      onChange={e => {
                        setCategory(e.target.value);
                        if (e.target.value === 'Real Estate') setChannelId('real-estate-tv');
                        else if (e.target.value === 'Radio & Music') setChannelId('tear-radio');
                        else setChannelId('tears-prime');
                      }}
                      className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Real Estate">Commercial Real Estate &amp; Land</option>
                      <option value="Radio & Music">Radio, Soul &amp; Motown Music</option>
                      <option value="Entertainment">Entertainment &amp; Documentaries</option>
                      <option value="Investigative Crime">Investigative True Crime</option>
                      <option value="Mobility & Safety">S.T.E.A.R.Safe Public Safety</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Target 24/7 Broadcast Channel
                    </label>
                    <select
                      value={channelId}
                      onChange={e => setChannelId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="tears-prime">Channel 01: T.E.A.R.S. Primetime 24/7</option>
                      <option value="real-estate-tv">Channel 02: T.E.A.R.S. Real Estate &amp; Land TV</option>
                      <option value="tear-radio">Channel 03: T.E.A.R.adio Worldwide</option>
                      <option value="business-spotlight">Channel 04: Business &amp; Automotive Spotlight</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  disabled={!title.trim()}
                  onClick={() => setUploadStep(3)}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition-all shadow flex items-center gap-1.5"
                >
                  <span>Proceed to Rights &amp; Zero-Liability Shield</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Rights Clearance, Anti-Infringement & Zero-Liability Shield */}
          {uploadStep === 3 && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Mandatory Rights &amp; Zero-Liability Verification
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Step 3 of 4</span>
              </div>

              {/* Zero-Liability Intermediary Doctrine Shield */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-black to-slate-950 border border-red-500/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span>PLATFORM ZERO-LIABILITY INTERMEDIARY SHIELD (47 U.S.C. § 230 &amp; 17 U.S.C. § 512)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
                    Zero Network Liability
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  T.E.A.R.S. Channel Network and its parent S.T.E.A.R.Safe Technologies Inc. operate strictly as an interactive computer service and neutral telecommunications conduit. <strong>The network holds ZERO LIABILITY for content, audio tracks, visual trademarks, or real estate assertions uploaded by creators.</strong> 100% legal, civil, and copyright liability rests strictly with the uploading user.
                </p>
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] border-t border-red-500/20 pt-2">
                  <span className="text-slate-400">Want legal defense protection against unintentional copyright or privacy disputes?</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('insurance')}
                    className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 shrink-0"
                  >
                    <span>View S.T.E.A.R.Safe CyberSure™ Insurance</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Sovereign Biometric Identity Verification Option */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-black border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                    <UserCheck className="w-4 h-4" />
                    <span>3D FACE BIOMETRICS &amp; GOVERNMENT ID VERIFICATION (PATENT-PENDING)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Verify creator identity using on-device 468-point face mesh against State ID, Passport, or Driver&apos;s License with zero honeypot risk.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('tab', 'biometrics');
                    window.history.pushState({}, '', url.toString());
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Verify Biometrics</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Select Chain of Title / Proof of Distribution Rights:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'Original Work', label: '100% Original Content', desc: 'Filmed, recorded, and edited exclusively by you.' },
                    { id: 'Commercial Broker Clearance', label: 'Broker Licensed Media', desc: 'Commercial site walk or drone tour cleared with broker.' },
                    { id: 'Sync Licensed', label: 'Master Sync License', desc: 'Written synchronization agreement with copyright owner.' },
                    { id: 'Work-for-Hire', label: 'Work-for-Hire Assignment', desc: 'Commercial contract transferring broadcast rights.' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLicenseType(item.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        licenseType === item.id
                          ? 'bg-amber-950/40 border-amber-400 text-white ring-1 ring-amber-400/40'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs text-amber-300">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Legal Warranty Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-black/60 border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rightsWarrantyAccepted}
                  onChange={e => setRightsWarrantyAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-red-600 accent-red-600 cursor-pointer"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block">Sole Liability Warranty &amp; Mandatory Indemnification:</strong>
                  I warrant that I own 100% of the distribution rights to this media under penalty of perjury. I agree to indemnify, defend, and hold harmless T.E.A.R.S. Channel Network, its officers, and affiliates against any copyright, trademark, or defamation claims arising from this upload.
                </span>
              </label>

              {/* Pre-Flight Scanning Progress */}
              {isScanning && (
                <div className="p-4 rounded-xl bg-black border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning audio fingerprint &amp; visual hashes...</span>
                    </span>
                    <span className="text-white font-bold">{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-red-500 h-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Scanning Completed Certificate */}
              {scanCompleted && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>PRE-FLIGHT RIGHTS CLEARANCE: 100% VERIFIED CLEAN</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    No third-party copyright matches detected. Generated cryptographic Proof-of-Origin token:
                  </p>
                  <div className="p-2 rounded bg-black font-mono text-[10px] text-cyan-300 break-all select-all border border-slate-800 flex items-center justify-between">
                    <span>sha256:{provenanceHash}</span>
                    <button
                      onClick={() => copyToClipboard(provenanceHash, 'hash')}
                      className="text-amber-400 hover:text-white px-2"
                      title="Copy SHA-256"
                    >
                      {copiedId === 'hash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setUploadStep(2)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Back
                </button>

                {!scanCompleted ? (
                  <button
                    type="button"
                    disabled={!rightsWarrantyAccepted || isScanning}
                    onClick={handleStartScan}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Run Pre-Flight Rights Scanner</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setUploadStep(4)}
                    className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs rounded-xl transition-all shadow flex items-center gap-1.5"
                  >
                    <span>Proceed to Monetization</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Monetization & Broadcast Ingest */}
          {uploadStep === 4 && (
            <form onSubmit={handleFinishUpload} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">
                    Creator Compensation &amp; Revenue Settings
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400">Ready to Publish</span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-black/60 border border-slate-800 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">70% Programmatic Ad Revenue Share</span>
                    <span className="text-[11px] text-slate-400">Receive 70% of programmatic broadcast commercial impressions on Roku, mobile, and web.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableAdShare}
                    onChange={e => setEnableAdShare(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-black/60 border border-slate-800 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Live Broadcast Viewer Micro-Tips</span>
                    <span className="text-[11px] text-slate-400">Allow viewers to send SuperHearts and micro-tips during 24/7 stream appearances.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableTips}
                    onChange={e => setEnableTips(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-black/60 border border-slate-800 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Real Estate Referral Bounty (15% Commission)</span>
                    <span className="text-[11px] text-slate-400">If your tour generates a qualified buyer inquiry via Token AC8E6C053 resulting in closing.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableBrokerBounty}
                    onChange={e => setEnableBrokerBounty(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                  />
                </label>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong className="text-white block font-mono">Zero-Honeypot Guarantee:</strong>
                  Your creator revenue balances and banking payout destinations are recorded exclusively in your local on-device vault. No centralized database stores your personal tax or banking credentials.
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setUploadStep(3)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish to Broadcast Lineup</span>
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: CREATOR COMPENSATION & REVENUE HUB */}
      {/* ============================================================== */}
      {activeTab === 'monetization' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Earnings Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
                Pending Payout Balance
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white">
                ${profile.pendingPayout.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400 block font-mono">
                Stored in Local Client-Vault
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                Lifetime Creator Views
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {profile.lifetimeViews.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 block font-mono">
                Across Roku, Mobile &amp; Web
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                Effective Channel RPM
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white">
                $20.26
              </div>
              <span className="text-[11px] text-slate-400 block font-mono">
                70% Direct Creator Share
              </span>
            </div>

          </div>

          {/* Request Payout Form */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Request Compensation Payout</h3>
                <p className="text-xs text-slate-400">Zero platform cuts or hidden transaction fees on creator withdrawals.</p>
              </div>
              <span className="text-xs font-mono text-emerald-400">Available: ${profile.pendingPayout.toFixed(2)}</span>
            </div>

            {payoutResult && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{payoutResult.message}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-300">
                  On-Device Receipt ID: {payoutResult.receiptId}
                </div>
              </div>
            )}

            <form onSubmit={handleRequestPayoutSubmit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">$</span>
                <input
                  type="number"
                  min="10"
                  max={profile.pendingPayout}
                  step="10"
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                disabled={profile.pendingPayout <= 0}
                className="w-full sm:w-auto px-5 py-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" />
                <span>Withdraw to Bank Rails</span>
              </button>
            </form>
          </div>

          {/* Tax Filing & Expense Ingestion Callout Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <Calculator className="w-4 h-4" />
                <span>TAX SEASON PREPARATION · FORM 1099-NEC &amp; SCHEDULE C</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Deduct Filming Costs, Drone Surveys &amp; Production Gear
              </h4>
              <p className="text-xs text-slate-400 max-w-xl">
                T.E.A.R.S. Channel reports gross nonemployee compensation. Offset your tax liability by logging camera rentals, crew wages, soundstage booking, and miles driven.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('taxes')}
              className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs shadow-lg transition-all hover:scale-105 flex items-center gap-1.5 shrink-0"
            >
              <Calculator className="w-4 h-4" />
              <span>Launch Tax &amp; Expense Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive RPM Earnings Simulator */}
          <div className="p-6 rounded-2xl bg-black/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">Interactive Broadcast RPM Calculator</h4>
                <p className="text-xs text-slate-400">Calculate projected creator income at 70% revenue share.</p>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">{calcViews.toLocaleString()} Views</span>
            </div>

            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={calcViews}
              onChange={e => setCalcViews(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Entertainment:</span>
                <span className="text-white font-bold text-sm">${((calcViews / 1000) * 16).toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block">$16.00 RPM</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Detroit Real Estate:</span>
                <span className="text-emerald-400 font-bold text-sm">${((calcViews / 1000) * 28.50).toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block">$28.50 RPM</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Motown / Music:</span>
                <span className="text-cyan-400 font-bold text-sm">${((calcViews / 1000) * 18.00).toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block">$18.00 RPM</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Automotive Sponsor:</span>
                <span className="text-amber-400 font-bold text-sm">${((calcViews / 1000) * 32.00).toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block">$32.00 RPM</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: CYBERSECURITY & MEDIA RISK INSURANCE FOR PURCHASE */}
      {/* ============================================================== */}
      {activeTab === 'insurance' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Insurance Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-[#190d2e] border-2 border-purple-500/40 shadow-xl relative overflow-hidden">
            <div className="max-w-3xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full border border-purple-400/30">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>S.T.E.A.R.SAFE CYBERSURE™ MEDIA &amp; CYBERSECURITY INSURANCE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Creator Legal &amp; Cyber Risk Protection
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Because T.E.A.R.S. Channel holds <strong>zero liability</strong> for user uploads, creators can purchase comprehensive media liability and client-vault cybersecurity insurance. Protect yourself against unexpected copyright challenges, defamation claims, and digital asset theft.
              </p>
            </div>
          </div>

          {/* Active Policy Status (if purchased) */}
          {activePolicy && (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                      Active CyberSure™ Policy In Good Standing
                    </span>
                    <h4 className="text-base font-bold text-white">{activePolicy.planName}</h4>
                  </div>
                </div>

                <button
                  onClick={handleDownloadCOI}
                  className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Certificate of Insurance (COI)</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-black/60 rounded-xl border border-emerald-500/30">
                  <span className="text-slate-400 block text-[10px]">Policy Number:</span>
                  <span className="text-emerald-300 font-bold">{activePolicy.policyNumber}</span>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-emerald-500/30">
                  <span className="text-slate-400 block text-[10px]">Liability Limit:</span>
                  <span className="text-white font-bold">{activePolicy.coverageAmount}</span>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-emerald-500/30">
                  <span className="text-slate-400 block text-[10px]">Premium Paid:</span>
                  <span className="text-amber-400 font-bold">{activePolicy.cost}</span>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-emerald-500/30">
                  <span className="text-slate-400 block text-[10px]">Valid Through:</span>
                  <span className="text-cyan-400 font-bold">{activePolicy.validUntil}</span>
                </div>
              </div>
            </div>
          )}

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Select Insurance Coverage Term</span>
              <span className="text-[11px] text-slate-400">Save 20% on all policy tiers with annual upfront billing.</span>
            </div>
            <div className="flex items-center gap-1 p-1 bg-black rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  billingCycle === 'monthly' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  billingCycle === 'annual' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          {/* 3 Insurance Plans Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Plan 1: Creator Media Defense */}
            <div
              onClick={() => setSelectedInsurancePlan('media-shield')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                selectedInsurancePlan === 'media-shield'
                  ? 'bg-slate-900 border-purple-400 ring-2 ring-purple-500/40 shadow-xl'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                    Tier 01: Media Shield
                  </span>
                  {selectedInsurancePlan === 'media-shield' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>

                <h4 className="text-lg font-bold text-white">Creator Copyright Defense</h4>
                <div className="text-2xl font-black text-white">
                  {billingCycle === 'annual' ? '$199' : '$19.99'}
                  <span className="text-xs text-slate-400 font-normal"> / {billingCycle === 'annual' ? 'year' : 'month'}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Ideal for independent videographers, musicians, and filmmakers broadcasting on T.E.A.R.S. Channel.
                </p>

                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span><strong>$250,000</strong> Legal Defense Limit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copyright &amp; Fair Use Dispute Coverage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>DMCA Counter-Notice Legal Assistance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Defamation &amp; Privacy Claim Defense</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <span className={`block text-center py-2 rounded-xl text-xs font-bold ${
                  selectedInsurancePlan === 'media-shield' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {selectedInsurancePlan === 'media-shield' ? 'Selected Plan' : 'Select Tier 1'}
                </span>
              </div>
            </div>

            {/* Plan 2: Enterprise Zero-Honeypot CyberSure */}
            <div
              onClick={() => setSelectedInsurancePlan('cybersure-vault')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 relative ${
                selectedInsurancePlan === 'cybersure-vault'
                  ? 'bg-slate-900 border-purple-400 ring-2 ring-purple-500/40 shadow-xl'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-amber-400 text-black font-extrabold text-[10px] uppercase shadow">
                Most Popular
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                    Tier 02: Full CyberSure™
                  </span>
                  {selectedInsurancePlan === 'cybersure-vault' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>

                <h4 className="text-lg font-bold text-white">Zero-Honeypot Cyber Shield</h4>
                <div className="text-2xl font-black text-white">
                  {billingCycle === 'annual' ? '$399' : '$39.99'}
                  <span className="text-xs text-slate-400 font-normal"> / {billingCycle === 'annual' ? 'year' : 'month'}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Total ransomware, client vault corruption, phishing, and media liability protection for active networks.
                </p>

                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span><strong>$1,000,000</strong> Total Policy Limit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Client-Vault Recovery &amp; Key Restoration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>24/7 Digital Forensics Incident Response</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>All Tier 01 Media Rights Coverages Included</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <span className={`block text-center py-2 rounded-xl text-xs font-bold ${
                  selectedInsurancePlan === 'cybersure-vault' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {selectedInsurancePlan === 'cybersure-vault' ? 'Selected Plan' : 'Select Tier 2'}
                </span>
              </div>
            </div>

            {/* Plan 3: Commercial Broker E&O + Drone */}
            <div
              onClick={() => setSelectedInsurancePlan('broker-eo')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                selectedInsurancePlan === 'broker-eo'
                  ? 'bg-slate-900 border-purple-400 ring-2 ring-purple-500/40 shadow-xl'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                    Tier 03: Broker &amp; Drone E&amp;O
                  </span>
                  {selectedInsurancePlan === 'broker-eo' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>

                <h4 className="text-lg font-bold text-white">Commercial Land &amp; Drone Shield</h4>
                <div className="text-2xl font-black text-white">
                  {billingCycle === 'annual' ? '$799' : '$79.99'}
                  <span className="text-xs text-slate-400 font-normal"> / {billingCycle === 'annual' ? 'year' : 'month'}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Engineered specifically for commercial real estate broadcasters, aerial drone pilots, and investment hosts.
                </p>

                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span><strong>$2,000,000</strong> Errors &amp; Omissions (E&amp;O)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>FAA Part 107 Drone Airspace &amp; Flyover Defense</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Escrow Wire Fraud &amp; Title Discrepancy Cover</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Token AC8E6C053 Direct Brokerage Warranty</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <span className={`block text-center py-2 rounded-xl text-xs font-bold ${
                  selectedInsurancePlan === 'broker-eo' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {selectedInsurancePlan === 'broker-eo' ? 'Selected Plan' : 'Select Tier 3'}
                </span>
              </div>
            </div>

          </div>

          {/* Policy Activation Form */}
          <form onSubmit={handlePurchaseInsurance} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-base font-bold text-white">Activate Policy &amp; Issue Certificate of Insurance</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Insured Creator / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={insuredChannelName}
                  onChange={e => setInsuredChannelName(e.target.value)}
                  placeholder="e.g. Jeanell Land Media / Detroit Sovereign Creator"
                  className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Policyholder Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={insuredEmail}
                  onChange={e => setInsuredEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Underwritten by S.T.E.A.R.Safe Risk Solutions &amp; CyberSure Mutual. Policy activates immediately.
              </span>

              <button
                type="submit"
                disabled={isProcessingInsurance}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 hover:scale-105 disabled:opacity-50"
              >
                <Shield className="w-4 h-4" />
                <span>{isProcessingInsurance ? 'Underwriting Policy...' : 'Activate CyberSure™ Coverage'}</span>
              </button>
            </div>
          </form>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: CREATOR TAX PORTAL & EXPENSE INGESTION */}
      {/* ============================================================== */}
      {activeTab === 'taxes' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <CreatorTaxPortal />
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: ZERO-HONEYPOT CLIENT VAULT INSPECTOR */}
      {/* ============================================================== */}
      {activeTab === 'vault' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Honeypot vs Client-Vault Comparison Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0c1a29] border border-emerald-500/40 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>BREACH-PROOF ARCHITECTURE SPECIFICATION</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Why T.E.A.R.S. Channel Has No Honeypot Data to Breach
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Traditional platforms build centralized honeypots storing credit cards, creator social security numbers, banking details, and private watch records on centralized cloud databases. When breached, millions of users are compromised.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Centralized Honeypot (Other Platforms)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Stores creator banking, tax records, and viewer history on public multi-tenant servers. One breach leaks all creator identities.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>T.E.A.R.S. Zero-Honeypot Client Vault</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Sensitive creator records, banking tokens, and cryptographic keys remain strictly on the user&apos;s local device vault. The server holds zero honeypots.
                </p>
              </div>
            </div>
          </div>

          {/* Vault Parameters Inspector */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-white">Active On-Device Vault Dossier</h4>
                <span className="text-xs text-slate-400 font-mono">Location: Browser Local Encrypted Storage (localStorage + Web Crypto)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportVaultKeyfile}
                  className="px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Vault Keyfile</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to purge your local vault? This will erase local creator keys and mock balances.')) {
                      purgeLocalVault();
                    }
                  }}
                  className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Vault</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-black rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Creator ID:</span>
                <span className="text-white font-bold">{profile.creatorId}</span>
              </div>
              <div className="p-3 bg-black rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Public Key Fingerprint:</span>
                <span className="text-cyan-400 truncate block">{profile.publicKeyFingerprint}</span>
              </div>
              <div className="p-3 bg-black rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Storage Isolation:</span>
                <span className="text-emerald-400 font-bold">{profile.storageMode}</span>
              </div>
              <div className="p-3 bg-black rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Encrypted Timestamp:</span>
                <span className="text-amber-400">{profile.vaultEncryptionDate}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: MY PUBLISHED VIDEOS (Catalog) */}
      {/* ============================================================== */}
      {activeTab === 'catalog' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">My Cleared Broadcast Videos</h3>
              <p className="text-xs text-slate-400">All videos verified against copyright infringement and active in the broadcast queue.</p>
            </div>
            <button
              onClick={() => setActiveTab('upload')}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New</span>
            </button>
          </div>

          <div className="space-y-3">
            {videos.map(vid => (
              <div
                key={vid.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-black border border-slate-800 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                    <Film className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white truncate max-w-md">{vid.title}</h4>
                      <span className="px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Rights Verified</span>
                      </span>
                      <span className="px-2 py-0.2 rounded bg-black text-amber-300 text-[10px] font-mono border border-slate-700">
                        {vid.rightsClearance.licenseType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{vid.description}</p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 pt-0.5">
                      <span>{vid.duration}</span>
                      <span>·</span>
                      <span className="text-slate-300">{vid.views.toLocaleString()} views</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-bold">${vid.earnedAmount.toFixed(2)} earned</span>
                      <span>·</span>
                      <span className="truncate max-w-[120px] text-cyan-400" title={vid.rightsClearance.sha256Proof}>
                        sha256:{vid.rightsClearance.sha256Proof.slice(0, 10)}...
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {onTuneIn && (
                    <button
                      onClick={() => onTuneIn(vid.channelId)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      title="Tune in to channel"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch</span>
                    </button>
                  )}
                  <button
                    onClick={() => copyToClipboard(vid.rightsClearance.sha256Proof, vid.id)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Copy SHA-256 Provenance Hash"
                  >
                    {copiedId === vid.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
