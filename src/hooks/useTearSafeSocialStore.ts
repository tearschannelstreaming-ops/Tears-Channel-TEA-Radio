import { useState, useEffect, useCallback } from 'react';
import { TearSafeSocialPost, SocialPlatform, SharePayload } from '../types';

const TEARSAFE_POSTS_STORAGE_KEY = 'tearsafe_social_posts_v1';
const TEARSAFE_PROFILE_STORAGE_KEY = 'tearsafe_user_profile_v1';

export interface TearSafeProfile {
  handle: string;
  name: string;
  role: string;
  bio: string;
  verified: boolean;
  avatarGradient: string;
  followerCount: number;
  followingCount: number;
  totalShares: number;
  appLinked: boolean;
}

const DEFAULT_PROFILE: TearSafeProfile = {
  handle: '@jeanell_land',
  name: 'Jeanell Land',
  role: 'Founder & CEO · T.E.A.R.S. Channel & T.E.A.R.S.afe',
  bio: 'Advocating for Family Reunification, Sovereign Detroit Media, Commercial Land Acreage & Zero-Honeypot Creator Rights.',
  verified: true,
  avatarGradient: 'from-amber-500 via-red-600 to-purple-800',
  followerCount: 14280,
  followingCount: 412,
  totalShares: 8940,
  appLinked: true
};

const INITIAL_POSTS: TearSafeSocialPost[] = [
  {
    id: 'post-safe-1',
    authorName: 'Jeanell Land',
    authorHandle: '@jeanell_land',
    authorRole: 'Founder & CEO',
    avatarGradient: 'from-amber-500 via-red-600 to-purple-800',
    timestamp: '25m ago',
    content: '🚨 URGENT: The Family Reunite Act Petition is gathering momentum across Metro Detroit and nationally! We are standing up for family reunification and constitutional rights. Please take 30 seconds to sign and share this with your friends and family across Facebook and Instagram!',
    mediaType: 'announcement',
    mediaTitle: '✍️ Family Reunite Act Petition on Change.org',
    mediaUrl: 'https://c.org/nx2fdzbjB7',
    likes: 384,
    reposts: 192,
    commentsCount: 47,
    crossPostedPlatforms: ['T.E.A.R.S.afe', 'Facebook', 'Instagram', 'X (Twitter)', 'WhatsApp'],
    verified: true,
    hashtags: ['FamilyReuniteAct', 'TEARSafe', 'DetroitJustice', 'StandWithFamilies']
  },
  {
    id: 'post-safe-2',
    authorName: 'T.E.A.R.S. Prime Broadcast',
    authorHandle: '@tears_prime_tv',
    authorRole: 'Official Linear Feed',
    avatarGradient: 'from-blue-600 via-cyan-500 to-indigo-900',
    timestamp: '1h ago',
    content: '🔴 NOW STREAMING LIVE: Primetime Commercial Land & Urban Growth Showcase. Exploring Wayne County prime infill acreage with live zoning disclosures and drone aerial survey telemetry. Watch 24/7 without cable subscriptions!',
    mediaType: 'live_broadcast',
    mediaTitle: 'T.E.A.R.S. Prime 24/7 Live Television Stream',
    mediaChannelId: 'tears-prime',
    likes: 512,
    reposts: 128,
    commentsCount: 31,
    crossPostedPlatforms: ['T.E.A.R.S.afe', 'Facebook', 'X (Twitter)'],
    verified: true,
    hashtags: ['TEARSPrime', 'LiveTV', 'DetroitRealEstate', 'FreeStreaming']
  },
  {
    id: 'post-safe-3',
    authorName: 'T.E.A.Radio Playout Room',
    authorHandle: '@tear_radio_official',
    authorRole: 'Radio Program Director',
    avatarGradient: 'from-purple-600 via-pink-600 to-slate-900',
    timestamp: '3h ago',
    content: '🎵 NEW MUSIC DROP on T.E.A.Radio: "Detroit Midnight Skyline" by Jeanell Land & The Motown Soul Collective. Mastered in 24-bit lossless audio and distributed globally to Spotify, Apple Music & T.E.A.Radio. Tune in live right now!',
    mediaType: 'audio_track',
    mediaTitle: 'Detroit Midnight Skyline · Single',
    mediaUrl: 'https://tearschannel.online/?tab=radio',
    likes: 729,
    reposts: 284,
    commentsCount: 88,
    crossPostedPlatforms: ['T.E.A.R.S.afe', 'Instagram', 'X (Twitter)', 'WhatsApp'],
    verified: true,
    hashtags: ['TEARadio', 'DetroitMusic', 'IndependentArtist', 'SoulMotown']
  },
  {
    id: 'post-safe-4',
    authorName: 'Jeanell Land',
    authorHandle: '@jeanell_land',
    authorRole: 'Real Estate Broker',
    avatarGradient: 'from-amber-500 via-red-600 to-purple-800',
    timestamp: '5h ago',
    content: '🏢 EXCLUSIVE PARCEL RELEASE: Woodward Commercial Development Parcel (#DET-WD-285). 2.85 Acres zoned B4 General Business. Includes municipal utility hookup clearances, zero encumbrances, and ready for commercial assembly.',
    mediaType: 'real_estate_tour',
    mediaTitle: 'Woodward Commercial Development Parcel (2.85 Acres)',
    mediaUrl: 'https://mls-client.com/AC8E6C053',
    likes: 421,
    reposts: 165,
    commentsCount: 52,
    crossPostedPlatforms: ['T.E.A.R.S.afe', 'Facebook', 'LinkedIn'],
    verified: true,
    hashtags: ['JeanellLand', 'DetroitAcreage', 'CommercialParcels', 'MLSListing']
  }
];

