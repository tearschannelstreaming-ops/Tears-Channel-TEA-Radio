import React, { useState } from 'react';
import { 
  Menu, MoreVertical, HelpCircle, UploadCloud, Play, Film, Music, Tv, 
  Video, DollarSign, Calendar, BarChart3, Settings, Layout, Bell, 
  Trash2, CheckCircle2, Copy, Check, ExternalLink, RefreshCw, X, 
  ChevronDown, ChevronRight, Sparkles, Shield, Plus, Eye, Radio, 
  Search, ArrowUpRight, FolderOpen, AlertCircle, Share2, Smartphone, 
  CheckSquare, ArrowRight, Layers, Award, Compass, ShieldCheck
} from 'lucide-react';
import { ChannelId } from '../types';

export interface StudioMediaAsset {
  id: string;
  title: string;
  source: 'Direct Upload' | 'YouTube Ingest' | 'Vimeo Pro' | 'Dropbox Cloud' | 'RTMP Live';
  sourceUrl?: string;
  category: 'Entertainment' | 'Real Estate' | 'Radio & Music' | 'Commercial' | 'Safety Dispatch';
  channelId: ChannelId;
  duration: string;
  resolution: string;
  fileSize: string;
  uploadDate: string;
  views: number;
  status: 'Published' | 'Encoding' | 'Draft';
  mlsTagged?: boolean;
}

const INITIAL_MEDIA_LIBRARY: StudioMediaAsset[] = [
  {
    id: 'media-01',
    title: 'A Perfect Murder (2025) — Part 1 (True Crime Mystery Special)',
    source: 'Direct Upload',
    category: 'Entertainment',
    channelId: 'tears-prime',
    duration: '48:15',
    resolution: '4K UHD',
    fileSize: '3.4 GB',
    uploadDate: '2026-10-18',
    views: 14820,
    status: 'Published'
  },
  {
    id: 'media-02',
    title: 'Woodward Commercial Development Site Walk with Broker Jeanell Land',
    source: 'YouTube Ingest',
    sourceUrl: 'https://www.youtube.com/@T.E.A.R.S.Channel-h3u',
    category: 'Real Estate',
    channelId: 'real-estate-tv',
    duration: '24:50',
    resolution: '1080p60',
    fileSize: '1.8 GB',
    uploadDate: '2026-10-17',
    views: 8940,
    status: 'Published',
    mlsTagged: true
  },
  {
    id: 'media-03',
    title: 'T.E.A.R.adio Live Drive-Time Session: Johnnie Taylor & Motown Soul',
    source: 'RTMP Live',
    category: 'Radio & Music',
    channelId: 'tear-radio',
    duration: '1:15:00',
    resolution: 'Lossless Audio',
    fileSize: '820 MB',
    uploadDate: '2026-10-18',
    views: 19500,
    status: 'Published'
  },
  {
    id: 'media-04',
    title: 'Riverfront Assemblage: 4.12 Acres Mixed-Use Waterfront Opportunity',
    source: 'Vimeo Pro',
    category: 'Real Estate',
    channelId: 'real-estate-tv',
    duration: '18:40',
    resolution: '4K UHD',
    fileSize: '2.1 GB',
    uploadDate: '2026-10-16',
    views: 6200,
    status: 'Published',
    mlsTagged: true
  },
  {
    id: 'media-05',
    title: 'S.T.E.A.R.Safe Highway Driver Safety Alert & Sensor Technology',
    source: 'Dropbox Cloud',
    category: 'Safety Dispatch',
    channelId: 'tears-prime',
    duration: '12:30',
    resolution: '1080p',
    fileSize: '950 MB',
    uploadDate: '2026-10-15',
    views: 11200,
    status: 'Published'
  },
  {
    id: 'media-06',
    title: 'Metro Detroit Local Enterprise Spotlight & Prime 30s Airtime Demo',
    source: 'Direct Upload',
    category: 'Commercial',
    channelId: 'business-spotlight',
    duration: '0:30',
    resolution: '1080p',
    fileSize: '65 MB',
    uploadDate: '2026-10-18',
    views: 4500,
    status: 'Published'
  }
];

