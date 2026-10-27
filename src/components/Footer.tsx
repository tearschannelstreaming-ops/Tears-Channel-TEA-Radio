import React, { useState } from 'react';
import { Tv, ShieldCheck, Youtube, Instagram, Linkedin, Facebook, Heart, Mail, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const [email, setEmail] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState(() => {
    try {
      return localStorage.getItem('tears_newsletter_email') || '';
    } catch {
      return '';
    }
  });
  const [isSubscribed, setIsSubscribed] = useState(() => {
    try {
      return localStorage.getItem('tears_newsletter_subscribed') === 'true';
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
      setSubscribedEmail(cleanEmail);
      try {
        localStorage.setItem('tears_newsletter_subscribed', 'true');
        localStorage.setItem('tears_newsletter_email', cleanEmail);
      } catch {
        // Ignore storage errors
      }
    }, 400);
  };

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
    setSubscribedEmail('');
    setEmail('');
    try {
      localStorage.removeItem('tears_newsletter_subscribed');
      localStorage.removeItem('tears_newsletter_email');
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <footer className="bg-[#070a10] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Newsletter Signup Component */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0e1726] to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>T.E.A.R.S. Network Updates &amp; Land Briefings</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Get Exclusive Broadcast Updates &amp; Real Estate Alerts
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Stay updated on new Detroit commercial acreage, primetime TV programming, T.E.A.R.adio music specials, and community initiatives direct from CEO &amp; Land Broker Jeanell Land.
              </p>
            </div>

            {/* Newsletter Form */}
            <div className="w-full lg:max-w-md">
              {isSubscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-start justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-0.5">
                      <span className="font-bold text-white block">You are Subscribed!</span>
                      <span className="text-slate-300">
                        Dispatches will be delivered to <strong className="text-amber-300">{subscribedEmail || email}</strong> from <span className="font-mono text-cyan-300">support@tearschannel.online</span>.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleUnsubscribe}
                    className="text-[11px] text-slate-400 hover:text-white underline font-mono shrink-0"
                    title="Unsubscribe or change email"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(''); }}
                        placeholder="Enter your email (e.g. investor@example.com)..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-400/20 whitespace-nowrap flex items-center justify-center gap-1.5 shrink-0 hover:scale-105 disabled:opacity-50"
                    >
                      <span>{loading ? 'Joining...' : 'Subscribe'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>Zero spam · Instant opt-out</span>
                    <span>Dispatches via support@tearschannel.online</span>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mb-16" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 flex items-center justify-center bg-slate-900 shrink-0 shadow-sm">
                <img
                  src="/app-media/app_logo.jpg"
                  alt="T.E.A.R.S. Channel Logo"
                  className="w-full h-full object-cover scale-[1.46]"
                />
              </div>
              <span className="text-white font-extrabold text-sm tracking-tight">
                T.E.A.R.S.<span className="text-amber-400 ml-1">CHANNEL</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Television • Entertainment • Advertisement • RealEstate • Streaming Channel. Founded by Jeanell Land, CEO &amp; Land Broker.
            </p>

            {/* Official Contact Emails & Web */}
            <div className="text-[11px] text-slate-400 space-y-1 font-mono pt-1">
              <div>
                <span className="text-slate-500">Website: </span>
                <a href="https://tearschannel.online" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
                  tearschannel.online
                </a>
              </div>
              <div>
                <span className="text-slate-500">CEO: </span>
                <a href="mailto:jeanell@tearschannel.online" className="text-amber-400 hover:underline">
                  jeanell@tearschannel.online
                </a>
              </div>
              <div>
                <span className="text-slate-500">Support: </span>
                <a href="mailto:support@tearschannel.online" className="text-cyan-400 hover:underline">
                  support@tearschannel.online
                </a>
              </div>
              <div className="text-slate-500 pt-0.5">S.T.E.A.R.Safe Technologies Inc.</div>
            </div>

            {/* Community Advocacy Petition Card */}
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs space-y-1.5 shadow-sm">
              <div className="font-semibold text-red-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
                <span>Family Reunite Act Petition</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Support founder Jeanell Land&#39;s nationwide child support reform initiative on Change.org.
              </p>
              <a
                href="https://c.org/nx2fdzbjB7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-bold underline"
              >
                Sign on Change.org (c.org/nx2fdzbjB7) →
              </a>
            </div>

            {/* Official Social Media Follow Links */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                Follow Official T.E.A.R.S.
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/share/1DopGpYERq/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow T.E.A.R.S. Channel on Facebook"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all hover:scale-105"
                  title="Facebook: T.E.A.R.S. Channel"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.youtube.com/@T.E.A.R.S.Channel-h3u"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow T.E.A.R.S. Channel on YouTube (@T.E.A.R.S.Channel-h3u)"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all hover:scale-105"
                  title="YouTube: @T.E.A.R.S.Channel-h3u"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/t.e.a.r.s.channel?obrf=MWVwbDY3c2tubWY5YQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow @t.e.a.r.s.channel on Instagram"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:bg-pink-500/10 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all hover:scale-105"
                  title="Instagram: @t.e.a.r.s.channel"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/tears-channel"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with T.E.A.R.S. Channel on LinkedIn"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-sky-500/10 text-slate-400 hover:text-sky-400 flex items-center justify-center transition-all hover:scale-105"
                  title="LinkedIn: T.E.A.R.S. Channel"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Broadcast Channels */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-mono">Channels</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => onSelectTab('live')} className="hover:text-white transition-colors text-left">CH 101: T.E.A.R.S. Primetime TV</button></li>
              <li><button onClick={() => onSelectTab('realestate')} className="hover:text-white transition-colors text-left">CH 102: Real Estate Network</button></li>
              <li><button onClick={() => onSelectTab('radio')} className="hover:text-white transition-colors text-left">CH 103: T.E.A.R.adio Live</button></li>
              <li><button onClick={() => onSelectTab('advertise')} className="hover:text-white transition-colors text-left">CH 104: Commercial &amp; Business TV</button></li>
            </ul>
          </div>

          {/* Real Estate & Land Brokerage (All Your Needs Reality LLC) */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-mono">All Your Needs Reality LLC</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => onSelectTab('realestate')} className="hover:text-amber-400 text-amber-300 font-semibold transition-colors text-left">Metaverse Real Estate World (Monopoly GO)</button></li>
              <li><button onClick={() => onSelectTab('realestate')} className="hover:text-white transition-colors text-left">Market Your Property (List with Broker)</button></li>
              <li><button onClick={() => onSelectTab('realestate')} className="hover:text-white transition-colors text-left">Buyer &amp; Seller Agency Agreements</button></li>
              <li><button onClick={() => onSelectTab('realestate')} className="hover:text-white transition-colors text-left">25% Co-Op Broker Affiliates (Smart Cash)</button></li>
            </ul>
          </div>

          {/* Platforms & Advertising */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-mono">Network &amp; Apps</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => onSelectTab('guide')} className="hover:text-white transition-colors text-left">Daily TV Guide &amp; EPG</button></li>
              <li><button onClick={() => onSelectTab('vod')} className="hover:text-white transition-colors text-left">Video On Demand Catalog</button></li>
              <li><button onClick={() => onSelectTab('scanner')} className="hover:text-white transition-colors text-left">Media Title Cleaner &amp; Audit</button></li>
              <li><button onClick={() => onSelectTab('studio')} className="hover:text-amber-400 text-amber-300 font-semibold transition-colors text-left flex items-center gap-1"><span>T.E.A.R.S. Studio CMS</span></button></li>
              <li><button onClick={() => onSelectTab('creators')} className="hover:text-red-400 text-red-300 font-semibold transition-colors text-left flex items-center gap-1"><span>Creator Studio &amp; Monetization (Zero-Honeypot)</span></button></li>
              <li><button onClick={() => onSelectTab('taxes')} className="hover:text-emerald-400 text-emerald-300 font-semibold transition-colors text-left flex items-center gap-1"><span>Creator Tax Portal &amp; Filming Expenses (1099 / Sched C)</span></button></li>
              <li><button onClick={() => onSelectTab('music')} className="hover:text-purple-400 text-purple-300 font-semibold transition-colors text-left flex items-center gap-1"><span>T.E.A.R.adio Music Distro (Spotify / Apple / DistroKid)</span></button></li>
              <li><button onClick={() => onSelectTab('biometrics')} className="hover:text-cyan-400 text-cyan-300 font-semibold transition-colors text-left flex items-center gap-1"><span>Face Biometrics &amp; Sovereign ID Verification</span></button></li>
              <li><button onClick={() => onSelectTab('patent')} className="hover:text-cyan-400 text-cyan-300 font-semibold transition-colors text-left flex items-center gap-1"><span>Patent &amp; Clean-Room IP Lab</span> <span>⚖️</span></button></li>
              <li><a href="https://c.org/nx2fdzbjB7" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors text-red-300 font-semibold flex items-center gap-1"><span>Family Reunite Act Petition</span> <span>✍️</span></a></li>
              <li><button onClick={() => onSelectTab('calendar')} className="hover:text-purple-400 text-purple-300 font-semibold transition-colors text-left flex items-center gap-1"><span>Appointment Calendar &amp; Offline PWA Hub</span></button></li>
              <li><a href="https://mls-client.com/AC8E6C053" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 text-cyan-300 transition-colors">MLS Client Mobile App (Code: AC8E6C053)</a></li>
              <li><button onClick={() => onSelectTab('advertise')} className="hover:text-white transition-colors text-left">Commercial Airtime Rates</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Quiet Attribution */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} T.E.A.R.S. Channel &amp; T.E.A.R.adio. U.S. &amp; Int&#39;l Patents Pending by S.T.E.A.R.Safe Technologies Inc. &amp; Jeanell Land. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Clean-Room Certified</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Licensed Brokerage</span>
            </span>
            <span>·</span>
            <span>Detroit, MI &amp; Nationwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
