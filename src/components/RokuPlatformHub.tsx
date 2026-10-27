import React from 'react';
import { Tv, Smartphone, Radio, Globe, Shield, ExternalLink, Facebook, Youtube, Instagram, Linkedin, Heart } from 'lucide-react';

export const RokuPlatformHub: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
          Multi-Device Distribution
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Tune In on Roku TV, Mobile &amp; In-Vehicle Audio
        </h2>
        <p className="text-slate-400 text-sm">
          Stream T.E.A.R.S. Channel 24/7 on your home smart television or listen to T.E.A.R.adio wherever the road takes you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Roku TV Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Tv className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Roku TV Channel</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Search for &quot;<strong>T.E.A.R.S. Channel</strong>&quot; directly in the Roku Channel Store or on your Roku Streaming Stick / Smart TV to add our channel to your home screen.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-xs font-mono text-amber-400">
            Available 24/7 in Full HD &amp; 4K
          </div>
        </div>

        {/* Mobile Apps Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">iOS &amp; Android Apps</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Download the official T.E.A.R.S. Channel app on the Apple App Store and Google Play Store for on-the-go video streaming and real estate tours.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-xs font-mono text-cyan-400">
            Apple App Store · Google Play
          </div>
        </div>

        {/* T.E.A.R.adio & Driver Safety */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">T.E.A.R.adio Live Feed</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Nationwide audio network featuring Motown soul, smooth jazz, and real-time highway traffic dispatch powered by S.T.E.A.R.Safe Technologies Inc.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-xs font-mono text-amber-400">
            CarPlay &amp; Bluetooth Streaming
          </div>
        </div>

      </div>

      {/* Community & Social Channels */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
            Join the Official T.E.A.R.S. Community
          </div>
          <p className="text-xs text-slate-400">
            Follow our network updates, featured listings, broadcast premieres, and behind-the-scenes streams.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://www.facebook.com/share/1DopGpYERq/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/10 text-slate-300 hover:text-blue-400 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Facebook: T.E.A.R.S. Channel"
          >
            <Facebook className="w-3.5 h-3.5 text-blue-400" />
            <span>Facebook</span>
          </a>
          <a
            href="https://www.youtube.com/@T.E.A.R.S.Channel-h3u"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 hover:bg-red-500/10 text-slate-300 hover:text-red-400 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="YouTube: @T.E.A.R.S.Channel-h3u"
          >
            <Youtube className="w-3.5 h-3.5 text-red-400" />
            <span>YouTube</span>
          </a>
          <a
            href="https://www.instagram.com/t.e.a.r.s.channel?obrf=MWVwbDY3c2tubWY5YQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-pink-500/50 hover:bg-pink-500/10 text-slate-300 hover:text-pink-400 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Instagram: @t.e.a.r.s.channel"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>Instagram</span>
          </a>
          <a
            href="https://www.linkedin.com/company/tears-channel"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 hover:bg-sky-500/10 text-slate-300 hover:text-sky-400 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="LinkedIn: T.E.A.R.S. Channel"
          >
            <Linkedin className="w-3.5 h-3.5 text-sky-400" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      {/* Community Advocacy: Family Reunite Act */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/50 via-slate-900 to-slate-900 border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 font-mono uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Official Community Cause · Family Reunite Act</span>
          </div>
          <h3 className="text-lg font-bold text-white">Reforming Child &amp; Family Well-Being in the United States</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Spearheaded by T.E.A.R.S. Channel founder Jeanell Land, this national petition calls for vital child support structure reform to safeguard children&#39;s stability and ensure fair parental contributions nationwide.
          </p>
        </div>
        <a
          href="https://c.org/nx2fdzbjB7"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-red-600/30 shrink-0 hover:scale-105"
        >
          <span>Sign Petition on Change.org</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
};
