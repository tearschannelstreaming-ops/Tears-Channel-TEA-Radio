import React, { useState } from 'react';
import { X, Play, Moon, Users, Phone, Trash2, CheckCircle2, Shield, Info, ChevronRight, Copy, Check, Sliders, Youtube, Instagram, Linkedin, Facebook, Heart, Download } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { CHANNEL_CONFIG } from '../data/mockData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [autoPlay, setAutoPlay] = useState(!CHANNEL_CONFIG.disable_mobile_live_autoplay);
  const [darkMode, setDarkMode] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  if (!isOpen) return null;

  const handleClearCache = () => {
    localStorage.clear();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const handleCopyConfig = () => {
    navigator.clipboard?.writeText(JSON.stringify(CHANNEL_CONFIG, null, 2));
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700 shadow-sm flex items-center justify-center bg-slate-900 shrink-0">
              <img
                src="/app-media/app_logo.jpg"
                alt="T.E.A.R.S. Logo"
                className="w-full h-full object-cover scale-[1.46]"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{CHANNEL_CONFIG.app_name} Settings</h2>
              <div className="text-[11px] text-slate-400 font-mono">App Store ID: 6762139785 · Sovereign Bundle: com.tearschannel.app</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* General Settings List (replicates Screenshot 8) */}
        <div className="space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            General Options
          </span>

          <div className="bg-slate-950/60 rounded-2xl border border-slate-800 divide-y divide-slate-850 overflow-hidden">
            
            {/* Auto Play */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Play className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-sm font-medium text-white block">Auto Play</span>
                  <span className="text-[11px] text-slate-400">disable_mobile_live_autoplay: true</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoPlay(!autoPlay)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  autoPlay ? 'bg-amber-400 justify-end' : 'bg-slate-700 justify-start'
                }`}
                aria-label="Toggle Auto Play"
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-white">Dark Mode</span>
              </div>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  darkMode ? 'bg-amber-400 justify-end' : 'bg-slate-700 justify-start'
                }`}
                aria-label="Toggle Dark Mode"
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            {/* Install Standalone App */}
            <div className="p-4 flex items-center justify-between bg-slate-900/40 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-sm font-medium text-white block">Install T.E.A.R.S. App</span>
                  <span className="text-[11px] text-slate-400">Standalone PWA for desktop &amp; mobile</span>
                </div>
              </div>
              <PWAInstallButton />
            </div>

            {/* About Us */}
            <button
              onClick={() => setShowAbout(!showAbout)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-white">About Us</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showAbout ? 'rotate-90' : ''}`} />
            </button>
            {showAbout && (
              <div className="p-4 bg-slate-900/40 text-xs text-slate-300 space-y-2 border-t border-slate-800 leading-relaxed">
                <p>
                  <strong>T.E.A.R.S. Channel</strong> stands for <em>Television Entertainment Advertisement RealEstate Streaming Channel</em>. 24/7 365 days a year of entertainment and advertisement.
                </p>
                <p>
                  Founded by <strong>Jeanell Land</strong>, CEO &amp; Licensed Land Broker. In strategic affiliation with <strong>S.T.E.A.R.Safe Technologies Inc.</strong>
                </p>
              </div>
            )}

            {/* Contact Us */}
            <button
              onClick={() => setShowContact(!showContact)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-white">Contact Us</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showContact ? 'rotate-90' : ''}`} />
            </button>
            {showContact && (
              <div className="p-4 bg-slate-900/60 text-xs text-slate-300 space-y-2 border-t border-slate-800">
                <div className="font-semibold text-white">T.E.A.R.S. Channel Executive Contacts</div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400">Founder &amp; CEO: </span>
                    <a href="mailto:jeanell@tearschannel.online" className="text-amber-400 hover:underline">
                      jeanell@tearschannel.online
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400">Network Support: </span>
                    <a href="mailto:support@tearschannel.online" className="text-cyan-400 hover:underline">
                      support@tearschannel.online
                    </a>
                  </div>
                  <div className="text-slate-400 pt-1">
                    Headquarters: Detroit, Michigan · S.T.E.A.R.Safe Technologies Inc.
                  </div>
                  <div className="text-slate-400">
                    Official App: <a href="https://apps.apple.com/app/id6762139785" target="_blank" rel="noreferrer" className="text-amber-300 hover:underline">Apple App Store (ID: 6762139785)</a>
                  </div>
                  <div className="pt-2">
                    <span className="text-slate-400 block mb-1.5">Social Channels:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href="https://www.facebook.com/share/1DopGpYERq/?mibextid=wwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-850 hover:border-blue-500/50 hover:text-blue-400 text-slate-300 flex items-center gap-1.5 transition-colors text-[10px]"
                      >
                        <Facebook className="w-3.5 h-3.5" />
                        <span>Facebook</span>
                      </a>
                      <a
                        href="https://www.youtube.com/@T.E.A.R.S.Channel-h3u"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-850 hover:border-red-500/50 hover:text-red-400 text-slate-300 flex items-center gap-1.5 transition-colors text-[10px]"
                        title="YouTube: @T.E.A.R.S.Channel-h3u"
                      >
                        <Youtube className="w-3.5 h-3.5" />
                        <span>YouTube</span>
                      </a>
                      <a
                        href="https://www.instagram.com/t.e.a.r.s.channel?obrf=MWVwbDY3c2tubWY5YQ%3D%3D&utm_source=qr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-850 hover:border-pink-500/50 hover:text-pink-400 text-slate-300 flex items-center gap-1.5 transition-colors text-[10px]"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        <span>Instagram</span>
                      </a>
                      <a
                        href="https://www.linkedin.com/company/tears-channel"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-850 hover:border-sky-500/50 hover:text-sky-400 text-slate-300 flex items-center gap-1.5 transition-colors text-[10px]"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>

                  {/* Community Advocacy: Family Reunite Act */}
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-400 block mb-1.5 text-[11px] font-mono uppercase tracking-wider">Community Advocacy:</span>
                    <a
                      href="https://c.org/nx2fdzbjB7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs flex items-center justify-between group hover:border-red-500/60 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-white group-hover:text-red-300 flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
                          <span>Family Reunite Act Petition</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Change.org · Championed by Jeanell Land</div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-400 group-hover:underline">Sign Petition →</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Clear Cache */}
            <button
              onClick={handleClearCache}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-white">Clear Cache</span>
              </div>
              {cacheCleared ? (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Cache Cleared!
                </span>
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Sovereign Channel Configuration JSON Inspector */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-sm font-medium text-white block">Active T.E.A.R.S. Channel Config</span>
                  <span className="text-[11px] text-amber-400/90 font-mono">20 Parameters Synchronized</span>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showConfig ? 'rotate-90' : ''}`} />
            </button>
            {showConfig && (
              <div className="p-4 bg-slate-900/60 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Exact JSON Payload:</span>
                  <button
                    onClick={handleCopyConfig}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                  >
                    {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedConfig ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-black/90 rounded-xl text-[11px] font-mono text-amber-300 overflow-x-auto leading-relaxed border border-slate-800">
                  {JSON.stringify(CHANNEL_CONFIG, null, 2)}
                </pre>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-1">
                  <div>• App Name: {CHANNEL_CONFIG.app_name}</div>
                  <div>• Banner Button: &quot;{CHANNEL_CONFIG.banner_button_text}&quot;</div>
                  <div>• SSAI: {CHANNEL_CONFIG.enableSSAI ? 'Enabled' : 'Disabled'}</div>
                  <div>• Mobile FAB: {CHANNEL_CONFIG.disable_mobile_fab ? 'Hidden' : 'Visible'}</div>
                  <div>• Login Wall: {CHANNEL_CONFIG.disable_mobile_login_wall ? 'Disabled' : 'Active'}</div>
                  <div>• Subscriptions: {CHANNEL_CONFIG.disable_subscription_mobile ? 'Free App' : 'Enabled'}</div>
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="text-center pt-2 text-[11px] text-slate-500 font-mono">
          T.E.A.R.S. Channel v1.0 · S.T.E.A.R.Safe Technologies Inc. (Patent Pending)
        </div>

      </div>
    </div>
  );
};
