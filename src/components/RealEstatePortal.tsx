import React, { useState } from 'react';
import { REAL_ESTATE_LISTINGS } from '../data/mockData';
import { RealEstateListing, MetaverseTile } from '../types';
import { useMetaverseRealEstate } from '../hooks/useMetaverseRealEstate';
import { MetaverseRealEstateBoard } from './MetaverseRealEstateBoard';
import { PropertyVideoWithAdModal } from './PropertyVideoWithAdModal';
import { AgencyAgreementsModal } from './AgencyAgreementsModal';
import { MarketPropertySubmissionModal } from './MarketPropertySubmissionModal';
import { 
  Building2, MapPin, Layers, PhoneCall, ShieldCheck, CheckCircle2, 
  ChevronRight, X, Smartphone, Copy, Check, ExternalLink, Play, 
  Dices, Sparkles, FileText, Award, DollarSign, ArrowRight, Share2 
} from 'lucide-react';

export const RealEstatePortal: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'properties' | 'metaverse' | 'market-property' | 'agreements' | 'affiliates'>('properties');
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedVideoProperty, setSelectedVideoProperty] = useState<RealEstateListing | MetaverseTile | null>(null);
  const [isAgreementsModalOpen, setIsAgreementsModalOpen] = useState(false);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [isMetaverseGateOpen, setIsMetaverseGateOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAffiliateLink, setCopiedAffiliateLink] = useState(false);

  // Hook for Metaverse, Smart Cash, Agency Agreements, and User Submissions
  const {
    tiles,
    wallet,
    agreements,
    submissions,
    playerPosition,
    isRolling,
    dice,
    activeEventMessage,
    hasValidAgencyAgreement,
    signAgreement,
    submitPropertyToMarket,
    rollDice,
    upgradeProperty,
    completeRewardedAd,
    clearEventMessage
  } = useMetaverseRealEstate();

  const propertyTypes = ['All', 'Commercial Land', 'Mixed-Use Parcel', 'Industrial Flex', 'Residential Development'];

  const filteredListings = filterType === 'All'
    ? REAL_ESTATE_LISTINGS
    : REAL_ESTATE_LISTINGS.filter(l => l.type === filterType);

  const handleCopyAppCode = () => {
    navigator.clipboard?.writeText('AC8E6C053');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyAffiliate = () => {
    navigator.clipboard?.writeText(`https://tearschannel.online/realestate?ref=${wallet.referralCode}`);
    setCopiedAffiliateLink(true);
    setTimeout(() => setCopiedAffiliateLink(false), 2500);
  };

  // Guard for entering Metaverse Real Estate World
  const handleSelectMetaverseTab = () => {
    if (!hasValidAgencyAgreement) {
      setIsMetaverseGateOpen(true);
    } else {
      setActiveSubTab('metaverse');
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Editorial Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0a1829] to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/30">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>ALL YOUR NEEDS REALITY LLC · DESIGNATED BROKER JEANELL LAND</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>25% Co-Op Broker Affiliates &amp; Smart Cash</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            All Your Needs Reality LLC &amp; Metaverse Real Estate World
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Market real property, acquire generational Detroit commercial parcels, and step into the <strong>Metaverse Real Estate World</strong> directed by Licensed Broker Jeanell Land. View property walkthroughs with sponsor ads, roll dice on the Monopoly-style board, and execute binding Seller &amp; Buyer Agency Agreements.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
            <span>Brokerage: All Your Needs Reality LLC</span>
            <span>·</span>
            <span>Designated Broker: Jeanell Land (<a href="mailto:jeanell@tearschannel.online" className="text-amber-400 hover:underline">jeanell@tearschannel.online</a>)</span>
            <span>·</span>
            <span>Broadcasted on T.E.A.R.S. Channel TV</span>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mb-16" />
      </div>

      {/* Official MLS Mobile Real Estate App Banner (by Jeanell Land) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0c223d] via-slate-900 to-[#1e132b] border border-cyan-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Jeanell Land&#39;s Official MLS Mobile Real Estate App</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Search Detroit &amp; Nationwide MLS Listings on Mobile
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Download Broker Jeanell Land&#39;s MLS app directly. Enter access code <strong className="text-amber-400 font-mono">AC8E6C053</strong> to connect for exclusive commercial acreage, off-market opportunities, and direct broker support through All Your Needs Reality LLC.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 bg-black/60 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-300">
            <span className="text-slate-400 text-[11px]">Code:</span>
            <span className="text-amber-400 font-bold">AC8E6C053</span>
            <button
              onClick={handleCopyAppCode}
              className="p-1 hover:text-white transition-colors text-amber-400 cursor-pointer"
              title="Copy access code"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          {copiedCode && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Copied!
            </span>
          )}
          <a
            href="https://mls-client.com/AC8E6C053"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-lg transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5 hover:scale-105 cursor-pointer"
          >
            <span>Download Mobile App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Sub-Navigation Switcher (All Dimensions) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-900 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          
          <button
            onClick={() => setActiveSubTab('properties')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'properties'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Available Properties &amp; MLS ({filteredListings.length})</span>
          </button>

          <button
            onClick={handleSelectMetaverseTab}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'metaverse'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black shadow-md'
                : 'text-cyan-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>Metaverse Real Estate World (Monopoly GO)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('market-property')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'market-property'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Market Your Property (List with Broker)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('agreements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'agreements'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Agency Agreements ({agreements.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('affiliates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'affiliates'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                : 'text-emerald-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Smart Cash 25% Co-Op Affiliates</span>
          </button>

        </div>

        <div className="hidden xl:flex items-center gap-3 text-xs font-mono text-slate-400 px-3">
          <span>Smart Cash: ${wallet.totalEarningsUsd.toFixed(2)}</span>
          <span>·</span>
          <span>Dice Rolls: {wallet.diceRolls}/{wallet.maxDice}</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: AVAILABLE PROPERTIES & MLS (WITH VIDEO + AD ON CLICK) */}
      {/* ============================================================== */}
      {activeSubTab === 'properties' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              {propertyTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    filterType === t
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMarketModalOpen(true)}
                className="px-3.5 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono text-xs rounded-lg border border-amber-400/30 flex items-center gap-1.5 cursor-pointer"
              >
                <span>+ List Your Parcel</span>
              </button>
              <div className="text-xs text-slate-400 font-mono">
                Showing {filteredListings.length} Active Listings
              </div>
            </div>
          </div>

          {/* Listings Grid (Clicking any card opens Property Video + Sponsor Ad Modal) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredListings.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedVideoProperty(item)}
                className="group rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/60 transition-all overflow-hidden flex flex-col justify-between shadow-xl cursor-pointer"
              >
                {/* Visual Header / Video Trigger Area */}
                <div className="h-48 bg-gradient-to-br from-slate-950 via-[#0d1d2d] to-slate-900 p-5 relative flex flex-col justify-between border-b border-slate-800">
                  <div className="flex items-center justify-between text-xs z-10">
                    <span className="font-mono text-cyan-400 font-semibold">{item.type}</span>
                    <span className={`font-mono px-2 py-0.5 rounded text-[11px] font-semibold ${
                      item.status === 'Available' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Play Video Callout Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>

                  <div className="z-10 flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-extrabold text-white tracking-tight">
                        {item.price}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-amber-400" />
                          {item.size}
                        </span>
                        <span>·</span>
                        <span className="text-cyan-300">{item.zoning}</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-amber-300 bg-black/80 px-2 py-1 rounded border border-white/20">
                      Watch Video + Ad (+50c)
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.location}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Highlights List */}
                    <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-800/80">
                      {item.highlights.map((hl, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-amber-400 font-bold">✓</span>
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-400 font-mono">
                      <span>Brokerage: </span>
                      <span className="text-cyan-300 font-medium">All Your Needs Reality LLC</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideoProperty(item);
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl transition-transform hover:scale-105 flex items-center gap-1.5 whitespace-nowrap shadow-sm cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>View Video &amp; Ad</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* User Submitted Properties on Market */}
          {submissions.length > 0 && (
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Client Ingested Properties Marketed by All Your Needs Reality LLC ({submissions.length})</span>
                </h3>
                <span className="text-xs font-mono text-cyan-400">TV Broadcast &amp; MLS Active</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{sub.propertyAddress}</span>
                      <span className="font-mono text-amber-400 font-bold">{sub.askingPrice}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Owner: {sub.ownerName} · {sub.size} · {sub.zoning}
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {sub.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono border-t border-slate-800">
                      <span className="text-emerald-400">{sub.status}</span>
                      <span className="text-slate-500">Jeanell Land, Broker</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: METAVERSE REAL ESTATE WORLD (MONOPOLY GO + SMART CASH) */}
      {/* ============================================================== */}
      {activeSubTab === 'metaverse' && (
        <MetaverseRealEstateBoard
          tiles={tiles}
          wallet={wallet}
          playerPosition={playerPosition}
          isRolling={isRolling}
          dice={dice}
          activeEventMessage={activeEventMessage}
          onRollDice={rollDice}
          onUpgradeProperty={upgradeProperty}
          onOpenPropertyVideo={(tile) => setSelectedVideoProperty(tile)}
          onOpenAgreements={() => setIsAgreementsModalOpen(true)}
          onOpenMarketProperty={() => setIsMarketModalOpen(true)}
          onWatchAdForRolls={() => {
            completeRewardedAd('T.E.A.R.S. Channel Sponsor Commercial');
          }}
          onClearMessage={clearEventMessage}
        />
      )}

      {/* ============================================================== */}
      {/* SECTION 3: MARKET YOUR PROPERTY THROUGH ALL YOUR NEEDS REALITY */}
      {/* ============================================================== */}
      {activeSubTab === 'market-property' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Direct Brokerage Marketing Portal</span>
            </div>
            <h3 className="text-2xl font-black text-white">
              Market Your Commercial or Residential Land with Jeanell Land
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Submit your property to be listed with <strong>All Your Needs Reality LLC</strong>. Properties are featured on <strong>T.E.A.R.S. Channel 24/7 TV</strong>, Michigan MLS, and minted as interactive parcels inside the <strong>Metaverse Real Estate World</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <h4 className="text-xs font-mono font-bold text-white uppercase">1. 4K Drone Filming</h4>
              <p className="text-[11px] text-slate-400">
                Jeanell Land&#39;s aerial fleet records broadcast-ready site walk surveys for television.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <h4 className="text-xs font-mono font-bold text-white uppercase">2. MLS &amp; TV Distribution</h4>
              <p className="text-[11px] text-slate-400">
                Syndicated to millions of viewers on Roku TV, Apple TV, Fire TV, and commercial networks.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <h4 className="text-xs font-mono font-bold text-white uppercase">3. Metaverse Digital Twin</h4>
              <p className="text-[11px] text-slate-400">
                Minted on the Monopoly GO real estate board for interactive investor inspections and upgrades.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsMarketModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-sm rounded-2xl shadow-xl flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <Building2 className="w-5 h-5" />
              <span>Launch Property Intake Form (+500 Smart Cash Credits)</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 4: AGENCY AGREEMENTS (BUYER & SELLER) */}
      {/* ============================================================== */}
      {activeSubTab === 'agreements' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Legal Agency Representation Suite
              </div>
              <h3 className="text-xl font-black text-white">
                All Your Needs Reality LLC Agency Contracts
              </h3>
              <p className="text-xs text-slate-300">
                Review, sign, and download your <strong>Exclusive Right to Sell Listing Agreement</strong>, <strong>Exclusive Buyer Agency Agreement</strong>, and <strong>Broker Affiliate Co-Op Agreement</strong>.
              </p>
            </div>

            <button
              onClick={() => setIsAgreementsModalOpen(true)}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>Sign / Draft New Agreement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agreements.map((agr) => (
              <div
                key={agr.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-400/10 px-2.5 py-0.5 rounded border border-cyan-400/30">
                    {agr.type === 'exclusive_seller' ? 'Seller Agency' : agr.type === 'exclusive_buyer' ? 'Buyer Agency' : 'Affiliate Co-Op'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Active &amp; Legally Binding
                  </span>
                </div>

                <h4 className="font-extrabold text-white text-base">
                  {agr.title}
                </h4>

                <div className="space-y-1 text-xs text-slate-300 font-mono">
                  <div>Client: <strong>{agr.clientName}</strong> ({agr.clientEmail})</div>
                  <div>Brokerage: <strong>{agr.brokerageName}</strong></div>
                  <div>Designated Broker: <strong>{agr.brokerName}</strong></div>
                  <div className="text-amber-300 text-[11px] pt-1">{agr.commissionTerms}</div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Signed: {new Date(agr.signedAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(agr, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', `${agr.id}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Download Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 5: SMART CASH 25% CO-OP AFFILIATE PROGRAM */}
      {/* ============================================================== */}
      {activeSubTab === 'affiliates' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border-2 border-emerald-500/40 shadow-2xl space-y-4">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>ALL YOUR NEEDS REALITY LLC · REAL ESTATE CO-OP PROGRAM</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Earn 25% Broker Commission on Closed Real Estate Transactions
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Modeled after the high-reward loops of <strong>Smart Cash</strong> and <strong>Monopoly GO</strong> offerwalls. When you refer a land buyer, property seller, or commercial developer to Broker Jeanell Land, you receive an authorized <strong>25% Broker Co-Op Referral Commission</strong> upon successful closing of escrow!
              </p>
            </div>

            {/* Unique Link Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 max-w-xl">
              <div className="text-xs font-mono font-bold text-slate-300">
                Your Direct Co-Op Referral Link:
              </div>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2.5 font-mono text-xs text-amber-300">
                <span className="truncate flex-1">
                  https://tearschannel.online/realestate?ref={wallet.referralCode}
                </span>
                <button
                  onClick={handleCopyAffiliate}
                  className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-lg text-xs cursor-pointer shrink-0"
                >
                  {copiedAffiliateLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>

          {/* Stats & Earnings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-slate-400">Total Referrals Under Review</div>
              <div className="text-2xl font-black text-white font-mono">{wallet.referredCount} Inquiries</div>
              <div className="text-[11px] text-emerald-400 font-mono">2 Commercial Due Diligence Active</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-slate-400">Pending 25% Co-Op Commissions</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">${wallet.pendingCommissionsUsd.toFixed(2)}</div>
              <div className="text-[11px] text-slate-400 font-mono">Disbursed by Title Company at Closing</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-slate-400">Smart Cash Balance</div>
              <div className="text-2xl font-black text-amber-400 font-mono">${wallet.totalEarningsUsd.toFixed(2)}</div>
              <div className="text-[11px] text-amber-300 font-mono">Redeemable for Closing Vouchers</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODALS */}
      {/* ============================================================== */}
      
      {/* 1. Property Video + Sponsor Ad Modal (Triggered on Property Click) */}
      {selectedVideoProperty && (
        <PropertyVideoWithAdModal
          property={selectedVideoProperty}
          isOpen={!!selectedVideoProperty}
          onClose={() => setSelectedVideoProperty(null)}
          onRewardClaimed={(title) => {
            completeRewardedAd(title);
          }}
          onNavigateToAgreements={() => {
            setActiveSubTab('agreements');
            setIsAgreementsModalOpen(true);
          }}
          onNavigateToAffiliates={() => {
            setActiveSubTab('affiliates');
          }}
        />
      )}

      {/* 2. Agency Agreements Modal (Buyer & Seller Agency) */}
      <AgencyAgreementsModal
        isOpen={isAgreementsModalOpen || isMetaverseGateOpen}
        onClose={() => {
          setIsAgreementsModalOpen(false);
          setIsMetaverseGateOpen(false);
        }}
        agreements={agreements}
        onSignAgreement={signAgreement}
        requiredForMetaverseEntry={isMetaverseGateOpen}
        onEnterMetaverse={() => {
          setActiveSubTab('metaverse');
        }}
      />

      {/* 3. Market Property Submission Modal (List with All Your Needs Reality LLC) */}
      <MarketPropertySubmissionModal
        isOpen={isMarketModalOpen}
        onClose={() => setIsMarketModalOpen(false)}
        onSubmitProperty={submitPropertyToMarket}
        onNavigateToAgreements={() => {
          setActiveSubTab('agreements');
          setIsAgreementsModalOpen(true);
        }}
      />

    </div>
  );
};
