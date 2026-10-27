import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LivePlayer } from './components/LivePlayer';
import { ProgramGuide } from './components/ProgramGuide';
import { RealEstatePortal } from './components/RealEstatePortal';
import { VodCatalog } from './components/VodCatalog';
import { TearRadioBar } from './components/TearRadioBar';
import { AdvertisePortal } from './components/AdvertisePortal';
import { MediaCorrectionCenter } from './components/MediaCorrectionCenter';
import { DeveloperPlatformsPortal } from './components/DeveloperPlatformsPortal';
import { SettingsModal } from './components/SettingsModal';
import { RokuPlatformHub } from './components/RokuPlatformHub';
import { VideoModal } from './components/VideoModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { FaqPortal } from './components/FaqPortal';
import { TearsStudioCMS } from './components/TearsStudioCMS';
import { PatentInnovationPortal } from './components/PatentInnovationPortal';
import { CreatorCompensationStudio } from './components/CreatorCompensationStudio';
import { CreatorTaxPortal } from './components/CreatorTaxPortal';
import { BiometricIdVerificationPortal } from './components/BiometricIdVerificationPortal';
import { TearRadioMusicDistribution } from './components/TearRadioMusicDistribution';
import { TearSafeSocialHub } from './components/TearSafeSocialHub';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OfflineFallbackPage } from './components/OfflineFallbackPage';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { ChannelId, VodItem } from './types';
import { VOD_ITEMS } from './data/mockData';
import { Tv, Radio, Building2, Megaphone, ArrowUpRight, Sparkles, Code2, HelpCircle, UploadCloud, Award } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('live');
  const [currentChannelId, setCurrentChannelId] = useState<ChannelId>('tears-prime');
  const [activeVod, setActiveVod] = useState<VodItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isOnline = useOnlineStatus();

  // Read URL query parameters on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const chParam = params.get('channel') as ChannelId | null;
      if (tabParam && ['live', 'guide', 'realestate', 'vod', 'radio', 'scanner', 'developer', 'advertise', 'faq', 'studio', 'patent', 'creators', 'taxes', 'biometrics', 'music', 'social', 'safe', 'offline', 'calendar'].includes(tabParam)) {
        setActiveTab(tabParam === 'safe' ? 'social' : tabParam);
      }
      if (chParam && ['tears-prime', 'real-estate-tv', 'tear-radio', 'business-spotlight'].includes(chParam)) {
        setCurrentChannelId(chParam);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  const handleTuneIn = (channelId: ChannelId) => {
    setCurrentChannelId(channelId);
    setActiveTab('live');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar with Official Medallion Logo, Navigation, Settings Gear & Primary Action */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Red Announcement Strip (matching Screenshot 1) with Petition Link */}
      <div className="bg-red-600/90 py-1.5 px-4 text-center text-xs font-bold text-white tracking-wide shadow-sm flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <span>T.E.A.R.S. Channel Television Entertainment Advertisement RealEstate Streaming Channel</span>
        <span className="hidden sm:inline text-red-200">·</span>
        <a
          href="https://c.org/nx2fdzbjB7"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-sm transition-transform hover:scale-105"
          title="Sign the Family Reunite Act Petition on Change.org"
        >
          <span>✍️ Sign Family Reunite Act Petition</span>
        </a>
        <button
          onClick={() => setActiveTab('developer')}
          className="hidden lg:inline-block underline text-amber-200 hover:text-white font-mono text-[11px]"
        >
          iOS App ID: 6762139785 →
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Live Broadcast View */}
        {activeTab === 'live' && (
          <div className="space-y-8">
            
            {/* Live TV Screen Frame */}
            <LivePlayer
              currentChannelId={currentChannelId}
              onSelectChannel={setCurrentChannelId}
              onNavigateToSchedule={() => {
                setActiveTab('guide');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToRealEstate={() => {
                setActiveTab('realestate');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToAdvertise={() => {
                setActiveTab('advertise');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Network Pillars Quick Access Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <button
                onClick={() => setActiveTab('guide')}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-left transition-all hover:bg-slate-900 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Tv className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>24/7 TV Schedule</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Browse daily programming, primetime spotlights, and set broadcast reminders.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('realestate')}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-left transition-all hover:bg-slate-900 group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>Real Estate &amp; Land</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Commercial parcels, infill acreage, and urban acquisitions with Jeanell Land.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('scanner')}
                className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all hover:bg-slate-900 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>Media Title Cleaner</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Scanned raw uploads, title error corrections &amp; deduplicated videos.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('developer')}
                className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-500/60 text-left transition-all hover:bg-slate-900 group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>TV &amp; Mobile Dev Hub</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Apple iOS, Roku TV, Apple TV, Fire TV, and Android deployment links.
                </p>
              </button>
            </div>

            {/* Multi-Platform Showcase */}
            <div className="pt-6">
              <RokuPlatformHub />
            </div>

          </div>
        )}

        {/* Tab: TV Guide */}
        {activeTab === 'guide' && (
          <ProgramGuide onTuneIn={handleTuneIn} />
        )}

        {/* Tab: Real Estate & Land Brokerage */}
        {activeTab === 'realestate' && (
          <RealEstatePortal />
        )}

        {/* Tab: On Demand Library */}
        {activeTab === 'vod' && (
          <VodCatalog onWatchVideo={item => setActiveVod(item)} />
        )}

        {/* Tab: T.E.A.R.adio */}
        {activeTab === 'radio' && (
          <TearRadioBar />
        )}

        {/* Tab: Media Title Error Scanner & Deduplication Audit */}
        {activeTab === 'scanner' && (
          <MediaCorrectionCenter onWatchVideo={item => setActiveVod(item)} />
        )}

        {/* Tab: Multi-Device Developer Hub */}
        {activeTab === 'developer' && (
          <DeveloperPlatformsPortal />
        )}

        {/* Tab: Advertise */}
        {activeTab === 'advertise' && (
          <AdvertisePortal />
        )}

        {/* Tab: FAQ & Knowledge Base */}
        {activeTab === 'faq' && (
          <FaqPortal onSelectTab={setActiveTab} />
        )}

        {/* Tab: Studio CMS & Ingestion Suite */}
        {activeTab === 'studio' && (
          <TearsStudioCMS onSelectTab={setActiveTab} />
        )}

        {/* Tab: Patentable Innovations & Clean-Room IP Lab */}
        {activeTab === 'patent' && (
          <PatentInnovationPortal onSelectTab={setActiveTab} />
        )}

        {/* Tab: Creator Studio, Rights Clearance & Zero-Honeypot Compensation */}
        {activeTab === 'creators' && (
          <CreatorCompensationStudio onTuneIn={(ch) => {
            setCurrentChannelId(ch as any);
            setActiveTab('live');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        )}

        {/* Tab: Creator Tax Portal, 1099-NEC & Production Expense Ingestion */}
        {activeTab === 'taxes' && (
          <CreatorTaxPortal onNavigateToCreators={() => setActiveTab('creators')} />
        )}

        {/* Tab: Face Biometrics & Sovereign Government ID Verification */}
        {activeTab === 'biometrics' && (
          <BiometricIdVerificationPortal onVerificationComplete={() => {}} />
        )}

        {/* Tab: T.E.A.R.adio Music Distribution & DSP Launchpad (DistroKid / Spotify / Apple Music) */}
        {activeTab === 'music' && (
          <TearRadioMusicDistribution onTuneInToRadio={() => {
            setCurrentChannelId('tear-radio');
            setActiveTab('live');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        )}

        {/* Tab: T.E.A.R.S.afe Social Media App & Cross-App Sharing Hub (Facebook, Instagram, X, etc.) */}
        {activeTab === 'social' && (
          <TearSafeSocialHub 
            onTuneInToChannel={(ch) => {
              setCurrentChannelId(ch as any);
              setActiveTab('live');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToRealEstate={() => {
              setActiveTab('realestate');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToRadio={() => {
              setActiveTab('radio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Tab: PWA Offline Fallback Hub & Appointment Calendar */}
        {(activeTab === 'offline' || activeTab === 'calendar') && (
          <OfflineFallbackPage
            onSelectVod={item => setActiveVod(item)}
            onGoOnline={() => {
              setActiveTab('live');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReturnToLive={() => {
              setActiveTab('live');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

      </main>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectVod={item => setActiveVod(item)}
        onNavigateTab={tab => setActiveTab(tab)}
      />

      {/* Channel Settings Modal (matches Screenshot 8) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Video On Demand Player Modal */}
      {activeVod && (
        <VideoModal
          item={activeVod}
          onClose={() => setActiveVod(null)}
          onSelectAnother={item => setActiveVod(item)}
          relatedItems={VOD_ITEMS.filter(v => v.id !== activeVod.id)}
        />
      )}

      {/* Quiet, Professional Footer */}
      <Footer onSelectTab={setActiveTab} />

      {/* Offline Status Connectivity Alert */}
      <OfflineIndicator onOpenOfflineFallback={() => setActiveTab('offline')} />

    </div>
  );
}
