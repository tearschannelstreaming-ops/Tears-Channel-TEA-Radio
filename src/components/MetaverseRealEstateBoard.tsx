import React, { useState } from 'react';
import { 
  MetaverseTile, 
  SmartCashWallet 
} from '../types';
import { 
  Dices, Sparkles, Building2, Gift, ShieldCheck, Play, 
  Award, ArrowUpRight, TrendingUp, RefreshCw, Zap, 
  Crown, Star, MapPin, Tv, DollarSign, ChevronRight,
  Share2, Copy, Check, Info
} from 'lucide-react';

interface MetaverseRealEstateBoardProps {
  tiles: MetaverseTile[];
  wallet: SmartCashWallet;
  playerPosition: number;
  isRolling: boolean;
  dice: [number, number];
  activeEventMessage: string | null;
  onRollDice: () => void;
  onUpgradeProperty: (tileId: string) => boolean;
  onOpenPropertyVideo: (tile: MetaverseTile) => void;
  onOpenAgreements: () => void;
  onOpenMarketProperty: () => void;
  onWatchAdForRolls: () => void;
  onClearMessage: () => void;
}

export const MetaverseRealEstateBoard: React.FC<MetaverseRealEstateBoardProps> = ({
  tiles,
  wallet,
  playerPosition,
  isRolling,
  dice,
  activeEventMessage,
  onRollDice,
  onUpgradeProperty,
  onOpenPropertyVideo,
  onOpenAgreements,
  onOpenMarketProperty,
  onWatchAdForRolls,
  onClearMessage
}) => {
  const [copiedAffiliate, setCopiedAffiliate] = useState(false);
  const [cashoutSuccess, setCashoutSuccess] = useState(false);

  const currentTile = tiles[playerPosition] || tiles[0];

  const handleCopyAffiliate = () => {
    navigator.clipboard?.writeText(`https://tearschannel.online/realestate?ref=${wallet.referralCode}`);
    setCopiedAffiliate(true);
    setTimeout(() => setCopiedAffiliate(false), 2500);
  };

  const handleCashoutVoucher = () => {
    setCashoutSuccess(true);
    setTimeout(() => setCashoutSuccess(false), 3500);
  };

  const getUpgradeCost = (level: number) => {
    const costs = [150, 350, 750, 1500];
    return costs[level] || 500;
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0: return 'Raw Infill Land';
      case 1: return 'Rezoning Approved';
      case 2: return 'Blueprint Architecture';
      case 3: return 'Commercial High-Rise';
      default: return 'Developed';
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Smart Cash & Monopoly GO Stats Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0b1b2d] via-slate-900 to-[#1f102b] border border-amber-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Wallet Balances */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-amber-400" />
              <span>Smart Cash Balance</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              ${wallet.totalEarningsUsd.toFixed(2)}
              <span className="text-xs text-slate-400 font-normal ml-1">({wallet.credits} Credits)</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          <div className="space-y-0.5">
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Dices className="w-3 h-3 text-cyan-400" />
              <span>Monopoly Dice Energy</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-1.5">
              <span>{wallet.diceRolls}</span>
              <span className="text-xs text-slate-500 font-normal">/ {wallet.maxDice}</span>
              {wallet.diceRolls < wallet.maxDice && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  +1/min
                </span>
              )}
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          <div className="space-y-0.5">
            <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3 h-3 text-purple-400" />
              <span>Broker Tier</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
              <span>{wallet.affiliateTier}</span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-500/30">
                25% Co-Op
              </span>
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onWatchAdForRolls}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
            title="Watch a 15-second sponsor commercial to get +5 free dice rolls"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Watch Ad (+5 Dice)</span>
          </button>

          <button
            onClick={onOpenMarketProperty}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Market Your Property</span>
          </button>

          <button
            onClick={onOpenAgreements}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Agency Agreements</span>
          </button>
        </div>

      </div>

      {/* Dynamic Event / Notification Banner */}
      {activeEventMessage && (
        <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-amber-400 text-amber-300 text-xs font-mono flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span>{activeEventMessage}</span>
          </div>
          <button
            onClick={onClearMessage}
            className="text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* THE 16-TILE METAVERSE REAL ESTATE BOARD */}
      {/* ============================================================== */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Header inside Board */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              METAVERSE COMMERCIAL REAL ESTATE BOARD · ALL YOUR NEEDS REALITY LLC
            </div>
            <h3 className="text-xl font-black text-white">
              Detroit Commercial Districts &amp; Urban Equity Grid
            </h3>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span>Laps: {wallet.lapsCompleted}</span>
            <span>·</span>
            <span className="text-amber-400">Broker: Jeanell Land</span>
          </div>
        </div>

        {/* 16-Tile Perimeter Layout Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3">
          {tiles.map((tile, idx) => {
            const isCurrent = playerPosition === idx;
            const upgradeCost = getUpgradeCost(tile.upgradeLevel);
            const canAffordUpgrade = wallet.credits >= upgradeCost && tile.upgradeLevel < 3;

            return (
              <div
                key={tile.id}
                onClick={() => onOpenPropertyVideo(tile)}
                className={`group relative rounded-2xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] select-none ${
                  isCurrent 
                    ? 'ring-4 ring-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)] border-amber-400 bg-slate-900' 
                    : tile.ownedByPlayer
                    ? 'border-emerald-500/50 bg-slate-900/90 hover:border-emerald-400'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Active Player Medallion Token Overlay */}
                {isCurrent && (
                  <div className="absolute -top-3 -right-2 z-20 flex items-center gap-1 bg-amber-400 text-black font-extrabold text-[10px] font-mono px-2 py-0.5 rounded-full shadow-lg border border-black animate-bounce">
                    <span>YOU ARE HERE</span>
                  </div>
                )}

                {/* Tile Header Color Strip */}
                <div className="space-y-1">
                  <div className={`h-2 w-full rounded-full bg-gradient-to-r ${tile.color}`} />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Tile #{idx}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-400">
                      {tile.priceFormatted}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-white text-xs leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {tile.title}
                  </h4>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {tile.district}
                  </div>
                </div>

                {/* Tile Bottom Details & Upgrade Star Indicators */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Rent: ${tile.currentRent}/lap</span>
                    <span className="text-cyan-400 flex items-center gap-0.5">
                      <Play className="w-2.5 h-2.5" />
                      <span>Video+Ad</span>
                    </span>
                  </div>

                  {tile.type === 'property' && (
                    <div className="flex items-center justify-between pt-1">
                      {/* Level Stars */}
                      <div className="flex items-center gap-0.5">
                        {[0, 1, 2].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s < tile.upgradeLevel
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Quick Upgrade Button */}
                      {tile.upgradeLevel < 3 ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpgradeProperty(tile.id);
                          }}
                          disabled={!canAffordUpgrade}
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded transition-colors ${
                            canAffordUpgrade
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400 hover:text-black'
                              : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                          }`}
                          title={`Upgrade parcel to next tier (${upgradeCost} credits)`}
                        >
                          Lvl {tile.upgradeLevel + 1} (${upgradeCost}c)
                        </button>
                      ) : (
                        <span className="text-[9px] font-mono text-emerald-400 font-bold">MAX HIGH-RISE</span>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Central Monopoly GO! Roll & Interactive Stage */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-black to-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Active Landed Tile Summary */}
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border-2 border-amber-400 flex items-center justify-center text-amber-400 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                Current Position: Tile #{playerPosition}
              </div>
              <h4 className="text-base sm:text-lg font-black text-white">
                {currentTile.title}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-1">
                {currentTile.description}
              </p>
              <div className="pt-1 flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span>Tier: <strong className="text-cyan-300">{getLevelLabel(currentTile.upgradeLevel)}</strong></span>
                <span>·</span>
                <span>Rent: <strong className="text-emerald-400">${currentTile.currentRent} Smart Cash</strong></span>
              </div>
            </div>
          </div>

          {/* Dice Rolling Controls & Dice Display */}
          <div className="flex items-center gap-4 shrink-0">
            {/* 3D Dice Display Box */}
            <div className="flex items-center gap-2">
              <div className={`w-12 h-12 rounded-2xl bg-white text-black font-black text-xl flex items-center justify-center shadow-2xl border-2 border-slate-300 transition-transform ${isRolling ? 'animate-spin scale-110' : ''}`}>
                {dice[0]}
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-amber-400 text-black font-black text-xl flex items-center justify-center shadow-2xl border-2 border-amber-300 transition-transform ${isRolling ? 'animate-spin scale-110' : ''}`}>
                {dice[1]}
              </div>
            </div>

            {/* Roll Dice Action Button */}
            <button
              onClick={onRollDice}
              disabled={isRolling || wallet.diceRolls <= 0}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black text-sm uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'Rolling...' : `Roll Dice (${wallet.diceRolls})`}</span>
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* SMART CASH AFFILIATE & REWARDS SUITE (MIMICS SMART CASH & MONOPOLY GO) */}
      {/* ============================================================== */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Cash Affiliate &amp; Broker Co-Op Engine</span>
            </div>
            <h3 className="text-lg font-black text-white">
              Earn 25% Co-Op Commission on Closed Real Estate Deals
            </h3>
          </div>

          <div className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/30 self-start sm:self-auto">
            Authorized by All Your Needs Reality LLC
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Unique Referral Link */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Your Unique Referral Link</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Share your verified broker co-op link. Anyone who purchases or lists land earns you a 25% broker referral fee upon closing.
            </p>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 font-mono text-xs text-amber-300">
              <span className="truncate flex-1">
                tearschannel.online/re?ref={wallet.referralCode}
              </span>
              <button
                onClick={handleCopyAffiliate}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Copy link"
              >
                {copiedAffiliate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {copiedAffiliate && (
              <span className="text-[10px] font-mono text-emerald-400">
                Link copied to clipboard!
              </span>
            )}
          </div>

          {/* Card 2: Commission Tracking */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pending Co-Op Commissions</span>
            </h4>
            <div className="space-y-1">
              <div className="text-2xl font-black text-emerald-400 font-mono">
                ${wallet.pendingCommissionsUsd.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400">
                From {wallet.referredCount} active land inquiries under contract with Broker Jeanell Land.
              </div>
            </div>
            <div className="pt-2 text-[10px] font-mono text-slate-500 border-t border-slate-800/80">
              Disbursed via Escrow wire or Michigan Title upon closing.
            </div>
          </div>

          {/* Card 3: Reward Cash Out / Vouchers */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Redeem Smart Cash Vouchers</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Convert your Smart Cash credits directly into closing cost vouchers or TV airtime spotlights.
            </p>
            <button
              onClick={handleCashoutVoucher}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Redeem $100 Closing Voucher</span>
            </button>
            {cashoutSuccess && (
              <span className="text-[10px] font-mono text-emerald-400 block text-center">
                ✓ Voucher minted and credited to All Your Needs Reality client file!
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
