import React, { useState, useMemo } from 'react';
import { 
  CreatorVerificationItem, 
  VerificationStats, 
  GovernmentIdType, 
  CreatorCategory 
} from '../types';
import { 
  CheckCircle2, Clock, AlertTriangle, ShieldCheck, UserCheck, 
  Search, Plus, Download, RefreshCw, Eye, Sparkles, X, 
  FileText, Copy, Check, ChevronRight, Fingerprint, 
  Shield, Camera, Users, ArrowUpRight, BarChart3, Lock,
  PieChart as PieIcon, TrendingUp, Layers, Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

interface CreatorVerificationStatsDashboardProps {
  creators: CreatorVerificationItem[];
  stats: VerificationStats;
  onVerifyCreator: (id: string) => void;
  onMarkPending: (id: string, reason?: CreatorVerificationItem['pendingReason']) => void;
  onAddCreator: (creator: Omit<CreatorVerificationItem, 'id' | 'submittedAt'>) => void;
  onRemoveCreator: (id: string) => void;
  onResetDefaults: () => void;
  onJumpToScanner?: () => void;
}

export const CreatorVerificationStatsDashboard: React.FC<CreatorVerificationStatsDashboardProps> = ({
  creators,
  stats,
  onVerifyCreator,
  onMarkPending,
  onAddCreator,
  onRemoveCreator,
  onResetDefaults,
  onJumpToScanner
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'successful' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [idTypeFilter, setIdTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChartTab, setActiveChartTab] = useState<'all' | 'pie' | 'docType' | 'category' | 'trend'>('all');

  // Recharts Dataset 1: Donut / Pie for Successful vs Pending
  const statusPieData = useMemo(() => [
    { name: 'Successful Verifications', value: stats.successful, color: '#10b981', pct: stats.successRate },
    { name: 'Pending Identity Queue', value: stats.pending, color: '#f59e0b', pct: stats.pendingRate }
  ], [stats.successful, stats.pending, stats.successRate, stats.pendingRate]);

  // Recharts Dataset 2: Government ID Type Comparison (Grouped Bars)
  const docTypeBarData = useMemo(() => {
    const types: GovernmentIdType[] = ["Driver's License", "Passport", "State ID"];
    return types.map((t) => {
      const item = stats.byDocType[t] || { successful: 0, pending: 0, total: 0 };
      const rate = item.total > 0 ? Math.round((item.successful / item.total) * 100) : 0;
      return {
        name: t === "Driver's License" ? "Driver's Lic." : t,
        fullType: t,
        Successful: item.successful,
        Pending: item.pending,
        Total: item.total,
        rate
      };
    });
  }, [stats.byDocType]);

  // Recharts Dataset 3: Creator Categories (Stacked Bars)
  const categoryChartData = useMemo(() => {
    const cats: CreatorCategory[] = [
      'Musician & Producer',
      'Broadcast & TV Host',
      'Independent Filmmaker',
      'Podcaster & Journalist',
      'Real Estate Syndicator'
    ];
    return cats.map((cat) => {
      const item = stats.byCategory[cat] || { successful: 0, pending: 0, total: 0 };
      const label = cat === 'Musician & Producer' ? 'Music'
        : cat === 'Broadcast & TV Host' ? 'Broadcast'
        : cat === 'Independent Filmmaker' ? 'Filmmakers'
        : cat === 'Podcaster & Journalist' ? 'Podcasts'
        : 'Real Estate';
      return {
        name: label,
        fullName: cat,
        Successful: item.successful,
        Pending: item.pending,
        Total: item.total
      };
    });
  }, [stats.byCategory]);

  // Recharts Dataset 4: Verification Pipeline Telemetry & Confidence Trend (Area Chart)
  const trendData = useMemo(() => [
    { cohort: 'Batch A', Successful: Math.max(1, Math.round(stats.successful * 0.3)), Pending: Math.max(1, Math.round(stats.pending * 0.4)), confidence: 99.1 },
    { cohort: 'Batch B', Successful: Math.max(2, Math.round(stats.successful * 0.55)), Pending: Math.max(1, Math.round(stats.pending * 0.65)), confidence: 99.4 },
    { cohort: 'Batch C', Successful: Math.max(3, Math.round(stats.successful * 0.75)), Pending: Math.max(2, Math.round(stats.pending * 0.85)), confidence: 99.2 },
    { cohort: 'Batch D', Successful: Math.max(4, Math.round(stats.successful * 0.9)), Pending: Math.max(2, Math.round(stats.pending * 0.95)), confidence: 99.6 },
    { cohort: 'Live Intake', Successful: stats.successful, Pending: stats.pending, confidence: stats.avgMatchScore }
  ], [stats.successful, stats.pending, stats.avgMatchScore]);

  // Modals state
  const [selectedCreatorForProof, setSelectedCreatorForProof] = useState<CreatorVerificationItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // New creator form state
  const [newCreatorName, setNewCreatorName] = useState('');
  const [newCreatorHandle, setNewCreatorHandle] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [newCategory, setNewCategory] = useState<CreatorCategory>('Musician & Producer');
  const [newIdType, setNewIdType] = useState<GovernmentIdType>("Driver's License");
  const [newJurisdiction, setNewJurisdiction] = useState('State of Michigan (SOS)');
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newInitialStatus, setNewInitialStatus] = useState<'pending' | 'successful'>('pending');

  // Filtered creators list
  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && c.creatorCategory !== categoryFilter) return false;
      if (idTypeFilter !== 'all' && c.idType !== idTypeFilter) return false;
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = c.creatorName.toLowerCase().includes(query);
        const matchesHandle = c.creatorHandle.toLowerCase().includes(query);
        const matchesChannel = c.channelOrBandName.toLowerCase().includes(query);
        const matchesJurisdiction = c.jurisdiction.toLowerCase().includes(query);
        const matchesDoc = c.documentNumberMasked.toLowerCase().includes(query);
        return matchesName || matchesHandle || matchesChannel || matchesJurisdiction || matchesDoc;
      }
      return true;
    });
  }, [creators, statusFilter, categoryFilter, idTypeFilter, searchQuery]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreatorName.trim()) return;

    const maskedDoc = newDocNumber.length > 4 
      ? `${newDocNumber.slice(0, 2)}***-***-${newDocNumber.slice(-3)}`
      : 'D***-***-841';

    const colors = [
      'from-cyan-500 to-blue-600',
      'from-purple-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-orange-500 to-amber-600',
      'from-rose-500 to-pink-600'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    if (newInitialStatus === 'successful') {
      const randomToken = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const randomAntiSpoof = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      onAddCreator({
        creatorName: newCreatorName.trim(),
        creatorHandle: newCreatorHandle.trim().startsWith('@') ? newCreatorHandle.trim() : `@${newCreatorHandle.trim() || 'creator'}`,
        channelOrBandName: newChannelName.trim() || 'T.E.A.R.S. Ecosystem Creator',
        avatarColor: randomColor,
        creatorCategory: newCategory,
        idType: newIdType,
        jurisdiction: newJurisdiction.trim() || 'State ID Authority',
        documentNumberMasked: maskedDoc,
        status: 'successful',
        verifiedAt: new Date().toISOString(),
        faceMatchScore: 99.4,
        facialLandmarksCount: 468,
        antiSpoofProof: `sha256:${randomAntiSpoof}`,
        cryptographicToken: `ed25519:verif:${randomToken}`,
        zeroHoneypotCompliant: true,
        notes: 'Verified via client-side face mesh & document OCR.'
      });
    } else {
      onAddCreator({
        creatorName: newCreatorName.trim(),
        creatorHandle: newCreatorHandle.trim().startsWith('@') ? newCreatorHandle.trim() : `@${newCreatorHandle.trim() || 'creator'}`,
        channelOrBandName: newChannelName.trim() || 'T.E.A.R.S. Ecosystem Creator',
        avatarColor: randomColor,
        creatorCategory: newCategory,
        idType: newIdType,
        jurisdiction: newJurisdiction.trim() || 'State ID Authority',
        documentNumberMasked: maskedDoc,
        status: 'pending',
        pendingReason: 'Awaiting 3D Face Mesh Scan',
        zeroHoneypotCompliant: true,
        notes: 'Identity verification request registered; camera scan pending.'
      });
    }

    // Reset and close
    setNewCreatorName('');
    setNewCreatorHandle('');
    setNewChannelName('');
    setNewDocNumber('');
    setShowAddModal(false);
  };

  const handleExportAuditManifest = () => {
    const report = {
      exportTitle: 'T.E.A.R.S. Network Creator Biometric Identity Audit Manifest',
      generatedAt: new Date().toISOString(),
      standardsCompliance: 'NIST SP 800-63B / Zero-Honeypot Cryptographic Enclave',
      patentDocket: 'S.T.E.A.R.-TEARS-BIO-2026-PAT',
      summaryStatistics: {
        totalCreatorRequests: stats.total,
        successfulVerifications: stats.successful,
        pendingVerifications: stats.pending,
        successRatePercentage: `${stats.successRate}%`,
        pendingRatePercentage: `${stats.pendingRate}%`,
        averageFaceMatchScore: `${stats.avgMatchScore}%`,
        honeypotLeakRisk: '0.0% (Zero central raw facial data stored)'
      },
      documentBreakdown: stats.byDocType,
      categoryBreakdown: stats.byCategory,
      creatorRoster: creators.map((c) => ({
        id: c.id,
        name: c.creatorName,
        handle: c.creatorHandle,
        category: c.creatorCategory,
        idType: c.idType,
        jurisdiction: c.jurisdiction,
        maskedDoc: c.documentNumberMasked,
        status: c.status,
        submittedAt: c.submittedAt,
        verifiedAt: c.verifiedAt || null,
        faceMatchScore: c.faceMatchScore ? `${c.faceMatchScore}%` : null,
        facialLandmarks: c.facialLandmarksCount || null,
        cryptographicProof: c.cryptographicToken || null,
        antiSpoofHash: c.antiSpoofProof || null,
        pendingReason: c.pendingReason || null
      }))
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TEARS-Creator-Verification-Audit-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section className="space-y-6 pt-4 border-t border-slate-800/80">
      
      {/* Dashboard Section Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>OPERATIONAL TELEMETRY &amp; CREATOR VERIFICATION METRICS</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
            Creator Identity Verification Dashboard
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time audit of sovereign biometric liveness, government credential matching, and pending clearance queues.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
            <span>Register Creator</span>
          </button>

          <button
            onClick={handleExportAuditManifest}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download full verification audit report as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export Audit</span>
          </button>

          <button
            onClick={onResetDefaults}
            className="p-2 bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Reset to default benchmark creators"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid: Successful vs. Pending */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Successful Verifications */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-black border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider">
              Successful Verifications
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.successful}</span>
            <span className="text-xs font-bold text-emerald-400">
              {stats.successRate}% of total
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
            Sovereign credentials issued with 468-point 3D facial mesh &amp; Ed25519 tokens.
          </p>
          <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-emerald-300">
            <span>Client Enclave Bound</span>
            <span className="font-bold">Active in Broadcast</span>
          </div>
        </div>

        {/* Metric 2: Pending Verifications */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-black border border-amber-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-amber-400 uppercase tracking-wider">
              Pending Clearances
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.pending}</span>
            <span className="text-xs font-bold text-amber-400">
              {stats.pendingRate}% in queue
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
            Awaiting 3D camera scan, liveness challenge, or government ID MRZ barcode match.
          </p>
          <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between text-[11px] font-mono text-amber-300">
            <span>Avg Queue Clearance</span>
            <span className="font-bold">&lt; 3 Minutes</span>
          </div>
        </div>

        {/* Metric 3: Success Rate & Face Match Quality */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-black border border-cyan-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider">
              Verification Success Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats.successRate}%</span>
            <span className="text-xs font-bold text-cyan-300">
              {stats.successful} of {stats.total} total
            </span>
          </div>
          
          {/* Ratio bar preview */}
          <div className="mt-2.5 w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${stats.successRate}%` }} 
              title={`Successful: ${stats.successRate}%`}
            />
            <div 
              className="bg-amber-500 h-full transition-all duration-500" 
              style={{ width: `${stats.pendingRate}%` }} 
              title={`Pending: ${stats.pendingRate}%`}
            />
          </div>

          <div className="mt-3 pt-2.5 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-cyan-300">
            <span>Avg Face Match Score</span>
            <span className="font-bold text-emerald-400">{stats.avgMatchScore}%</span>
          </div>
        </div>

        {/* Metric 4: Zero-Honeypot Security & Breach Exposure */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-black border border-purple-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-purple-400 uppercase tracking-wider">
              Privacy &amp; Threat Defense
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">0.0%</span>
            <span className="text-xs font-bold text-purple-300">Honeypot Risk</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
            Raw biometrics isolated in client device hardware enclaves. 0 central server leaks.
          </p>
          <div className="mt-3 pt-2.5 border-t border-purple-500/20 flex items-center justify-between text-[11px] font-mono text-purple-300">
            <span>Anti-Spoof Attacks</span>
            <span className="font-bold text-emerald-400">0 Breaches</span>
          </div>
        </div>

      </div>

      {/* Recharts Visual Data Presentation Suite */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
        
        {/* Header & Chart View Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>RECHARTS VISUAL DATA PRESENTATION ENGINE</span>
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Creator Verification Telemetry &amp; Comparative Analytics
            </h4>
            <p className="text-xs text-slate-400">
              Visualizing successful clearances versus pending identity queues using the Recharts data visualization library.
            </p>
          </div>

          {/* Interactive Recharts Tab Controls */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start lg:self-auto">
            <button
              onClick={() => setActiveChartTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartTab === 'all'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 4 Charts</span>
            </button>

            <button
              onClick={() => setActiveChartTab('pie')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartTab === 'pie'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Status Ratio</span>
            </button>

            <button
              onClick={() => setActiveChartTab('docType')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartTab === 'docType'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Government ID</span>
            </button>

            <button
              onClick={() => setActiveChartTab('category')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartTab === 'category'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Creator Sectors</span>
            </button>

            <button
              onClick={() => setActiveChartTab('trend')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartTab === 'trend'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Intake Pipeline</span>
            </button>
          </div>
        </div>

        {/* Global At-A-Glance Status Progress Bar */}
        <div className="space-y-1.5 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
            <span className="font-bold text-slate-200">
              Overall Creator Clearance Progress: <strong className="text-emerald-400">{stats.successRate}% Verified</strong>
            </span>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{stats.successful} Cleared</span>
              </span>
              <span className="text-amber-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{stats.pending} In Review</span>
              </span>
              <span className="text-slate-400">({stats.total} Total)</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-lg overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${stats.successRate}%` }} 
              title={`Successful: ${stats.successRate}%`}
            />
            <div 
              className="bg-amber-500 h-full transition-all duration-500" 
              style={{ width: `${stats.pendingRate}%` }} 
              title={`Pending: ${stats.pendingRate}%`}
            />
          </div>
        </div>

        {/* Recharts Multi-Grid Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Donut PieChart (Successful vs. Pending) */}
          {(activeChartTab === 'all' || activeChartTab === 'pie') && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <PieIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Clearance Status Distribution (Recharts Donut)</span>
                  </h5>
                  <p className="text-[11px] text-slate-400">Ratio of cryptographically verified creators to pending scans</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">{stats.successRate}%</span>
                  <span className="text-[10px] text-slate-500 block">Clearance Rate</span>
                </div>
              </div>

              <div className="h-64 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-xs space-y-1">
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                                <span>{data.name}</span>
                              </div>
                              <div className="font-mono text-slate-300">
                                Count: <strong className="text-white">{data.value}</strong> creators ({data.pct}%)
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span className="text-[11px] text-slate-300">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Badge Overlay inside Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-8">
                  <span className="text-2xl font-extrabold text-white font-mono">{stats.successful} / {stats.total}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Verified Sovereign</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-emerald-400">● {stats.successful} Successful ({stats.successRate}%)</span>
                <span className="text-amber-400">● {stats.pending} Pending ({stats.pendingRate}%)</span>
              </div>
            </div>
          )}

          {/* Chart 2: Grouped BarChart by Government ID Type */}
          {(activeChartTab === 'all' || activeChartTab === 'docType') && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Clearance by Government ID Type (Recharts Bar)</span>
                  </h5>
                  <p className="text-[11px] text-slate-400">Successful vs pending comparison across state &amp; federal documents</p>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400 font-bold">3</span> Document Formats
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={docTypeBarData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      tickLine={false} 
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      tickLine={false} 
                      allowDecimals={false} 
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const item = docTypeBarData.find((d) => d.name === label);
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-xs space-y-1">
                              <div className="font-bold text-white">{item?.fullType || label}</div>
                              <div className="text-emerald-400 font-mono">
                                Successful: <span className="font-bold">{payload[0]?.value}</span>
                              </div>
                              <div className="text-amber-400 font-mono">
                                Pending: <span className="font-bold">{payload[1]?.value}</span>
                              </div>
                              <div className="text-slate-400 font-mono pt-1 border-t border-slate-800 text-[10px]">
                                Clearance Rate: {item?.rate}%
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={32}
                      formatter={(value) => <span className="text-[11px] text-slate-300">{value}</span>}
                    />
                    <Bar dataKey="Successful" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={36} />
                    <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Driver&apos;s License: {stats.byDocType["Driver's License"].successful} Cleared</span>
                <span>Passport: {stats.byDocType["Passport"].successful} Cleared</span>
                <span>State ID: {stats.byDocType["State ID"].successful} Cleared</span>
              </div>
            </div>
          )}

          {/* Chart 3: Stacked BarChart across Creator Categories */}
          {(activeChartTab === 'all' || activeChartTab === 'category') && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>Clearance by Creator Category (Recharts Stacked)</span>
                  </h5>
                  <p className="text-[11px] text-slate-400">Breakdown of musicians, TV hosts, filmmakers, journalists, and syndicators</p>
                </div>
                <span className="text-[11px] font-mono text-purple-400 font-bold">5 Sectors</span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} layout="vertical" margin={{ top: 10, right: 15, left: 25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const item = categoryChartData.find((c) => c.name === label);
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-xs space-y-1">
                              <div className="font-bold text-white">{item?.fullName || label}</div>
                              <div className="text-emerald-400 font-mono">
                                Successful: <span className="font-bold">{payload[0]?.value}</span>
                              </div>
                              <div className="text-amber-400 font-mono">
                                Pending: <span className="font-bold">{payload[1]?.value}</span>
                              </div>
                              <div className="text-slate-400 font-mono text-[10px] pt-1 border-t border-slate-800">
                                Total Registered: {item?.Total}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={32}
                      formatter={(value) => <span className="text-[11px] text-slate-300">{value}</span>}
                    />
                    <Bar dataKey="Successful" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="Pending" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Music: {stats.byCategory['Musician & Producer']?.successful || 0} Cleared</span>
                <span>Broadcasting: {stats.byCategory['Broadcast & TV Host']?.successful || 0} Cleared</span>
                <span>Real Estate: {stats.byCategory['Real Estate Syndicator']?.successful || 0} Cleared</span>
              </div>
            </div>
          )}

          {/* Chart 4: Verification Pipeline & Confidence AreaChart */}
          {(activeChartTab === 'all' || activeChartTab === 'trend') && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Clearance Pipeline &amp; Confidence Trend (Recharts Area)</span>
                  </h5>
                  <p className="text-[11px] text-slate-400">Cohort velocity tracking successful clearances vs pending intake</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-cyan-400">{stats.avgMatchScore}%</span>
                  <span className="text-[10px] text-slate-500 block">Avg Match Confidence</span>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorSuccessful" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="cohort" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const item = trendData.find((t) => t.cohort === label);
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-xs space-y-1">
                              <div className="font-bold text-white">{label}</div>
                              <div className="text-emerald-400 font-mono">
                                Successful: <span className="font-bold">{payload[0]?.value}</span>
                              </div>
                              <div className="text-amber-400 font-mono">
                                Pending: <span className="font-bold">{payload[1]?.value}</span>
                              </div>
                              <div className="text-cyan-400 font-mono text-[10px] pt-1 border-t border-slate-800">
                                3D Mesh Confidence: {item?.confidence}%
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={32}
                      formatter={(value) => <span className="text-[11px] text-slate-300">{value}</span>}
                    />
                    <Area type="monotone" dataKey="Successful" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSuccessful)" />
                    <Area type="monotone" dataKey="Pending" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorPending)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Total Intakes: {stats.total}</span>
                <span className="text-emerald-400">Liveness Passed: {stats.successful}</span>
                <span className="text-amber-400">In Challenge: {stats.pending}</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Creator Roster Table with Search, Filter & Quick-Verify Operations */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Creators ({creators.length})
            </button>
            <button
              onClick={() => setStatusFilter('successful')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'successful'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Successful ({stats.successful})</span>
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Pending ({stats.pending})</span>
            </button>
          </div>

          {/* Search Input & Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Search */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creator, handle, ID..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Doc Type Filter */}
            <select
              value={idTypeFilter}
              onChange={(e) => setIdTypeFilter(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All ID Types</option>
              <option value="Driver's License">Driver&apos;s License</option>
              <option value="Passport">Passport</option>
              <option value="State ID">State ID</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              <option value="Musician & Producer">Musicians &amp; Producers</option>
              <option value="Broadcast & TV Host">Broadcast &amp; TV Hosts</option>
              <option value="Independent Filmmaker">Filmmakers</option>
              <option value="Podcaster & Journalist">Podcasters &amp; Journalists</option>
              <option value="Real Estate Syndicator">Real Estate Syndicators</option>
            </select>

          </div>

        </div>

        {/* Creators Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 bg-slate-900/60 uppercase tracking-wider">
                <th className="py-3 px-4">Creator / Channel</th>
                <th className="py-3 px-4">Government Credential</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4">Biometric Proof</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCreators.length > 0 ? (
                filteredCreators.map((creator) => {
                  const isSuccess = creator.status === 'successful';
                  return (
                    <tr key={creator.id} className="hover:bg-slate-900/40 transition-colors">
                      
                      {/* Creator Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${creator.avatarColor} flex items-center justify-center text-white font-extrabold text-xs shadow-md shrink-0`}>
                            {creator.creatorName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{creator.creatorName}</span>
                              {isSuccess && (
                                <span title="Biometrically Verified Sovereign Identity">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <span className="text-cyan-400 font-mono">{creator.creatorHandle}</span>
                              <span>·</span>
                              <span className="text-slate-500 truncate max-w-[160px] sm:max-w-[220px]">
                                {creator.channelOrBandName}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {creator.creatorCategory}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Government Credential */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">
                          {creator.idType}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {creator.documentNumberMasked}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {creator.jurisdiction}
                        </div>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3 px-4">
                        {isSuccess ? (
                          <div className="space-y-0.5">
                            <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Successful Verification</span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              Verified: {creator.verifiedAt ? new Date(creator.verifiedAt).toLocaleDateString() : 'Active'}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>Pending Clearance</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {creator.pendingReason || 'Awaiting 3D Face Mesh Scan'}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Biometric Proof Data */}
                      <td className="py-3 px-4">
                        {isSuccess ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400 font-bold font-mono">
                                {creator.faceMatchScore}% Match
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                ({creator.facialLandmarksCount || 468} pts)
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedCreatorForProof(creator)}
                              className="text-[11px] text-cyan-400 hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
                            >
                              <Lock className="w-3 h-3 text-cyan-400" />
                              <span>Inspect Proof</span>
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500 font-mono">
                            <span>No token issued yet</span>
                            <div className="text-[10px] text-amber-400/80">Camera scan required</div>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isSuccess ? (
                            <button
                              onClick={() => onVerifyCreator(creator.id)}
                              className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-[11px] rounded-lg shadow flex items-center gap-1 transition-all cursor-pointer"
                              title="Simulate 3D Face Mesh Scan & Pass Liveness"
                            >
                              <Camera className="w-3 h-3 text-black" />
                              <span>Verify Now</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onMarkPending(creator.id)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
                              title="Revert to pending for re-audit testing"
                            >
                              <span>Re-audit</span>
                            </button>
                          )}

                          <button
                            onClick={() => onRemoveCreator(creator.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800 cursor-pointer"
                            title="Remove creator record"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 space-y-2">
                    <AlertTriangle className="w-6 h-6 text-slate-600 mx-auto" />
                    <p className="text-xs">No creator verification records found matching current filters.</p>
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setCategoryFilter('all');
                        setIdTypeFilter('all');
                        setSearchQuery('');
                      }}
                      className="text-cyan-400 hover:underline text-xs"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 pt-1">
          <div className="font-mono text-[11px]">
            Showing <strong className="text-white">{filteredCreators.length}</strong> of <strong className="text-white">{creators.length}</strong> registered creators
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span>• NIST 800-63B Level 3</span>
            <span>• AES-GCM Local Vault</span>
            <span>• Ed25519 Token Signatures</span>
          </div>
        </div>

      </div>

      {/* MODAL 1: Cryptographic Biometric Proof Inspector */}
      {selectedCreatorForProof && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedCreatorForProof(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>CRYPTOGRAPHIC BIOMETRIC PROOF VAULT</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">
                {selectedCreatorForProof.creatorName}
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                {selectedCreatorForProof.creatorHandle} · {selectedCreatorForProof.channelOrBandName}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs font-mono">
              
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-500">Credential Type:</span>
                <span className="text-white font-bold">{selectedCreatorForProof.idType}</span>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-500">Masked ID Number:</span>
                <span className="text-slate-300">{selectedCreatorForProof.documentNumberMasked}</span>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-500">Issuing Authority:</span>
                <span className="text-slate-300">{selectedCreatorForProof.jurisdiction}</span>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-500">3D Face Mesh Score:</span>
                <span className="text-emerald-400 font-bold">
                  {selectedCreatorForProof.faceMatchScore}% ({selectedCreatorForProof.facialLandmarksCount || 468} points)
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-slate-500 block text-[10px] uppercase">Anti-Spoofing SHA-256 Proof:</span>
                <div className="p-2 bg-black/60 rounded border border-slate-800 text-[10px] text-amber-300 break-all select-all">
                  {selectedCreatorForProof.antiSpoofProof || 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] uppercase">Ed25519 Cryptographic Token:</span>
                  <button
                    onClick={() => copyToClipboard(selectedCreatorForProof.cryptographicToken || '')}
                    className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2 bg-black/60 rounded border border-slate-800 text-[10px] text-cyan-300 break-all select-all">
                  {selectedCreatorForProof.cryptographicToken || 'ed25519:verif:9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b'}
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero-Honeypot Compliant: Stored exclusively on local hardware enclave.</span>
              </div>

            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedCreatorForProof(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Register New Creator Verification Request */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>NEW CREATOR VERIFICATION CLEARANCE</span>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-lg font-bold text-white">Register Creator for Identity Audit</h4>
              <p className="text-xs text-slate-400">
                Add an independent artist, broadcaster, or producer to track their verification telemetry.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block text-slate-300 font-bold mb-1">Legal Full Name</label>
                <input
                  type="text"
                  required
                  value={newCreatorName}
                  onChange={(e) => setNewCreatorName(e.target.value)}
                  placeholder="e.g. Jordan Mitchell"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Creator Handle</label>
                  <input
                    type="text"
                    value={newCreatorHandle}
                    onChange={(e) => setNewCreatorHandle(e.target.value)}
                    placeholder="@jordan.sound"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Channel or Band</label>
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="e.g. Skyline Acoustics"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Creator Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CreatorCategory)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Musician & Producer">Musician &amp; Producer</option>
                    <option value="Broadcast & TV Host">Broadcast &amp; TV Host</option>
                    <option value="Independent Filmmaker">Independent Filmmaker</option>
                    <option value="Podcaster & Journalist">Podcaster &amp; Journalist</option>
                    <option value="Real Estate Syndicator">Real Estate Syndicator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Government ID Type</label>
                  <select
                    value={newIdType}
                    onChange={(e) => setNewIdType(e.target.value as GovernmentIdType)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Driver's License">Driver&apos;s License</option>
                    <option value="Passport">Passport</option>
                    <option value="State ID">State ID</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    value={newJurisdiction}
                    onChange={(e) => setNewJurisdiction(e.target.value)}
                    placeholder="e.g. State of Michigan (SOS)"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Document Number</label>
                  <input
                    type="text"
                    value={newDocNumber}
                    onChange={(e) => setNewDocNumber(e.target.value)}
                    placeholder="e.g. M129-382-901"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Initial Verification Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewInitialStatus('pending')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                      newInitialStatus === 'pending'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-amber-400" />
                    <div>
                      <div>Pending Queue</div>
                      <div className="text-[10px] text-slate-500">Camera scan needed</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewInitialStatus('successful')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                      newInitialStatus === 'successful'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div>Immediate Verified</div>
                      <div className="text-[10px] text-slate-500">Simulate clearance</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded-xl shadow-lg"
                >
                  Save Creator Record
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
