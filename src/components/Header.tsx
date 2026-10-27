import React, { useState } from 'react';
import { Tv, Radio, Search, Settings, Code2, Sparkles, Megaphone, Heart, HelpCircle, UploadCloud, Award, DollarSign, Menu, X, Shield, FileText, Calculator, Disc, UserCheck, Share2, Calendar } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch,
  onOpenSettings
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectMobileTab = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark with Official Silver Medallion Logo Filling Circle */}
        <button 
          onClick={() => setActiveTab('live')}
          className="text-left group flex items-center gap-2.5 whitespace-nowrap shrink-0"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-300 shadow-md shadow-amber-500/10 flex items-center justify-center bg-slate-900 shrink-0">
            <img
              src="/app-media/app_logo.jpg"
              alt="T.E.A.R.S. Channel Logo"
              className="w-full h-full object-cover scale-[1.46] transition-transform group-hover:scale-[1.54]"
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
            T.E.A.R.S.<span className="text-amber-400 font-bold ml-1.5">CHANNEL</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-4 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('live')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'live'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            Live Broadcast
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'guide'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            TV Guide
          </button>
          <button
            onClick={() => setActiveTab('realestate')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'realestate'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            Real Estate &amp; Land
          </button>
          <button
            onClick={() => setActiveTab('vod')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'vod'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            On Demand
          </button>
          <button
            onClick={() => setActiveTab('radio')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'radio'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span>T.E.A.R.adio</span>
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'scanner'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white text-emerald-400'
            }`}
            title="Channel Title Scanner &amp; Deduplication"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Media Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('developer')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'developer'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white text-cyan-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dev Hub</span>
          </button>
          <button
            onClick={() => setActiveTab('advertise')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'advertise'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            Advertise
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'faq'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>FAQ</span>
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg border flex items-center gap-1.5 ${
              activeTab === 'studio'
                ? 'bg-amber-400 text-black font-extrabold border-amber-400 shadow-sm'
                : 'text-amber-300 border-amber-400/40 hover:bg-amber-400/10'
            }`}
            title="T.E.A.R.S. Studio CMS & Ingestion Suite"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Studio CMS</span>
          </button>
          <button
            onClick={() => setActiveTab('patent')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg border flex items-center gap-1.5 ${
              activeTab === 'patent'
                ? 'bg-cyan-400 text-black font-extrabold border-cyan-400 shadow-sm'
                : 'text-cyan-300 border-cyan-400/40 hover:bg-cyan-400/10'
            }`}
            title="T.E.A.R.S. Proprietary Patent Architecture & Clean-Room IP"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Patent &amp; IP</span>
          </button>
          <button
            onClick={() => setActiveTab('creators')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg border flex items-center gap-1.5 ${
              activeTab === 'creators'
                ? 'bg-red-600 text-white font-extrabold border-red-500 shadow-sm'
                : 'text-red-400 border-red-500/40 hover:bg-red-500/10'
            }`}
            title="Creator Studio: Upload, Rights Clearance & Zero-Honeypot Monetization"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Creators</span>
          </button>
          <button
            onClick={() => setActiveTab('taxes')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg border flex items-center gap-1.5 ${
              activeTab === 'taxes'
                ? 'bg-emerald-400 text-black font-extrabold border-emerald-400 shadow-sm'
                : 'text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10'
            }`}
            title="Creator Tax Portal: IRS Form 1099-NEC & Filming Cost Deductions"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Taxes &amp; Expenses</span>
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg border flex items-center gap-1.5 ${
              activeTab === 'music'
                ? 'bg-purple-600 text-white font-extrabold border-purple-500 shadow-sm'
                : 'text-purple-300 border-purple-500/40 hover:bg-purple-500/10'
            }`}
            title="Music Distribution: DistroKid / Spotify / Apple Music & T.E.A.R.adio Airplay"
          >
            <Disc className="w-3.5 h-3.5 text-purple-400" />
            <span>Music Distro</span>
          </button>
          <button
            onClick={() => setActiveTab('biometrics')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg border flex items-center gap-1.5 ${
              activeTab === 'biometrics'
                ? 'bg-cyan-500 text-black font-extrabold border-cyan-400 shadow-sm'
                : 'text-cyan-300 border-cyan-400/40 hover:bg-cyan-400/10'
            }`}
            title="Face Biometrics & Government ID Sovereign Verification"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Biometric ID</span>
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg border flex items-center gap-1.5 ${
              activeTab === 'social' || activeTab === 'safe'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white font-extrabold border-amber-400 shadow-md'
                : 'text-amber-300 border-amber-500/40 hover:bg-amber-400/10'
            }`}
            title="T.E.A.R.S.afe: Cross-App Sharing to Facebook, Instagram, Twitter/X & Community Feed"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>T.E.A.R.S.afe</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg border flex items-center gap-1.5 ${
              activeTab === 'calendar' || activeTab === 'offline'
                ? 'bg-purple-600 text-white font-extrabold border-purple-400 shadow-md'
                : 'text-purple-300 border-purple-500/40 hover:bg-purple-400/10'
            }`}
            title="Appointment Protection Calendar & PWA Offline VOD Fallback Hub"
          >
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Calendar &amp; Offline</span>
          </button>
        </nav>

        {/* Zone 3: Search + Settings Gear + Petition Action + Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="https://c.org/nx2fdzbjB7"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all whitespace-nowrap shadow-sm shadow-red-600/30 hover:scale-105"
            title="Sign Family Reunite Act Petition by Founder Jeanell Land on Change.org"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-white" />
            <span>Family Reunite Act</span>
          </a>

          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            title="Search network content"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <PWAInstallButton />

          <button
            onClick={() => setActiveTab('developer')}
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-400/20"
          >
            App Store &amp; TV Links
          </button>

          {/* Mobile / Tablet Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile / Tablet Expandable Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0c121e] border-b border-slate-800 px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleSelectMobileTab('live')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'live' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Tv className="w-4 h-4 text-red-500" />
              <span>Live Broadcast</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('guide')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'guide' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Tv className="w-4 h-4 text-amber-400" />
              <span>TV Guide</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('creators')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'creators' ? 'bg-red-600 text-white' : 'bg-red-950/40 text-red-300 border border-red-500/40'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Creator Studio</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('taxes')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'taxes' ? 'bg-emerald-400 text-black' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Tax &amp; Expenses</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('music')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'music' ? 'bg-purple-600 text-white' : 'bg-purple-950/40 text-purple-300 border border-purple-500/40'
              }`}
            >
              <Disc className="w-4 h-4 text-purple-400" />
              <span>Music Distro</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('biometrics')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'biometrics' ? 'bg-cyan-500 text-black' : 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Biometric ID</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('social')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'social' || activeTab === 'safe'
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white font-black'
                  : 'bg-red-950/40 text-amber-300 border border-amber-500/40'
              }`}
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>T.E.A.R.S.afe (Share)</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('calendar')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'calendar' || activeTab === 'offline' ? 'bg-purple-600 text-white font-extrabold' : 'bg-purple-950/40 text-purple-300 border border-purple-500/40'
              }`}
            >
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Calendar &amp; Offline Hub</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('developer')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'developer' ? 'bg-cyan-500 text-black' : 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Dev &amp; TV Hub</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('realestate')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'realestate' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>🏢 Real Estate</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('vod')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'vod' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>🎬 On Demand</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('radio')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'radio' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Radio className="w-4 h-4 text-purple-400" />
              <span>T.E.A.R.adio</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('studio')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'studio' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-amber-400" />
              <span>Studio CMS</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('patent')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'patent' ? 'bg-cyan-400 text-black' : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Patent &amp; IP</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('scanner')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'scanner' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Media Audit</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('advertise')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'advertise' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Megaphone className="w-4 h-4 text-amber-400" />
              <span>Advertise</span>
            </button>

            <button
              onClick={() => handleSelectMobileTab('faq')}
              className={`p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                activeTab === 'faq' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>FAQ</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-emerald-400">● Sovereign Network Active</span>
            <a
              href="https://c.org/nx2fdzbjB7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 font-bold"
            >
              ✍️ Family Reunite Act Petition
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