export function useTearSafeSocialStore() {
  const [profile, setProfile] = useState<TearSafeProfile>(() => {
    try {
      const stored = localStorage.getItem(TEARSAFE_PROFILE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [posts, setPosts] = useState<TearSafeSocialPost[]>(() => {
    try {
      const stored = localStorage.getItem(TEARSAFE_POSTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  // Save profile to local device
  useEffect(() => {
    try {
      localStorage.setItem(TEARSAFE_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }, [profile]);

  // Save posts to local device
  useEffect(() => {
    try {
      localStorage.setItem(TEARSAFE_POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // Ignore
    }
  }, [posts]);

  // Add a new post created from the dashboard
  const createPost = useCallback((
    content: string,
    mediaType: TearSafeSocialPost['mediaType'],
    mediaTitle?: string,
    mediaUrl?: string,
    mediaChannelId?: string,
    crossPlatforms: SocialPlatform[] = ['T.E.A.R.S.afe'],
    tags: string[] = ['TEARSafe', 'TEARSChannel']
  ) => {
    const newPost: TearSafeSocialPost = {
      id: `post-safe-${Date.now()}`,
      authorName: profile.name,
      authorHandle: profile.handle,
      authorRole: profile.role,
      avatarGradient: profile.avatarGradient,
      timestamp: 'Just now',
      content: content.trim(),
      mediaType,
      mediaTitle,
      mediaUrl: mediaUrl || window.location.href,
      mediaChannelId,
      likes: 1,
      reposts: 0,
      commentsCount: 0,
      crossPostedPlatforms: crossPlatforms,
      verified: profile.verified,
      hashtags: tags
    };

    setPosts(prev => [newPost, ...prev]);
    setProfile(prev => ({
      ...prev,
      totalShares: prev.totalShares + crossPlatforms.length
    }));

    return newPost;
  }, [profile]);

  // Like a post
  const toggleLike = useCallback((postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  }, []);

  // Repost a post
  const repost = useCallback((postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, reposts: p.reposts + 1 };
      }
      return p;
    }));
  }, []);

  // Format share text
  const buildShareContent = useCallback((payload: SharePayload): {
    title: string;
    text: string;
    url: string;
    hashtagsFormatted: string;
    fullMessage: string;
  } => {
    const rawUrl = payload.url || window.location.href;
    const url = rawUrl.startsWith('http') ? rawUrl : `${window.location.origin}${rawUrl}`;
    const tags = payload.hashtags || ['TEARSafe', 'TEARSChannel', 'DetroitMedia', 'JeanellLand'];
    const hashtagsFormatted = tags.map(t => `#${t.replace(/^#/, '')}`).join(' ');
    const text = payload.text || 'Watch, listen and explore sovereign content on T.E.A.R.S. Channel and T.E.A.R.S.afe!';
    const fullMessage = `${payload.title}\n\n${text}\n\n${url}\n\n${hashtagsFormatted}`;

    return {
      title: payload.title,
      text,
      url,
      hashtagsFormatted,
      fullMessage
    };
  }, []);

  // Execute external share to specific platform
  const shareToPlatform = useCallback(async (
    platform: SocialPlatform,
    payload: SharePayload
  ): Promise<{ success: boolean; method: string; note?: string }> => {
    const shareData = buildShareContent(payload);
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedText = encodeURIComponent(`${shareData.title} - ${shareData.text}`);
    const encodedFull = encodeURIComponent(shareData.fullMessage);

    switch (platform) {
      case 'T.E.A.R.S.afe': {
        // Inter-app bridge: Try deep link to tearsafe:// scheme, fallback to web intent
        const deepLink = `tearsafe://post?content=${encodedText}&url=${encodedUrl}`;
        // Record post in local T.E.A.R.S.afe store
        createPost(
          payload.text || payload.title,
          payload.category === 'radio' ? 'audio_track' : payload.category === 'realestate' ? 'real_estate_tour' : 'live_broadcast',
          payload.title,
          shareData.url,
          payload.channelId,
          ['T.E.A.R.S.afe']
        );
        
        // Attempt deep link window location or fallback
        const link = document.createElement('a');
        link.href = deepLink;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return {
          success: true,
          method: 'tearsafe_app_bridge',
          note: 'Posted to T.E.A.R.S.afe dashboard feed & signaled tearsafe:// inter-app protocol'
        };
      }

      case 'Facebook': {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        window.open(fbUrl, '_blank', 'width=640,height=580,noopener,noreferrer');
        return { success: true, method: 'facebook_web_sharer' };
      }

      case 'Instagram': {
        // Instagram does not have a direct desktop web post URL, so we copy optimized caption and open Instagram web/app
        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareData.fullMessage);
          }
        } catch {
          // ignore clipboard errors
        }
        const igUrl = 'https://www.instagram.com/';
        window.open(igUrl, '_blank', 'noopener,noreferrer');
        return {
          success: true,
          method: 'instagram_clipboard_launch',
          note: 'Caption copied to clipboard! Ready to paste into Instagram Feed or Story.'
        };
      }

      case 'X (Twitter)': {
        const tagsOnly = (payload.hashtags || ['TEARSafe', 'TEARSChannel']).join(',');
        const xUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodeURIComponent(tagsOnly)}`;
        window.open(xUrl, '_blank', 'width=600,height=450,noopener,noreferrer');
        return { success: true, method: 'x_twitter_intent' };
      }

      case 'WhatsApp': {
        const waUrl = `https://api.whatsapp.com/send?text=${encodedFull}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        return { success: true, method: 'whatsapp_api' };
      }

      case 'LinkedIn': {
        const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        window.open(liUrl, '_blank', 'width=650,height=550,noopener,noreferrer');
        return { success: true, method: 'linkedin_sharer' };
      }

      case 'Telegram': {
        const tgUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        window.open(tgUrl, '_blank', 'noopener,noreferrer');
        return { success: true, method: 'telegram_sharer' };
      }

      default: {
        return { success: false, method: 'unsupported' };
      }
    }
  }, [buildShareContent, createPost]);

  // Native device share sheet
  const shareNative = useCallback(async (payload: SharePayload): Promise<boolean> => {
    const data = buildShareContent(payload);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: `${data.text} ${data.hashtagsFormatted}`,
          url: data.url
        });
        return true;
      } catch (err: any) {
        if (err.name === 'AbortError') return false;
      }
    }
    // Fallback: copy to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(data.fullMessage);
      return true;
    }
    return false;
  }, [buildShareContent]);

  return {
    profile,
    setProfile,
    posts,
    createPost,
    toggleLike,
    repost,
    shareToPlatform,
    shareNative,
    buildShareContent
  };
}
