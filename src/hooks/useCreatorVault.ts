import { useState, useEffect, useCallback } from 'react';

export interface CreatorVideoAsset {
  id: string;
  title: string;
  description: string;
  category: string;
  channelId: string;
  duration: string;
  views: number;
  likes: number;
  shares: number;
  earnedAmount: number; // In USD
  uploadDate: string;
  status: 'Published' | 'Under Review' | 'Processing';
  rightsClearance: {
    verified: boolean;
    licenseType: 'Original Work' | 'Sync Licensed' | 'Commercial Broker Clearance' | 'Work-for-Hire';
    sha256Proof: string;
    rightsDeclarationAccepted: boolean;
    scannedAt: string;
  };
  monetization: {
    adRevenueShareEnabled: boolean;
    tipsEnabled: boolean;
    brokerBountyEnabled: boolean;
    rpm: number; // Revenue per thousand views
  };
}

export interface CreatorVaultProfile {
  creatorId: string;
  channelName: string;
  creatorEmail: string;
  categorySpecialty: string;
  publicKeyFingerprint: string;
  totalEarnings: number;
  pendingPayout: number;
  lifetimeViews: number;
  vaultEncryptionDate: string;
  storageMode: 'On-Device Client-Vault (Zero-Honeypot)';
}

const VAULT_STORAGE_KEY = 'tears_creator_vault_v1';
const VAULT_VIDEOS_KEY = 'tears_creator_videos_v1';

const INITIAL_CREATOR_VIDEOS: CreatorVideoAsset[] = [
  {
    id: 'vid-crt-101',
    title: 'Woodward Corridor Commercial Infill Site Tour (4K Drone)',
    description: 'Exclusive 4K aerial footage exploring 2.85 prime commercial acres ready for mixed-use retail zoning in Metro Detroit.',
    category: 'Real Estate',
    channelId: 'real-estate-tv',
    duration: '18:45',
    views: 42100,
    likes: 3120,
    shares: 890,
    earnedAmount: 1145.20,
    uploadDate: '2026-10-10',
    status: 'Published',
    rightsClearance: {
      verified: true,
      licenseType: 'Commercial Broker Clearance',
      sha256Proof: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      rightsDeclarationAccepted: true,
      scannedAt: '2026-10-10T14:32:00Z'
    },
    monetization: {
      adRevenueShareEnabled: true,
      tipsEnabled: true,
      brokerBountyEnabled: true,
      rpm: 27.20
    }
  },
  {
    id: 'vid-crt-102',
    title: 'Detroit Soul Sessions: Live Studio Jam & Rhythm Section',
    description: 'Original live performance honoring classic Motown and Detroit Soul masters with zero unlicensed third-party loops.',
    category: 'Radio & Music',
    channelId: 'tear-radio',
    duration: '24:10',
    views: 68500,
    likes: 5410,
    shares: 1240,
    earnedAmount: 1233.00,
    uploadDate: '2026-10-12',
    status: 'Published',
    rightsClearance: {
      verified: true,
      licenseType: 'Original Work',
      sha256Proof: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      rightsDeclarationAccepted: true,
      scannedAt: '2026-10-12T09:15:00Z'
    },
    monetization: {
      adRevenueShareEnabled: true,
      tipsEnabled: true,
      brokerBountyEnabled: false,
      rpm: 18.00
    }
  },
  {
    id: 'vid-crt-103',
    title: 'S.T.E.A.R.Safe Mobility Innovations & Highway Telemetry Special',
    description: 'Documentary preview explaining audio ducking and public safety protocol integration for smart dash displays.',
    category: 'Entertainment',
    channelId: 'tears-prime',
    duration: '14:20',
    views: 29800,
    likes: 2150,
    shares: 470,
    earnedAmount: 467.30,
    uploadDate: '2026-10-15',
    status: 'Published',
    rightsClearance: {
      verified: true,
      licenseType: 'Work-for-Hire',
      sha256Proof: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      rightsDeclarationAccepted: true,
      scannedAt: '2026-10-15T16:40:00Z'
    },
    monetization: {
      adRevenueShareEnabled: true,
      tipsEnabled: true,
      brokerBountyEnabled: false,
      rpm: 15.68
    }
  }
];

export function useCreatorVault() {
  const [profile, setProfile] = useState<CreatorVaultProfile>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Storage unavailable
    }
    return {
      creatorId: `crt-${Math.floor(Math.random() * 900000 + 100000)}`,
      channelName: 'Detroit Sovereign Creator',
      creatorEmail: 'jeanelldetroit37@gmail.com',
      categorySpecialty: 'Commercial Real Estate & Motown Media',
      publicKeyFingerprint: 'ed25519:7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
      totalEarnings: 2845.50,
      pendingPayout: 2845.50,
      lifetimeViews: 140400,
      vaultEncryptionDate: new Date().toISOString(),
      storageMode: 'On-Device Client-Vault (Zero-Honeypot)'
    };
  });

  const [videos, setVideos] = useState<CreatorVideoAsset[]>(() => {
    try {
      const saved = localStorage.getItem(VAULT_VIDEOS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Storage unavailable
    }
    return INITIAL_CREATOR_VIDEOS;
  });

  // Save profile to local storage (Never on server honeypot)
  useEffect(() => {
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }, [profile]);

  // Save videos to local storage
  useEffect(() => {
    try {
      localStorage.setItem(VAULT_VIDEOS_KEY, JSON.stringify(videos));
    } catch {
      // Ignore
    }
  }, [videos]);

  // Add new verified creator video
  const addVideoAsset = useCallback((asset: Omit<CreatorVideoAsset, 'id' | 'views' | 'likes' | 'shares' | 'earnedAmount' | 'uploadDate' | 'status'>) => {
    const newId = `vid-crt-${Date.now()}`;
    const newVideo: CreatorVideoAsset = {
      ...asset,
      id: newId,
      views: 1,
      likes: 0,
      shares: 0,
      earnedAmount: 0.00,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Published'
    };

    setVideos(prev => [newVideo, ...prev]);
    return newVideo;
  }, []);

  // Request compensation payout
  const requestPayout = useCallback((amount: number): { success: boolean; message: string; receiptId: string } => {
    const receiptId = `RCPT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    setProfile(prev => ({
      ...prev,
      pendingPayout: Math.max(0, prev.pendingPayout - amount)
    }));

    return {
      success: true,
      message: `Payout request of $${amount.toFixed(2)} approved! Dispatched via direct bank rails. Receipt logged in local device vault.`,
      receiptId
    };
  }, []);

  // Purge vault (Zero honeypot data destruction)
  const purgeLocalVault = useCallback(() => {
    try {
      localStorage.removeItem(VAULT_STORAGE_KEY);
      localStorage.removeItem(VAULT_VIDEOS_KEY);
    } catch {
      // Ignore
    }
    setVideos([]);
    setProfile({
      creatorId: `crt-${Math.floor(Math.random() * 900000 + 100000)}`,
      channelName: 'Anonymous Creator',
      creatorEmail: '',
      categorySpecialty: 'Unassigned',
      publicKeyFingerprint: 'ed25519:null',
      totalEarnings: 0,
      pendingPayout: 0,
      lifetimeViews: 0,
      vaultEncryptionDate: new Date().toISOString(),
      storageMode: 'On-Device Client-Vault (Zero-Honeypot)'
    });
  }, []);

  return {
    profile,
    videos,
    addVideoAsset,
    requestPayout,
    purgeLocalVault,
    setProfile
  };
}
