import React, { useState } from 'react';
import { useTearSafeSocialStore } from '../hooks/useTearSafeSocialStore';
import { SharePayload, SocialPlatform } from '../types';
import { 
  X, Share2, Copy, Check, ExternalLink, Sparkles, 
  Send, MessageCircle, Globe, ShieldCheck, Download
} from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: SharePayload;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  payload
}) => {
  const { shareToPlatform, shareNative, buildShareContent } = useTearSafeSocialStore();
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'platforms' | 'storyCard'>('platforms');

  if (!isOpen) return null;

  const shareData = buildShareContent(payload);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShare = async (platform: SocialPlatform) => {
    const res = await shareToPlatform(platform, payload);
    if (res.note) {
      setNotification(res.note);
      setTimeout(() => setNotification(null), 4000);
    } else {
      setNotification(`Opening ${platform} share window...`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleNativeShare = async () => {
    const success = await shareNative(payload);
    if (success) {
      setNotification('Shared successfully via native device sheet!');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0f172a] border-2 border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-5 text-left text-white max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Share2 className="w-5 h-5 text-black font-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>T.E.A.R.S.afe Inter-App Bridge</span>
              </div>
              <h3 className="text-lg font-black text-white">Share Between Apps</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Content Item Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md font-bold">
            {payload.category || 'Broadcast Media'}
          </span>
          <h4 className="text-sm font-bold text-white line-clamp-1">{payload.title}</h4>
          <p className="text-xs text-slate-400 line-clamp-2">{payload.text}</p>
        </div>

        {/* Tab Switcher: 1-Click Social Apps vs Story Card */}
        <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('platforms')}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              activeTab === 'platforms' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Click Social Apps
          </button>
          <button
            onClick={() => setActiveTab('storyCard')}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              activeTab === 'storyCard' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Instagram Story Visual Card
          </button>
        </div>

        {activeTab === 'platforms' ? (
          <div className="space-y-4">
            {/* Primary Platform Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              
              {/* T.E.A.R.S.afe Companion App */}
              <button
                onClick={() => handleShare('T.E.A.R.S.afe')}
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 via-red-600/20 to-purple-900/30 border border-amber-500/50 hover:border-amber-400 text-left transition-all hover:scale-[1.02] group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-black font-black flex items-center justify-center text-xs mb-2">
                  SAFE
                </div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">T.E.A.R.S.afe</div>
                <div className="text-[10px] text-amber-300/80 font-mono">My Social Media App</div>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleShare('Facebook')}
                className="p-3 rounded-2xl bg-[#1877F2]/15 border border-[#1877F2]/40 hover:border-[#1877F2] text-left transition-all hover:scale-[1.02] group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#1877F2] text-white font-bold flex items-center justify-center text-sm mb-2">
                  f
                </div>
                <div className="text-xs font-bold text-white group-hover:text-blue-300">Facebook</div>
                <div className="text-[10px] text-slate-400">Feed &amp; Groups</div>
              </button>

              {/* Instagram */}
              <button
                onClick={() => handleShare('Instagram')}
                className="p-3 rounded-2xl bg-gradient-to-tr from-yellow-500/10 via-pink-500/20 to-purple-600/20 border border-pink-500/40 hover:border-pink-400 text-left transition-all hover:scale-[1.02] group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                  IG
                </div>
                <div className="text-xs font-bold text-white group-hover:text-pink-300">Instagram</div>
                <div className="text-[10px] text-slate-400">Story &amp; Feed Clip</div>
              </button>

              {/* X / Twitter */}
              <button
                onClick={() => handleShare('X (Twitter)')}
                className="p-3 rounded-2xl bg-white/5 border border-slate-700 hover:border-slate-500 text-left transition-all hover:scale-[1.02] group"
              >
                <div className="w-8 h-8 rounded-xl bg-black text-white font-bold border border-slate-800 flex items-center justify-center text-xs mb-2">
                  𝕏
                </div>
                <div className="text-xs font-bold text-white group-hover:text-slate-200">X (Twitter)</div>
                <div className="text-[10px] text-slate-400">Instant Tweet</div>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => handleShare('WhatsApp')}
                className="p-3 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/40 hover:border-[#25D366] text-left transition-all hover:scale-[1.02] group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#25D366] text-black font-bold flex items-center justify-center text-xs mb-2">
                  <MessageCircle className="w-4 h-4 fill-black" />
                </div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300">WhatsApp</div>
                <div className="text-[10px] text-slate-400">Direct &amp; Status</div>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare('LinkedIn')}
                className="p-3 rounded-2xl bg-[#0A66C2]/15 border border-[#0A66C2]/40 hover:border-[#0A66C2] text-left transition-all hover:scale-[1.02] group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0A66C2] text-white font-bold flex items-center justify-center text-xs mb-2">
                  in
                </div>
                <div className="text-xs font-bold text-white group-hover:text-blue-300">LinkedIn</div>
                <div className="text-[10px] text-slate-400">Professional Feed</div>
              </button>
            </div>

            {/* Native Mobile Share Button */}
            <button
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-transform active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Open Native Mobile Share Sheet (AirDrop / Messages / Apps)</span>
            </button>

            {/* Direct URL copy bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                readOnly
                value={shareData.url}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Instagram Story Card Visual Studio */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/60 via-slate-900 to-amber-950/40 border border-amber-500/40 text-center relative overflow-hidden">
              <div className="max-w-xs mx-auto space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>T.E.A.R.S. Channel · Official Broadcast</span>
                </div>
                
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {payload.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-3">
                  {payload.text}
                </p>

                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-mono text-amber-300">
                  <span>📱 tearschannel.online</span>
                  <span>·</span>
                  <span>🛡️ T.E.A.R.S.afe</span>
                </div>

                <div className="p-2 bg-black/40 rounded-xl border border-slate-700/60 inline-block">
                  <div className="text-[10px] font-mono text-slate-400">Scan or Tap to Tune In</div>
                  <div className="w-24 h-24 mx-auto mt-1 rounded bg-white p-1 flex items-center justify-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(shareData.url)}`}
                      alt="Share QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(shareData.fullMessage);
                  setNotification('Instagram Story caption copied! Open Instagram to paste.');
                  setTimeout(() => setNotification(null), 3500);
                  window.open('https://www.instagram.com/', '_blank');
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold flex items-center justify-center gap-2 transition-opacity"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Story Caption &amp; Open IG</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Zero-Honeypot Privacy Note */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Data-Broker Honeypot</span>
          </span>
          <span className="text-slate-500">Client-Side Decentralized Dispatch</span>
        </div>

      </div>
    </div>
  );
};
