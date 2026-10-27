import React, { useState, useEffect } from 'react';
import { 
  X, Play, Pause, Volume2, VolumeX, Sparkles, CheckCircle2, 
  Clock, MapPin, Building2, ShieldCheck, DollarSign, ArrowRight, 
  ExternalLink, Share2, Award, Tv, Film, Gift
} from 'lucide-react';
import { RealEstateListing, MetaverseTile } from '../types';

interface PropertyVideoWithAdModalProps {
  property: RealEstateListing | MetaverseTile;
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed?: (propertyTitle: string) => void;
  onNavigateToAgreements?: () => void;
  onNavigateToAffiliates?: () => void;
}

export const PropertyVideoWithAdModal: React.FC<PropertyVideoWithAdModalProps> = ({
  property,
  isOpen,
  onClose,
  onRewardClaimed,
  onNavigateToAgreements,
  onNavigateToAffiliates
}) => {
  const [phase, setPhase] = useState<'ad' | 'property'>('ad');
  const [adCountdown, setAdCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  // Derive unified property attributes whether passing RealEstateListing or MetaverseTile
  const title = property.title;
  const location = 'location' in property ? property.location : property.district;
  const price = 'price' in property ? property.price : property.priceFormatted;
  const size = 'size' in property ? property.size : 'Prime Metro Acreage';
  const zoning = 'zoning' in property ? property.zoning : 'Commercial Development';
  const description = property.description;

  // Reset states on modal open
  useEffect(() => {
    if (isOpen) {
      setPhase('ad');
      setAdCountdown(5);
      setCanSkip(false);
      setIsPlaying(true);
      setRewardClaimed(false);
      setInquirySent(false);
    }
  }, [isOpen, property]);

  // Ad countdown timer
  useEffect(() => {
    if (!isOpen || phase !== 'ad') return;

    if (adCountdown > 0) {
      const timer = setTimeout(() => {
        setAdCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanSkip(true);
    }
  }, [isOpen, phase, adCountdown]);

  if (!isOpen) return null;

  const handleSkipOrCompleteAd = () => {
    if (!rewardClaimed) {
      setRewardClaimed(true);
      if (onRewardClaimed) {
        onRewardClaimed(title);
      }
    }
    setPhase('property');
  };

  const handleSendOfferInquiry = () => {
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col text-left">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
              {phase === 'ad' ? <Tv className="w-5 h-5 animate-pulse" /> : <Film className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  {phase === 'ad' ? 'Sponsored Commercial Video' : '4K Aerial Drone & Parcel Walkthrough'}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-[11px] font-mono text-slate-400">All Your Needs Reality LLC</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white line-clamp-1">
                {title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Close video viewer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* VIDEO DISPLAY STAGE (STAGE 1: AD -> STAGE 2: PROPERTY CLIP) */}
        {/* ============================================================== */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden border-b border-slate-800 select-none">
          
          {phase === 'ad' ? (
            /* STAGE 1: SPONSORED COMMERCIAL AD */
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-amber-950/60 flex flex-col justify-between p-4 sm:p-6">
              
              {/* Ad Brand Banner */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md border border-amber-400/40 rounded-full px-3 py-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">
                    Sponsor Ad: All Your Needs Reality &amp; Smart Cash
                  </span>
                </div>

                <div className="text-xs font-mono font-bold text-slate-300 bg-black/80 px-2.5 py-1 rounded-md border border-slate-800">
                  {adCountdown > 0 ? `Skip in ${adCountdown}s` : 'Reward Ready'}
                </div>
              </div>

              {/* Central Commercial Pitch Graphic */}
              <div className="text-center space-y-3 max-w-lg mx-auto z-10 my-auto">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border-2 border-amber-400 mx-auto flex items-center justify-center text-amber-400 shadow-xl">
                  <Building2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                  All Your Needs Reality LLC
                </h4>
                <p className="text-xs sm:text-sm text-amber-200/90 font-medium leading-relaxed">
                  Jeanell Land, Broker — Direct MLS representation, prime commercial assemblages, and 25% Co-Op referral affiliate rewards for licensed partners and viewers.
                </p>
                <div className="inline-flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Reward: +50 Smart Cash Credits &amp; +5 Free Dice Rolls</span>
                </div>
              </div>

              {/* Bottom Ad Action Bar */}
              <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10">
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>Commercial Sponsor Active (1080p Broadcast)</span>
                </div>

                <button
                  onClick={handleSkipOrCompleteAd}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                    canSkip
                      ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg scale-105'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>{canSkip ? 'Claim +50 Credits & View Property Video' : `Skip Ad (${adCountdown}s)`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Ambient visual glow */}
              <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 pointer-events-none" />
            </div>
          ) : (
            /* STAGE 2: 4K PROPERTY DRONE & AERIAL WALKTHROUGH */
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-cyan-950/40 to-slate-950 flex flex-col justify-between p-4 sm:p-6">
              
              {/* Top Video HUD */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md border border-cyan-400/40 rounded-full px-3 py-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono font-bold text-cyan-300">
                    4K DRONE TOUR · JEANELLEDETROIT AERIAL FLEET
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-lg bg-black/70 hover:bg-black text-slate-300 hover:text-white border border-white/10"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-lg bg-black/70 hover:bg-black text-slate-300 hover:text-white border border-white/10"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Center Play Indicator */}
              <div className="text-center space-y-2 z-10 my-auto">
                <div className="w-16 h-16 rounded-full bg-amber-400/90 text-black flex items-center justify-center mx-auto shadow-2xl transition-transform hover:scale-110 cursor-pointer">
                  <Play className="w-7 h-7 fill-black ml-1" />
                </div>
                <div className="text-xs font-mono font-bold text-white bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 inline-block">
                  4K Drone Flight Active · {title}
                </div>
              </div>

              {/* Bottom Video Progress Scrubber */}
              <div className="z-10 space-y-1.5 pt-2">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 w-2/5 animate-pulse" />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>01:24</span>
                  <span>03:45 (Site Survey &amp; Topography)</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ============================================================== */}
        {/* PROPERTY DOSSIER & BROKERAGE SPECIFICATIONS */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          
          {/* Reward Earned Toast (Monopoly GO / Smart Cash confirmation) */}
          {rewardClaimed && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Smart Cash Reward Claimed: +50 Credits &amp; +5 Dice Rolls Added to Wallet!</span>
              </div>
              <span className="font-bold text-amber-300">Monopoly GO! Loop Synced</span>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">Asking Price</div>
              <div className="text-lg sm:text-xl font-black text-amber-400 font-mono">{price}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">Parcel Size / Acreage</div>
              <div className="text-sm sm:text-base font-extrabold text-white">{size}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">Zoning Designation</div>
              <div className="text-sm sm:text-base font-extrabold text-cyan-300">{zoning}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">Listing Brokerage</div>
              <div className="text-xs sm:text-sm font-extrabold text-white line-clamp-1">All Your Needs Reality LLC</div>
            </div>
          </div>

          {/* Description & Location */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{location}</span>
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Brokerage Representation Notice (All Your Needs Reality LLC / Jeanell Land) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0e1a2f] to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Brokered by Jeanell Land, Licensed Broker</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">All Your Needs Reality LLC</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Full fiduciary agency agreements (Exclusive Right to Sell &amp; Exclusive Buyer Agency) protect all buyers and sellers entering the real estate and metaverse market.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onNavigateToAgreements && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToAgreements();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  Agency Agreements →
                </button>
              )}
            </div>
          </div>

          {/* Inquiry / Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSendOfferInquiry}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" />
                <span>Submit Purchase Offer / Inquire</span>
              </button>

              {onNavigateToAffiliates && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToAffiliates();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs border border-amber-400/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>25% Co-Op Referral Affiliate</span>
                </button>
              )}
            </div>

            {inquirySent && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Inquiry transmitted to Broker Jeanell Land!</span>
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