const INITIAL_TRASH_ITEMS: StudioMediaAsset[] = [
  {
    id: 'media-trash-01',
    title: 'RAW_CLIP_20261014_UNEDITED_OUTTAKES.mp4',
    source: 'Direct Upload',
    category: 'Entertainment',
    channelId: 'tears-prime',
    duration: '04:12',
    resolution: '720p',
    fileSize: '210 MB',
    uploadDate: '2026-10-14',
    views: 0,
    status: 'Draft'
  },
  {
    id: 'media-trash-02',
    title: 'Draft Duplicate Woodward Footage (Superseded by 4K master)',
    source: 'Direct Upload',
    category: 'Real Estate',
    channelId: 'real-estate-tv',
    duration: '22:10',
    resolution: '1080p',
    fileSize: '1.4 GB',
    uploadDate: '2026-10-12',
    views: 12,
    status: 'Draft'
  }
];

interface TearsStudioCMSProps {
  onSelectTab: (tab: string) => void;
}

export const TearsStudioCMS: React.FC<TearsStudioCMSProps> = ({ onSelectTab }) => {
  // Navigation & Drawer state (mimics Image 1)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeMenuSection, setActiveMenuSection] = useState<string>('library');
  
  // Library & View state (mimics Image 2)
  const [currentView, setCurrentView] = useState<'library' | 'trash'>('library');
  const [mediaList, setMediaList] = useState<StudioMediaAsset[]>(INITIAL_MEDIA_LIBRARY);
  const [trashList, setTrashList] = useState<StudioMediaAsset[]>(INITIAL_TRASH_ITEMS);
  
  // Ingest modals & inputs
  const [activeIngestModal, setActiveIngestModal] = useState<'upload' | 'youtube' | 'vimeo' | 'dropbox' | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<ChannelId>('tears-prime');
  const [selectedCategory, setSelectedCategory] = useState<'Entertainment' | 'Real Estate' | 'Radio & Music' | 'Commercial' | 'Safety Dispatch'>('Entertainment');
  const [autoMlsWatermark, setAutoMlsWatermark] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNotification, setSuccessNotification] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<StudioMediaAsset | null>(null);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Show temporary toast notification
  const notify = (msg: string) => {
    setSuccessNotification(msg);
    setTimeout(() => setSuccessNotification(null), 3500);
  };

  // Handle direct file upload simulation
  const handleSimulateFileUpload = (fileName: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const newAsset: StudioMediaAsset = {
        id: `media-${Date.now()}`,
        title: customTitle.trim() || fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        source: 'Direct Upload',
        category: selectedCategory,
        channelId: selectedChannel,
        duration: '15:20',
        resolution: '4K UHD',
        fileSize: '1.2 GB',
        uploadDate: new Date().toISOString().split('T')[0],
        views: 1,
        status: 'Published',
        mlsTagged: selectedCategory === 'Real Estate' && autoMlsWatermark
      };

      setMediaList(prev => [newAsset, ...prev]);
      setIsProcessing(false);
      setActiveIngestModal(null);
      setCustomTitle('');
      notify(`Asset "${newAsset.title}" ingested & queued for Roku TV simulcast!`);
    }, 1200);
  };

  // Handle YouTube Ingestion (@T.E.A.R.S.Channel-h3u)
  const handleYouTubeIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const newAsset: StudioMediaAsset = {
        id: `media-yt-${Date.now()}`,
        title: customTitle.trim() || `T.E.A.R.S. Broadcast Stream (${inputUrl.slice(-11)})`,
        source: 'YouTube Ingest',
        sourceUrl: inputUrl,
        category: selectedCategory,
        channelId: selectedChannel,
        duration: '32:10',
        resolution: '1080p60',
        fileSize: '2.4 GB',
        uploadDate: new Date().toISOString().split('T')[0],
        views: 350,
        status: 'Published',
        mlsTagged: selectedCategory === 'Real Estate' && autoMlsWatermark
      };

      setMediaList(prev => [newAsset, ...prev]);
      setIsProcessing(false);
      setActiveIngestModal(null);
      setInputUrl('');
      setCustomTitle('');
      notify(`YouTube asset ingested directly from @T.E.A.R.S.Channel-h3u!`);
    }, 1200);
  };

  // Handle Vimeo Ingest
  const handleVimeoIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const newAsset: StudioMediaAsset = {
        id: `media-vim-${Date.now()}`,
        title: customTitle.trim() || `Vimeo Pro Master Stream (${inputUrl.slice(-8)})`,
        source: 'Vimeo Pro',
        sourceUrl: inputUrl,
        category: selectedCategory,
        channelId: selectedChannel,
        duration: '21:05',
        resolution: '4K UHD',
        fileSize: '3.1 GB',
        uploadDate: new Date().toISOString().split('T')[0],
        views: 120,
        status: 'Published',
        mlsTagged: selectedCategory === 'Real Estate' && autoMlsWatermark
      };

      setMediaList(prev => [newAsset, ...prev]);
      setIsProcessing(false);
      setActiveIngestModal(null);
      setInputUrl('');
      setCustomTitle('');
      notify(`Vimeo Pro asset synced with T.E.A.R.S. Transcoder!`);
    }, 1200);
  };

  // Handle Dropbox Ingest
  const handleDropboxIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const newAsset: StudioMediaAsset = {
        id: `media-drop-${Date.now()}`,
        title: customTitle.trim() || `Cloud Asset Master Archive`,
        source: 'Dropbox Cloud',
        sourceUrl: inputUrl,
        category: selectedCategory,
        channelId: selectedChannel,
        duration: '45:00',
        resolution: '1080p',
        fileSize: '1.9 GB',
        uploadDate: new Date().toISOString().split('T')[0],
        views: 85,
        status: 'Published',
        mlsTagged: selectedCategory === 'Real Estate' && autoMlsWatermark
      };

      setMediaList(prev => [newAsset, ...prev]);
      setIsProcessing(false);
      setActiveIngestModal(null);
      setInputUrl('');
      setCustomTitle('');
      notify(`Cloud Dropbox package downloaded & published!`);
    }, 1200);
  };

  // Move to trash
  const handleMoveToTrash = (asset: StudioMediaAsset) => {
    setMediaList(prev => prev.filter(m => m.id !== asset.id));
    setTrashList(prev => [asset, ...prev]);
    notify(`Moved "${asset.title}" to Trash.`);
  };

  // Restore from trash
  const handleRestoreFromTrash = (asset: StudioMediaAsset) => {
    setTrashList(prev => prev.filter(m => m.id !== asset.id));
    setMediaList(prev => [asset, ...prev]);
    notify(`Restored "${asset.title}" to Active Library.`);
  };

  // Filter items
  const activeDisplayItems = (currentView === 'library' ? mediaList : trashList).filter(item => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.source.toLowerCase().includes(q);
  });

  return (
    <div className="relative min-h-[85vh] bg-[#070c16] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col font-sans">
      
      {/* Toast Notification */}
      {successNotification && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950/95 border border-emerald-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{successNotification}</span>
        </div>
      )}

      {/* Top Navigation Bar (replicates the top bar in Image 2) */}
      <div className="h-16 bg-[#0a1222] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0">
        
        {/* Left: Hamburger + T.E.A.R.S. Channel Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Toggle Studio Navigation Drawer"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-white font-black text-sm tracking-wider uppercase font-mono shadow-inner">
            T.E.A.R.S.
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OmniStream Studio CMS</span>
          </div>
        </div>

        {/* Center / Right: Help button, Three dots, Circular Medallion */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowTutorialModal(true)}
            className="w-8 h-8 rounded-full bg-[#1b5fa8] hover:bg-[#2572c6] text-white flex items-center justify-center transition-all shadow-md"
            title="Video Tutorials & Help Guide"
          >
            <HelpCircle className="w-4 h-4 font-bold" />
          </button>

          <button
            onClick={() => setShowMoreActions(!showMoreActions)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative"
            title="Options & Channels"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Official Circle Medallion Logo */}
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-400 shadow-md flex items-center justify-center bg-slate-900 shrink-0">
            <img
              src="/app-media/app_logo.jpg"
              alt="T.E.A.R.S. Channel Logo"
              className="w-full h-full object-cover scale-[1.46]"
            />
          </div>
        </div>

      </div>

      {/* Main Body with Sidebar Drawer & Content */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* ============================================================== */}
        {/* SIDEBAR DRAWER MENU (Replicates Image 1, styled in luxury cobalt) */}
        {/* ============================================================== */}
        <div
          className={`absolute lg:static top-0 bottom-0 left-0 z-40 w-72 bg-[#0e3b6e] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl border-r border-[#194c87] ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-64'
          }`}
        >
          {/* Scrollable Menu Items */}
          <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
            
            {/* Mobile Close Button */}
            <div className="lg:hidden flex items-center justify-between px-3 pb-3 mb-2 border-b border-blue-400/30">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-200">
                Studio Tools &amp; Ingest
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-blue-200 hover:text-white rounded-lg hover:bg-blue-600/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items (matching Image 1 exactly) */}
            <button
              onClick={() => { setShowTutorialModal(true); setIsDrawerOpen(false); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <HelpCircle className="w-5 h-5 text-blue-200 shrink-0" />
              <span>Video Tutorials</span>
            </button>

            <button
              onClick={() => { setCurrentView('library'); setActiveMenuSection('library'); setIsDrawerOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
                activeMenuSection === 'library' && currentView === 'library'
                  ? 'bg-[#1b5fa8] shadow-md text-amber-300 font-bold'
                  : 'hover:bg-[#165094]'
              }`}
            >
              <Play className="w-5 h-5 text-blue-200 shrink-0" />
              <span>Video Library</span>
            </button>

            <button
              onClick={() => { onSelectTab('radio'); setIsDrawerOpen(false); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <Music className="w-5 h-5 text-purple-300 shrink-0" />
              <span>Audio Library</span>
            </button>

            <button
              onClick={() => { onSelectTab('live'); setIsDrawerOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <div className="flex items-center gap-3.5">
                <Tv className="w-5 h-5 text-blue-200 shrink-0" />
                <span>Channels</span>
              </div>
              <ChevronDown className="w-4 h-4 text-blue-300" />
            </button>

            <button
              onClick={() => { onSelectTab('guide'); setIsDrawerOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <div className="flex items-center gap-3.5">
                <Film className="w-5 h-5 text-blue-200 shrink-0" />
                <span>Video Playlists</span>
              </div>
              <ChevronDown className="w-4 h-4 text-blue-300" />
            </button>

            <button
              onClick={() => { onSelectTab('vod'); setIsDrawerOpen(false); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <Video className="w-5 h-5 text-blue-200 shrink-0" />
              <span>Video On Demand</span>
            </button>

            <button
              onClick={() => { onSelectTab('radio'); setIsDrawerOpen(false); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <Radio className="w-5 h-5 text-blue-200 shrink-0" />
              <span>Audio On Demand</span>
            </button>

            <button
              onClick={() => { onSelectTab('live'); setIsDrawerOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <div className="flex items-center gap-3.5">
                <Video className="w-5 h-5 text-red-300 shrink-0" />
                <span>Broadcast Live</span>
              </div>
              <ChevronDown className="w-4 h-4 text-blue-300" />
            </button>

            <button
              onClick={() => { onSelectTab('advertise'); setIsDrawerOpen(false); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <DollarSign className="w-5 h-5 text-amber-300 shrink-0" />
              <span>Subscription &amp; Monetize</span>
            </button>

            <button
              onClick={() => { onSelectTab('guide'); setIsDrawerOpen(false); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <Calendar className="w-5 h-5 text-blue-200 shrink-0" />
              <span>PPV Events</span>
            </button>

            {/* Patentable: Real Estate MLS Stream Sync */}
            <button
              onClick={() => { onSelectTab('realestate'); setIsDrawerOpen(false); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left bg-blue-900/40 border border-amber-400/40 text-amber-300"
            >
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span>MLS Stream Sync™</span>
            </button>

            {/* Patentable: System Claims & Architecture Hub */}
            <button
              onClick={() => { onSelectTab('patent'); setIsDrawerOpen(false); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left bg-amber-400/10 border border-amber-400/50 text-amber-300 font-bold"
            >
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Patent &amp; IP Lab™</span>
            </button>

            {/* Sovereign: Creator Monetization & Rights Verification */}
            <button
              onClick={() => { onSelectTab('creators'); setIsDrawerOpen(false); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left bg-red-600/15 border border-red-500/50 text-red-300 font-bold"
            >
              <DollarSign className="w-5 h-5 text-red-400 shrink-0" />
              <span>Creator Monetization &amp; Rights™</span>
            </button>

            <button
              onClick={() => { setActiveMenuSection('analytics'); setIsDrawerOpen(false); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <BarChart3 className="w-5 h-5 text-blue-200 shrink-0" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => { onSelectTab('developer'); setIsDrawerOpen(false); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <Settings className="w-5 h-5 text-blue-200 shrink-0" />
              <span>Device Settings</span>
            </button>

            <button
              onClick={() => { onSelectTab('scanner'); setIsDrawerOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <div className="flex items-center gap-3.5">
                <Layout className="w-5 h-5 text-blue-200 shrink-0" />
                <span>Page Builder Tools</span>
              </div>
              <ChevronDown className="w-4 h-4 text-blue-300" />
            </button>

            <button
              onClick={() => { notify('Notifications: All 4 channels operating normally.'); setIsDrawerOpen(false); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#165094] transition-colors text-left"
            >
              <Bell className="w-5 h-5 text-blue-200 shrink-0" />
              <span>Notifications</span>
            </button>

          </div>

          {/* Drawer Footer (Founder & Land Broker Avatar representation) */}
          <div className="p-3 bg-[#09294f] border-t border-[#194c87] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400 shrink-0 bg-slate-900">
              <img
                src="/app-media/screenshot_8.jpg"
                alt="Founder Jeanell Land"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/app-media/app_logo.jpg';
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Jeanell Land</div>
              <div className="text-[10px] text-blue-300 font-mono truncate">CEO &amp; Land Broker</div>
            </div>
          </div>
        </div>

        {/* Overlay backdrop for mobile drawer */}
        {isDrawerOpen && (
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* ============================================================== */}
        {/* MAIN STUDIO CONTENT AREA (Replicates Image 2 + Ingestion Suite) */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Subheader (matching Image 2 text: "View all videos you have uploaded to your channel") */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Media Ingest &amp; Multi-Platform Playout Suite
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                View all videos and live audio streams uploaded to your channel, Roku TV feed, and mobile apps.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveIngestModal('upload')}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Media</span>
              </button>
            </div>
          </div>

          {/* Patentable Product Innovation Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-cyan-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Patent-Pending Clean-Room Media Architecture</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  T.E.A.R.S.™ Multi-Stream Spatial Real Estate &amp; Public Safety Engine
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('patent')}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold rounded-xl transition-all shadow whitespace-nowrap flex items-center gap-1 shrink-0 hover:scale-105"
            >
              <span>Inspect Patent Claims &amp; Testbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ============================================================== */}
          {/* PROPRIETARY T.E.A.R.S. INGESTION SUITE (Original Clean-Room Design) */}
          {/* ============================================================== */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                <span>Proprietary Ingest Gateways &amp; Playout Pipelines</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                4 Pipelines Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 1. Master Direct Upload Card */}
              <div
                onClick={() => setActiveIngestModal('upload')}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 hover:from-slate-900 hover:to-slate-800/90 text-white border border-slate-700/80 hover:border-amber-400/80 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-400/30 font-bold">
                    Direct Master
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition-colors">
                    Direct Master 4K Upload
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Ingest MP4, MOV, ProRes, MKV, and lossless audio files directly into the T.E.A.R.S. transcode matrix.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Up to 4K @ 60fps</span>
                  <span className="text-amber-400 font-bold group-hover:underline">Browse Files →</span>
                </div>
              </div>

              {/* 2. Official YouTube Syndication Ingest (@T.E.A.R.S.Channel-h3u) */}
              <div
                onClick={() => setActiveIngestModal('youtube')}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-red-950/20 hover:from-slate-900 hover:to-red-950/40 text-white border border-slate-700/80 hover:border-red-500/80 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/30 font-bold">
                    Official Handle
                  </span>
                </div>
                <div>
                  <div className="text-[11px] text-red-400 font-mono font-bold">
                    @T.E.A.R.S.Channel-h3u
                  </div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-red-400 transition-colors">
                    YouTube Channel Syndication
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Import live stream replays, Detroit interviews, and music specials direct from the official YouTube channel.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Auto-Title Sanitization</span>
                  <span className="text-red-400 font-bold group-hover:underline">Ingest URL →</span>
                </div>
              </div>

              {/* 3. S.T.E.A.R.Safe Public Safety & Live Stream Uplink */}
              <div
                onClick={() => setActiveIngestModal('vimeo')}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-blue-950/20 hover:from-slate-900 hover:to-blue-950/40 text-white border border-slate-700/80 hover:border-cyan-500/80 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Radio className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-bold">
                    Live Uplink
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                    S.T.E.A.R.Safe Live RTMP / SRT
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Low-latency live stream uplink for broadcast telecasts, T.E.A.R.adio audio feeds, and emergency safety dispatches.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Ultra-Low Latency SRT</span>
                  <span className="text-cyan-400 font-bold group-hover:underline">Connect Stream →</span>
                </div>
              </div>

              {/* 4. MLS Real Estate Aerial Drone & Spatial Telemetry Ingest */}
              <div
                onClick={() => setActiveIngestModal('dropbox')}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-emerald-950/20 hover:from-slate-900 hover:to-emerald-950/40 text-white border border-slate-700/80 hover:border-emerald-500/80 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                    MLS Token AC8E6C053
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                    MLS Drone &amp; Parcel Ingestion
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Auto-correlates drone aerial flyovers with Wayne County GIS coordinates and Broker Jeanell Land&#39;s mobile app.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>GPS Spatial Binding</span>
                  <span className="text-emerald-400 font-bold group-hover:underline">Ingest Parcel →</span>
                </div>
              </div>

            </div>
          </div>

          {/* ============================================================== */}
          {/* BOTTOM CONTROLLER BAR (Replicates Image 2 Bottom Actions) */}
          {/* ============================================================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            
            {/* Library / Trash Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('library')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  currentView === 'library'
                    ? 'bg-[#1b5fa8] text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>Library</span>
                <span className="px-1.5 py-0.5 rounded-md bg-black/20 text-[10px]">
                  {mediaList.length}
                </span>
              </button>

              <button
                onClick={() => setCurrentView('trash')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                  currentView === 'trash'
                    ? 'bg-red-900/60 text-red-200 border border-red-500/40 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Trash</span>
                <span className="px-1.5 py-0.5 rounded-md bg-black/20 text-[10px]">
                  {trashList.length}
                </span>
              </button>

              <button
                onClick={() => {
                  notify('Auto-deduplicating: 0 duplicate clips detected in T.E.A.R.S. Channel.');
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1"
              >
                <span>More Actions</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Filter Search within library */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                placeholder="Search ingested clips..."
                className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

          </div>

          {/* ============================================================== */}
          {/* MEDIA ASSETS TABLE / LISTING */}
          {/* ============================================================== */}
          <div className="space-y-3">
            {activeDisplayItems.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
                <FolderOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="text-white font-bold text-sm">
                  {currentView === 'library' ? 'No active assets found' : 'Trash is currently empty'}
                </div>
                <p className="text-xs text-slate-400">
                  {currentView === 'library' ? 'Upload a clip or import from YouTube above to get started.' : 'Deleted media assets will appear here for 30 days.'}
                </p>
              </div>
            ) : (
              activeDisplayItems.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                      {item.category === 'Radio & Music' ? <Music className="w-5 h-5 text-purple-400" /> : <Play className="w-5 h-5 fill-current" />}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate max-w-md">
                          {item.title}
                        </span>
                        {item.mlsTagged && (
                          <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold">
                            MLS App Linked (AC8E6C053)
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                        <span className="text-amber-400/90">{item.source}</span>
                        <span>·</span>
                        <span>{item.duration}</span>
                        <span>·</span>
                        <span>{item.resolution}</span>
                        <span>·</span>
                        <span>{item.fileSize}</span>
                        <span>·</span>
                        <span className="text-emerald-400">{item.views.toLocaleString()} plays</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {currentView === 'library' ? (
                      <>
                        <button
                          onClick={() => setSelectedAsset(item)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => handleMoveToTrash(item)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Move to Trash"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRestoreFromTrash(item)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-500/40"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Restore to Library</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ============================================================== */}
          {/* PATENTABLE PRODUCT INNOVATION HIGHLIGHTS */}
          {/* ============================================================== */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1f38] via-slate-900 to-[#1e132b] border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>T.E.A.R.S. PROPRIETARY BROADCAST ARCHITECTURE (PATENT PENDING)</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Integrated Television, Real Estate MLS Sync &amp; Driver Safety Broadcast Engine
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unlike generic CMS platforms, the T.E.A.R.S. Engine features automated cross-transcoding to Roku SceneGraph, Apple tvOS HLS, synchronized T.E.A.R.adio audio dispatch, and dynamic real-time watermarking of Broker Jeanell Land&#39;s MLS Client Mobile App access code (<strong>AC8E6C053</strong>) into video property walks.
            </p>
          </div>

        </div>

      </div>

      {/* Floating Teal Quick Action Button (as seen in Image 1 & Image 2) */}
      <button
        onClick={() => setActiveIngestModal('upload')}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#18a287] hover:bg-[#158f77] text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border-2 border-white/20"
        title="Quick Ingest / Upload"
      >
        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white ml-1" />
      </button>

      {/* ============================================================== */}
      {/* INGEST MODALS */}
      {/* ============================================================== */}
      {activeIngestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  {activeIngestModal === 'upload' && 'Upload Video File to Channel'}
                  {activeIngestModal === 'youtube' && 'Ingest from YouTube Channel'}
                  {activeIngestModal === 'vimeo' && 'Import from Vimeo Pro'}
                  {activeIngestModal === 'dropbox' && 'Import from Cloud Dropbox'}
                </h3>
              </div>
              <button
                onClick={() => setActiveIngestModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ingest Form */}
            <div className="space-y-4">
              
              {activeIngestModal === 'upload' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Media File (Simulated File Browser)
                  </label>
                  <input
                    type="file"
                    accept="video/*,audio/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        handleSimulateFileUpload(e.target.files[0].name);
                      }
                    }}
                    className="w-full text-xs text-slate-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-black hover:file:bg-amber-300 cursor-pointer bg-slate-950 p-2 rounded-xl border border-slate-800"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {activeIngestModal === 'youtube' && 'YouTube Video / Broadcast URL (@T.E.A.R.S.Channel-h3u)'}
                    {activeIngestModal === 'vimeo' && 'Vimeo Video / Showcase Link'}
                    {activeIngestModal === 'dropbox' && 'Dropbox / Cloud Share URL'}
                  </label>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                    placeholder={
                      activeIngestModal === 'youtube' ? 'https://www.youtube.com/@T.E.A.R.S.Channel-h3u or video URL' :
                      activeIngestModal === 'vimeo' ? 'https://vimeo.com/manage/videos/...' :
                      'https://www.dropbox.com/s/...'
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Asset Title (Optional / Auto-Extracted)
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  placeholder="e.g. Detroit Commercial Acreage Showcase 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Broadcast Channel
                  </label>
                  <select
                    value={selectedChannel}
                    onChange={e => setSelectedChannel(e.target.value as ChannelId)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="tears-prime">CH 101: Primetime TV</option>
                    <option value="real-estate-tv">CH 102: Real Estate TV</option>
                    <option value="tear-radio">CH 103: T.E.A.R.adio Live</option>
                    <option value="business-spotlight">CH 104: Commercials</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Genre / Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option>Entertainment</option>
                    <option>Real Estate</option>
                    <option>Radio &amp; Music</option>
                    <option>Commercial</option>
                    <option>Safety Dispatch</option>
                  </select>
                </div>
              </div>

              {/* Patentable: Real Estate MLS Watermark Option */}
              <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/30 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="mlsWatermark"
                  checked={autoMlsWatermark}
                  onChange={e => setAutoMlsWatermark(e.target.checked)}
                  className="mt-0.5 rounded text-amber-400 focus:ring-0"
                />
                <label htmlFor="mlsWatermark" className="text-xs text-slate-300 cursor-pointer">
                  <span className="font-bold text-white block">Embed MLS Mobile App Code (AC8E6C053)</span>
                  <span>Automatically display Broker Jeanell Land&#39;s MLS Client link and QR watermark.</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveIngestModal(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                {activeIngestModal === 'youtube' && (
                  <button
                    onClick={handleYouTubeIngest}
                    disabled={isProcessing}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow disabled:opacity-50"
                  >
                    {isProcessing ? 'Ingesting YouTube Stream...' : 'Import from YouTube'}
                  </button>
                )}

                {activeIngestModal === 'vimeo' && (
                  <button
                    onClick={handleVimeoIngest}
                    disabled={isProcessing}
                    className="px-5 py-2.5 bg-[#1ab7ea] hover:bg-[#159ac4] text-white font-bold text-xs rounded-xl transition-all shadow disabled:opacity-50"
                  >
                    {isProcessing ? 'Ingesting Vimeo...' : 'Import from Vimeo'}
                  </button>
                )}

                {activeIngestModal === 'dropbox' && (
                  <button
                    onClick={handleDropboxIngest}
                    disabled={isProcessing}
                    className="px-5 py-2.5 bg-[#0061ff] hover:bg-[#004ecc] text-white font-bold text-xs rounded-xl transition-all shadow disabled:opacity-50"
                  >
                    {isProcessing ? 'Connecting Cloud...' : 'Import from Dropbox'}
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Tutorial Video / Quick Help Modal */}
      {showTutorialModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">T.E.A.R.S. Studio Video Tutorials</h3>
              </div>
              <button
                onClick={() => setShowTutorialModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>1. How to ingest YouTube clips from @T.E.A.R.S.Channel-h3u</span>
                  <span className="text-[10px] text-amber-400 font-mono">03:15</span>
                </div>
                <p className="text-slate-400">Step-by-step guide to importing video broadcasts directly into your 4K Roku feed.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>2. Linking Real Estate Walks to Jeanell Land&#39;s MLS App</span>
                  <span className="text-[10px] text-amber-400 font-mono">04:40</span>
                </div>
                <p className="text-slate-400">Enabling automatic access code AC8E6C053 overlay for commercial land inquiries.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>3. Managing Roku TV &amp; Mobile Simulcast Playout</span>
                  <span className="text-[10px] text-amber-400 font-mono">05:20</span>
                </div>
                <p className="text-slate-400">How to schedule primetime episodes and synchronize T.E.A.R.adio audio feeds.</p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowTutorialModal(false)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl"
              >
                Close Tutorials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Asset Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Asset Details &amp; Transcode</h3>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div><span className="text-slate-500">Asset Title:</span> <strong className="text-white font-sans">{selectedAsset.title}</strong></div>
                <div><span className="text-slate-500">Source:</span> <span className="text-amber-400">{selectedAsset.source}</span></div>
                <div><span className="text-slate-500">Channel Playout:</span> <span className="text-cyan-400 uppercase">{selectedAsset.channelId}</span></div>
                <div><span className="text-slate-500">Specs:</span> {selectedAsset.resolution} · {selectedAsset.duration} · {selectedAsset.fileSize}</div>
                <div><span className="text-slate-500">Roku Feed Status:</span> <span className="text-emerald-400 font-bold">Active in HLS Master Playlist</span></div>
                {selectedAsset.mlsTagged && (
                  <div className="text-cyan-300 pt-1 border-t border-slate-800">
                    MLS Real Estate Code Embedded: AC8E6C053 (Broker Jeanell Land)
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  notify(`Transcoding refreshed for "${selectedAsset.title}".`);
                  setSelectedAsset(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium"
              >
                Re-encode Stream
              </button>
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
