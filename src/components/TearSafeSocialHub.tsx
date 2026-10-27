import React, { useState } from 'react';
import { useTearSafeSocialStore } from '../hooks/useTearSafeSocialStore';
import { SocialPlatform, TearSafeSocialPost } from '../types';
import { SocialShareModal } from './SocialShareModal';
import { 
  ShieldCheck, Share2, Sparkles, Send, MessageCircle, Heart, Repeat, 
  Tv, Radio, Building2, Download, Copy, Check, ExternalLink, 
  BadgeCheck, Users, Shield, Plus, Filter, Smartphone, Flame, Lock
} from 'lucide-react';

interface TearSafeSocialHubProps {
  onTuneInToChannel?: (channelId: string) => void;
  onNavigateToRealEstate?: () => void;
  onNavigateToRadio?: () => void;
}

export const TearSafeSocialHub: React.FC<TearSafeSocialHubProps> = ({
  onTuneInToChannel,
  onNavigateToRealEstate,
  onNavigateToRadio
}) => {
  const {
    profile,
    posts,
    createPost,
    toggleLike,
    repost,
    shareToPlatform,
    shareNative
  } = useTearSafeSocialStore();

  const [activeTab, setActiveTab] = useState<'feed' | 'composer' | 'storyStudio' | 'bridgeInfo'>('feed');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedSharePost, setSelectedSharePost] = useState<TearSafeSocialPost | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Post Composer State
  const [composerText, setComposerText] = useState('');
  const [composerMediaType, setComposerMediaType] = useState<TearSafeSocialPost['mediaType']>('live_broadcast');
  const [composerMediaTitle, setComposerMediaTitle] = useState('T.E.A.R.S. Prime 24/7 Live Broadcast');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'T.E.A.R.S.afe',
    'Facebook',
    'Instagram',
    'X (Twitter)'
  ]);

  const togglePlatform = (p: SocialPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim()) return;

    createPost(
      composerText,
      composerMediaType,
      composerMediaTitle,
      window.location.origin,
      composerMediaType === 'live_broadcast' ? 'tears-prime' : undefined,
      selectedPlatforms,
      ['TEARSafe', 'TEARSChannel', 'JeanellLand', 'FamilyReuniteAct']
    );

    setActionNotice(`Post published to T.E.A.R.S.afe and cross-dispatched to ${selectedPlatforms.join(', ')}!`);
    setTimeout(() => setActionNotice(null), 4000);

    setComposerText('');
    setActiveTab('feed');
  };

  const handleQuickSharePost = (post: TearSafeSocialPost) => {
    setSelectedSharePost(post);
    setIsShareModalOpen(true);
  };

  const filteredPosts = posts.filter(post => {
    if (filterType === 'all') return true;
    if (filterType === 'broadcast') return post.mediaType === 'live_broadcast';
    if (filterType === 'realestate') return post.mediaType === 'real_estate_tour';
    if (filterType === 'music') return post.mediaType === 'audio_track';
    if (filterType === 'announcement') return post.mediaType === 'announcement';
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left">
      
      {/* Top Banner: T.E.A.R.S.afe Social Media Hub */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/50 border-2 border-red-500/40 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>T.E.A.R.S.afe SOCIAL MEDIA APP INTEGRATION · INTER-APP SHARING</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            T.E.A.R.S.afe Social Media &amp; Cross-App Share Hub
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Connected to <strong>T.E.A.R.S.afe</strong> (founder sovereign social media app). Seamlessly distribute videos, live broadcasts, real estate parcels, and T.E.A.Radio singles across <strong>Facebook, Instagram, X (Twitter), WhatsApp, and LinkedIn</strong> with zero data-broker honeypots.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Inter-App Bridge: CONNECTED</span>
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sovereign ID Verified</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Zero-Honeypot Client Isolation</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-sm font-semibold flex items-center gap-2 shadow-lg">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Profile & Inter-App Dashboard Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${profile.avatarGradient} flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-amber-500/20`}>
            JL
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">{profile.name}</h2>
              <BadgeCheck className="w-5 h-5 text-amber-400" />
              <span className="text-[11px] font-mono bg-red-600/30 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-bold">
                T.E.A.R.S.afe Creator
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{profile.handle} · {profile.role}</p>
            <p className="text-xs text-slate-300 max-w-lg">{profile.bio}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="text-center">
            <div className="text-lg font-black text-white">{profile.followerCount.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-amber-400">{profile.totalShares.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Cross-Shares</div>
          </div>
          <button
            onClick={() => setActiveTab('composer')}
            className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Create Cross-Post</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'feed'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>T.E.A.R.S.afe Community Feed ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('composer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'composer'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Post &amp; Share Composer</span>
          </button>

          <button
            onClick={() => setActiveTab('storyStudio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'storyStudio'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Instagram Story Visual Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('bridgeInfo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'bridgeInfo'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Inter-App Protocol Specs</span>
          </button>
        </div>

        {/* 1-Click Native Share */}
        <button
          onClick={() => shareNative({
            title: 'T.E.A.R.S. Channel & T.E.A.R.S.afe Social Media Hub',
            text: 'Tune in to sovereign 24/7 broadcasting, real estate parcel tours, and independent Motown music!',
            url: window.location.href,
            hashtags: ['TEARSafe', 'TEARSChannel', 'DetroitMedia']
          })}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Mobile Share Sheet</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: T.E.A.R.S.afe COMMUNITY FEED */}
      {/* ============================================================== */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          
          {/* Feed Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" />
              <span>Filter:</span>
            </span>
            {[
              { id: 'all', label: 'All Content' },
              { id: 'announcement', label: '🚨 Petitions & News' },
              { id: 'broadcast', label: '📺 Live Broadcasts' },
              { id: 'music', label: '🎵 T.E.A.Radio Music' },
              { id: 'realestate', label: '🏢 Real Estate' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterType === f.id
                    ? 'bg-amber-400 text-black font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Posts Stream */}
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div
                key={post.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all shadow-lg space-y-4"
              >
                {/* Author Info & Cross-Post Tags */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${post.avatarGradient} flex items-center justify-center text-white text-xs font-black shadow-md`}>
                      {post.authorName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">{post.authorName}</span>
                        {post.verified && <BadgeCheck className="w-4 h-4 text-amber-400" />}
                        <span className="text-[11px] font-mono text-slate-400">{post.authorHandle}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {post.authorRole} · {post.timestamp}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickSharePost(post)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-black text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-bold"
                    title="Share between apps"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>

                {/* Content Body */}
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Attached Media Box */}
                {post.mediaTitle && (
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-600/30 border border-amber-500/40 flex items-center justify-center shrink-0">
                        {post.mediaType === 'audio_track' ? (
                          <Radio className="w-5 h-5 text-purple-400" />
                        ) : post.mediaType === 'real_estate_tour' ? (
                          <Building2 className="w-5 h-5 text-cyan-400" />
                        ) : post.mediaType === 'live_broadcast' ? (
                          <Tv className="w-5 h-5 text-amber-400" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{post.mediaTitle}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {post.mediaType === 'live_broadcast' && '24/7 Linear Video Channel'}
                          {post.mediaType === 'audio_track' && 'T.E.A.Radio & DSP Master'}
                          {post.mediaType === 'real_estate_tour' && 'Wayne County Assessor MLS Parcel'}
                          {post.mediaType === 'announcement' && 'Constitutional Advocacy Initiative'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {post.mediaType === 'live_broadcast' && onTuneInToChannel && (
                        <button
                          onClick={() => onTuneInToChannel('tears-prime')}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Tv className="w-3.5 h-3.5" />
                          <span>Watch Live</span>
                        </button>
                      )}
                      {post.mediaType === 'audio_track' && onNavigateToRadio && (
                        <button
                          onClick={onNavigateToRadio}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Radio className="w-3.5 h-3.5" />
                          <span>Listen On-Air</span>
                        </button>
                      )}
                      {post.mediaType === 'real_estate_tour' && onNavigateToRealEstate && (
                        <button
                          onClick={onNavigateToRealEstate}
                          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Inspect Parcel</span>
                        </button>
                      )}
                      {post.mediaUrl && (
                        <a
                          href={post.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                          <span>Open</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Hashtags */}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 text-xs text-amber-400/90 font-mono">
                    {post.hashtags.map((tag, i) => (
                      <span key={i} className="hover:underline cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Row: Like, Repost, Cross-Posted Badges */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors font-mono"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button
                      onClick={() => repost(post.id)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors font-mono"
                    >
                      <Repeat className="w-4 h-4" />
                      <span>{post.reposts}</span>
                    </button>
                    <button
                      onClick={() => handleQuickSharePost(post)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors font-mono"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Cross-Share</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <span>Syndicated to:</span>
                    {post.crossPostedPlatforms.map((plat, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: POST & INTER-APP COMPOSER */}
      {/* ============================================================== */}
      {activeTab === 'composer' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">Broadcast to T.E.A.R.S.afe &amp; Social Media</h3>
            <p className="text-xs text-slate-400">
              Compose a message and broadcast it simultaneously across T.E.A.R.S.afe, Facebook, Instagram, Twitter/X, and WhatsApp with 1 click.
            </p>
          </div>

          <form onSubmit={handlePublishPost} className="space-y-5">
            {/* Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Post Content &amp; Caption
              </label>
              <textarea
                rows={4}
                value={composerText}
                onChange={e => setComposerText(e.target.value)}
                placeholder="What's happening in Detroit? Share a video update, commercial land parcel, radio track, or petition shoutout..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
            </div>

            {/* Media Attachment Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Attach Media Type
                </label>
                <select
                  value={composerMediaType}
                  onChange={e => {
                    const val = e.target.value as any;
                    setComposerMediaType(val);
                    if (val === 'live_broadcast') setComposerMediaTitle('T.E.A.R.S. Prime 24/7 Live Broadcast');
                    if (val === 'audio_track') setComposerMediaTitle('T.E.A.Radio 24/7 On-Air Stream & Lossless Master');
                    if (val === 'real_estate_tour') setComposerMediaTitle('Woodward Commercial Parcel (2.85 Acres)');
                    if (val === 'announcement') setComposerMediaTitle('✍️ Family Reunite Act Petition');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="live_broadcast">📺 24/7 Live Television Stream</option>
                  <option value="audio_track">🎵 T.E.A.Radio Single / Audio Track</option>
                  <option value="real_estate_tour">🏢 Real Estate Parcel Tour</option>
                  <option value="announcement">🚨 Family Reunite Act Petition</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Attachment Title
                </label>
                <input
                  type="text"
                  value={composerMediaTitle}
                  onChange={e => setComposerMediaTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Cross-Posting Checklist */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Cross-Dispatch Across Platforms (Select all that apply)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'T.E.A.R.S.afe' as SocialPlatform, label: 'T.E.A.R.S.afe', note: 'My Social Media App', color: 'text-amber-400' },
                  { id: 'Facebook' as SocialPlatform, label: 'Facebook', note: 'Feed & Groups', color: 'text-blue-400' },
                  { id: 'Instagram' as SocialPlatform, label: 'Instagram', note: 'Story & Caption', color: 'text-pink-400' },
                  { id: 'X (Twitter)' as SocialPlatform, label: 'X (Twitter)', note: 'Instant Tweet', color: 'text-slate-300' },
                  { id: 'WhatsApp' as SocialPlatform, label: 'WhatsApp', note: 'Direct & Status', color: 'text-emerald-400' },
                  { id: 'LinkedIn' as SocialPlatform, label: 'LinkedIn', note: 'Professional Feed', color: 'text-sky-400' }
                ].map(item => {
                  const active = selectedPlatforms.includes(item.id);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => togglePlatform(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        active
                          ? 'bg-slate-800/90 border-amber-400 shadow-sm'
                          : 'bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${item.color}`}>{item.label}</span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${active ? 'bg-amber-400 text-black font-black' : 'border border-slate-700'}`}>
                          {active && '✓'}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.note}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('feed')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 hover:from-red-500 hover:to-amber-300 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Publish to T.E.A.R.S.afe &amp; Dispatch</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 3: INSTAGRAM STORY VISUAL CARD STUDIO */}
      {/* ============================================================== */}
      {activeTab === 'storyStudio' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-black text-white">Instagram Story &amp; Feed Card Studio</h3>
              <p className="text-xs text-slate-400 mt-1">
                Generate high-resolution visual cards formatted for Instagram Stories (9:16) with channel insignia, live status, and QR codes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Card Live Preview */}
              <div className="flex justify-center">
                <div className="w-72 aspect-[9/16] rounded-3xl p-6 bg-gradient-to-b from-[#1b0b2b] via-[#09152b] to-[#1a0b12] border-4 border-amber-400/80 shadow-2xl flex flex-col justify-between text-center relative overflow-hidden">
                  
                  {/* Decorative background glow */}
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-red-600/20 rounded-full blur-2xl" />

                  {/* Top Header */}
                  <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span>LIVE BROADCAST</span>
                    </div>
                    <div className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
                      T.E.A.R.S. Channel
                    </div>
                  </div>

                  {/* Center Content */}
                  <div className="space-y-3 relative z-10 my-auto py-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-red-600 flex items-center justify-center text-black font-black text-2xl shadow-xl shadow-amber-500/30">
                      T
                    </div>
                    <h4 className="text-base font-extrabold text-white leading-tight">
                      Detroit Sovereign Broadcast &amp; Real Estate Television
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Stream 24/7 commercial land tours, Motown soul on T.E.Radio, and support the Family Reunite Act.
                    </p>
                  </div>

                  {/* Bottom QR Code & Link */}
                  <div className="space-y-2 relative z-10">
                    <div className="p-2 bg-white rounded-xl inline-block shadow-lg">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.href)}`}
                        alt="QR Code"
                        className="w-20 h-20"
                      />
                    </div>
                    <div className="text-[10px] font-mono font-bold text-amber-300">
                      SCAN OR VISIT TEARSCHANNEL.ONLINE
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono">
                      Integrated with T.E.A.R.S.afe App
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-sm font-bold text-white">Ready for Instagram Stories</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Instagram allows direct sharing via clipboard captions and story image attachments. Tap below to copy the ready-to-paste caption with all sovereign hashtags and open Instagram.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const caption = `🔴 T.E.A.R.S. Channel & T.E.A.R.S.afe Detroit Broadcast!\n\nWatch 24/7 commercial land parcel tours, independent Motown soul music on T.E.Radio, and sign the Family Reunite Act petition.\n\n📱 Link: ${window.location.href}\n\n#TEARSafe #TEARSChannel #JeanellLand #FamilyReuniteAct #DetroitMedia #CommercialRealEstate`;
                      navigator.clipboard?.writeText(caption);
                      setActionNotice('Instagram caption copied to clipboard! Opening Instagram...');
                      setTimeout(() => setActionNotice(null), 4000);
                      window.open('https://www.instagram.com/', '_blank');
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy IG Caption &amp; Open Instagram</span>
                  </button>

                  <button
                    onClick={() => {
                      shareToPlatform('Facebook', {
                        title: 'T.E.A.R.S. Channel & T.E.A.R.S.afe Live',
                        text: 'Detroit sovereign broadcast, real estate tours and T.E.Radio!',
                        url: window.location.href
                      });
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
                  >
                    <span>Share Directly to Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 4: INTER-APP PROTOCOL SPECS */}
      {/* ============================================================== */}
      {activeTab === 'bridgeInfo' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PATENT CLAIM 7 READY · INTER-APP PROTOCOL</span>
            </div>
            <h3 className="text-xl font-black text-white">T.E.A.R.S.afe Inter-App Protocol Architecture</h3>
            <p className="text-xs text-slate-400">
              Technical documentation on how T.E.A.R.S. Channel communicates seamlessly with your companion app T.E.A.R.S.afe without intermediary cloud surveillance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 font-mono">1. Custom URL Scheme Handler</div>
              <p className="text-xs text-slate-300">
                Registered URI scheme <code className="text-amber-300 bg-black/60 px-1 py-0.5 rounded">tearsafe://</code> triggers native app intent on Android and iOS devices, passing cryptographic media hashes directly to the T.E.A.R.S.afe dashboard feed.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-cyan-400 font-mono">2. Zero-Honeypot Client Isolation</div>
              <p className="text-xs text-slate-300">
                Social connection tokens, share counts, and post drafts are preserved solely in client device Web Crypto / LocalStorage vaults. No centralized tracking server logs cross-app sharing activity.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-purple-400 font-mono">3. Multi-DSP Media Synchronizer</div>
              <p className="text-xs text-slate-300">
                Audio singles uploaded to T.E.A.Radio automatically cross-generate deep links for T.E.A.R.S.afe, Spotify, and Apple Music with embedded ISRC identifiers and split sheets.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-emerald-400 font-mono">4. Family Reunite Act Petition Bridge</div>
              <p className="text-xs text-slate-300">
                Direct Change.org webhook bridge allowing 1-tap syndication of founder Jeanell Land&apos;s Family Reunite Act petition to thousands of community advocates across Instagram and Facebook.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Share Modal */}
      {selectedSharePost && (
        <SocialShareModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSelectedSharePost(null);
          }}
          payload={{
            title: selectedSharePost.mediaTitle || `${selectedSharePost.authorName} on T.E.A.R.S.afe`,
            text: selectedSharePost.content,
            url: selectedSharePost.mediaUrl || window.location.href,
            category: selectedSharePost.mediaType,
            hashtags: selectedSharePost.hashtags
          }}
        />
      )}

    </div>
  );
};
