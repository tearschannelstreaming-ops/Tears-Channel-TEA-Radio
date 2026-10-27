import { useState, useEffect, useMemo, useCallback } from 'react';
import { CreatorVerificationItem, VerificationStats, GovernmentIdType, CreatorCategory, BiometricVerificationRecord } from '../types';

const REGISTRY_STORAGE_KEY = 'tears_creator_verifications_registry_v2';

const INITIAL_CREATORS: CreatorVerificationItem[] = [
  {
    id: 'creator-bio-001',
    creatorName: 'Jeanell Land',
    creatorHandle: '@jeanell.founder',
    channelOrBandName: 'T.E.A.R.S. Channel Prime & Broadcast Network',
    avatarColor: 'from-amber-500 to-rose-600',
    creatorCategory: 'Broadcast & TV Host',
    idType: "Driver's License",
    jurisdiction: 'State of Michigan (SOS)',
    documentNumberMasked: 'M948-***-***-892',
    status: 'successful',
    submittedAt: '2026-10-18T14:10:00Z',
    verifiedAt: '2026-10-18T16:24:00Z',
    faceMatchScore: 99.6,
    facialLandmarksCount: 468,
    antiSpoofProof: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    cryptographicToken: 'ed25519:verif:9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
    zeroHoneypotCompliant: true,
    notes: 'Platform Founder & Executive Director. Sovereign identity verified.'
  },
  {
    id: 'creator-bio-002',
    creatorName: 'Marcus "Detroit 808" Vance',
    creatorHandle: '@marcus.beats',
    channelOrBandName: 'Motor City Soul Trax / T.E.A.R.adio Live',
    avatarColor: 'from-cyan-500 to-blue-600',
    creatorCategory: 'Musician & Producer',
    idType: "Driver's License",
    jurisdiction: 'State of Michigan (SOS)',
    documentNumberMasked: 'V321-***-***-504',
    status: 'successful',
    submittedAt: '2026-10-19T09:15:00Z',
    verifiedAt: '2026-10-19T09:22:00Z',
    faceMatchScore: 99.2,
    facialLandmarksCount: 468,
    antiSpoofProof: 'sha256:3a91b4c718e0df627192bc51610488ae82138a0bc7f98d1a1040854cb0309912',
    cryptographicToken: 'ed25519:verif:3189fa08be04719acb091f04184a8bc100418ab2',
    zeroHoneypotCompliant: true,
    notes: 'Signed royalty split sheets for 14 on-air tracks.'
  },
  {
    id: 'creator-bio-003',
    creatorName: 'Elena Rostova',
    creatorHandle: '@elena.piano',
    channelOrBandName: 'Sovereign Classical Orchestra & Soundscapes',
    avatarColor: 'from-purple-500 to-indigo-600',
    creatorCategory: 'Musician & Producer',
    idType: 'Passport',
    jurisdiction: 'United States Department of State',
    documentNumberMasked: 'P892-***-***-114',
    status: 'successful',
    submittedAt: '2026-10-19T11:40:00Z',
    verifiedAt: '2026-10-19T11:47:00Z',
    faceMatchScore: 98.9,
    facialLandmarksCount: 468,
    antiSpoofProof: 'sha256:49c18d09aa75e019f5647a90b41c0982390abdf167389140afc8291040ab5921',
    cryptographicToken: 'ed25519:verif:7719ab00129cf82901aab9041289cf00129abb52',
    zeroHoneypotCompliant: true,
    notes: 'Verified via e-Passport biometric NFC & 3D facial depth.'
  },
  {
    id: 'creator-bio-004',
    creatorName: 'David Washington',
    creatorHandle: '@dwashington.live',
    channelOrBandName: 'Urban Economic Spotlight Broadcast',
    avatarColor: 'from-emerald-500 to-teal-600',
    creatorCategory: 'Broadcast & TV Host',
    idType: 'State ID',
    jurisdiction: 'State of Illinois (SOS)',
    documentNumberMasked: 'W104-***-***-882',
    status: 'pending',
    submittedAt: '2026-10-20T08:30:00Z',
    pendingReason: 'Awaiting 3D Face Mesh Scan',
    zeroHoneypotCompliant: true,
    notes: 'Front/back state ID scanned. Liveness facial turn challenge queued.'
  },
  {
    id: 'creator-bio-005',
    creatorName: 'Kwame Adeyemi',
    creatorHandle: '@kwame.groove',
    channelOrBandName: 'Afrobeat Horizon & Global Rhythms',
    avatarColor: 'from-orange-500 to-amber-600',
    creatorCategory: 'Musician & Producer',
    idType: 'Passport',
    jurisdiction: 'Republic of Ghana / Consular Services',
    documentNumberMasked: 'G192-***-***-902',
    status: 'successful',
    submittedAt: '2026-10-19T18:05:00Z',
    verifiedAt: '2026-10-19T18:14:00Z',
    faceMatchScore: 99.5,
    facialLandmarksCount: 468,
    antiSpoofProof: 'sha256:88192a01948ba1048bca91048bc819039ab184910cf91048ab09184ba0194812',
    cryptographicToken: 'ed25519:verif:88102fa09194bc10938ab01924bce09148bc8190',
    zeroHoneypotCompliant: true,
    notes: 'International creator verification with DSP distribution queue approved.'
  },
  {
    id: 'creator-bio-006',
    creatorName: 'Sarah Jenkins',
    creatorHandle: '@sarah.films',
    channelOrBandName: 'Great Lakes Independent Cinema Guild',
    avatarColor: 'from-rose-500 to-pink-600',
    creatorCategory: 'Independent Filmmaker',
    idType: "Driver's License",
    jurisdiction: 'State of Ohio (BMV)',
    documentNumberMasked: 'J519-***-***-330',
    status: 'pending',
    submittedAt: '2026-10-20T11:20:00Z',
    pendingReason: 'Government ID OCR Processing',
    zeroHoneypotCompliant: true,
    notes: 'Camera scan submitted; local WebAssembly OCR validating expiration date.'
  },
  {
    id: 'creator-bio-007',
    creatorName: 'Maya Lin',
    creatorHandle: '@mayalin.investigates',
    channelOrBandName: 'Sovereign Truth Podcast & Civic Ledger',
    avatarColor: 'from-violet-500 to-fuchsia-600',
    creatorCategory: 'Podcaster & Journalist',
    idType: 'State ID',
    jurisdiction: 'State of California (DMV)',
    documentNumberMasked: 'C810-***-***-492',
    status: 'pending',
    submittedAt: '2026-10-20T14:45:00Z',
    pendingReason: 'Liveness Challenge Review',
    zeroHoneypotCompliant: true,
    notes: 'Blink challenge confirmed, awaiting 30-degree lateral head turn confirmation.'
  },
  {
    id: 'creator-bio-008',
    creatorName: 'Carlos & Sofia Mendez',
    creatorHandle: '@mendez.realestate',
    channelOrBandName: 'Metropolitan Land Assemblage & Housing TV',
    avatarColor: 'from-emerald-600 to-teal-700',
    creatorCategory: 'Real Estate Syndicator',
    idType: "Driver's License",
    jurisdiction: 'State of Texas (DPS)',
    documentNumberMasked: 'M670-***-***-209',
    status: 'successful',
    submittedAt: '2026-10-18T19:30:00Z',
    verifiedAt: '2026-10-18T19:38:00Z',
    faceMatchScore: 99.3,
    facialLandmarksCount: 468,
    antiSpoofProof: 'sha256:104928ab01928bc01948bca19048bac901924b1049cba01948bac019248bca19',
    cryptographicToken: 'ed25519:verif:991048bca01948bc10948bca01924bca01924810',
    zeroHoneypotCompliant: true,
    notes: 'Verified for 5-parcel commercial land assemblage live streams.'
  },
  {
    id: 'creator-bio-009',
    creatorName: 'Trevor "T-Ray" Brooks',
    creatorHandle: '@tray.motown',
    channelOrBandName: 'New Motown Underground & Soul Sessions',
    avatarColor: 'from-blue-600 to-cyan-700',
    creatorCategory: 'Musician & Producer',
    idType: "Driver's License",
    jurisdiction: 'State of Michigan (SOS)',
    documentNumberMasked: 'B441-***-***-119',
    status: 'successful',
    submittedAt: '2026-10-19T21:10:00Z',
    verifiedAt: '2026-10-19T21:17:00Z',
    faceMatchScore: 99.7,
    facialLandmarksCount: 468,
    antiSpoofProof: 'sha256:5501948bca019284ba01948bac019248bca01948bac019248bca19048bac1928',
    cryptographicToken: 'ed25519:verif:44019248bca01948bac019248bca19048bac01924810',
    zeroHoneypotCompliant: true,
    notes: 'EP release verified for simultaneous T.E.A.R.adio and Spotify dispatch.'
  },
  {
    id: 'creator-bio-010',
    creatorName: 'Amara Kalu',
    creatorHandle: '@amara.documentary',
    channelOrBandName: 'Heritage Preservation & Oral Histories TV',
    avatarColor: 'from-amber-600 to-yellow-600',
    creatorCategory: 'Independent Filmmaker',
    idType: 'Passport',
    jurisdiction: 'United States Department of State',
    documentNumberMasked: 'P703-***-***-841',
    status: 'pending',
    submittedAt: '2026-10-20T16:00:00Z',
    pendingReason: 'MRZ Barcode Validation',
    zeroHoneypotCompliant: true,
    notes: 'Client-side OCR extracted machine-readable zone, calculating check digits.'
  }
];

export function useCreatorVerificationRegistry(userRecord?: BiometricVerificationRecord | null) {
  const [creators, setCreators] = useState<CreatorVerificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(REGISTRY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CREATORS;
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(creators));
    } catch {}
  }, [creators]);

  // Synchronize with active user biometric record if verified
  useEffect(() => {
    if (!userRecord || !userRecord.fullName) return;

    setCreators((prev) => {
      const existingIdx = prev.findIndex((c) => c.creatorName.toLowerCase() === userRecord.fullName.toLowerCase());
      const isVerified = userRecord.status === 'Verified Sovereign Identity';
      
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          idType: userRecord.idType,
          jurisdiction: userRecord.issuingStateOrCountry,
          documentNumberMasked: userRecord.documentNumberMasked,
          status: isVerified ? 'successful' : 'pending',
          verifiedAt: isVerified ? userRecord.verifiedAt : undefined,
          faceMatchScore: isVerified ? userRecord.faceMatchScore : undefined,
          facialLandmarksCount: userRecord.facialLandmarksCount,
          antiSpoofProof: userRecord.antiSpoofProof,
          cryptographicToken: userRecord.cryptographicToken,
          pendingReason: isVerified ? undefined : 'Awaiting 3D Face Mesh Scan'
        };
        return updated;
      }
      return prev;
    });
  }, [userRecord]);

  // Compute Statistics of Successful versus Pending Verifications
  const stats: VerificationStats = useMemo(() => {
    const total = creators.length;
    const successful = creators.filter((c) => c.status === 'successful').length;
    const pending = creators.filter((c) => c.status === 'pending').length;

    const successRate = total > 0 ? Math.round((successful / total) * 1000) / 10 : 0;
    const pendingRate = total > 0 ? Math.round((pending / total) * 1000) / 10 : 0;

    const scores = creators
      .filter((c) => c.status === 'successful' && typeof c.faceMatchScore === 'number')
      .map((c) => c.faceMatchScore as number);
    const avgMatchScore = scores.length > 0 
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 
      : 99.2;

    const byDocType: Record<GovernmentIdType, { successful: number; pending: number; total: number }> = {
      "Driver's License": { successful: 0, pending: 0, total: 0 },
      'Passport': { successful: 0, pending: 0, total: 0 },
      'State ID': { successful: 0, pending: 0, total: 0 }
    };

    creators.forEach((c) => {
      if (!byDocType[c.idType]) {
        byDocType[c.idType] = { successful: 0, pending: 0, total: 0 };
      }
      byDocType[c.idType].total += 1;
      if (c.status === 'successful') {
        byDocType[c.idType].successful += 1;
      } else {
        byDocType[c.idType].pending += 1;
      }
    });

    const defaultCategories: CreatorCategory[] = [
      'Musician & Producer',
      'Broadcast & TV Host',
      'Independent Filmmaker',
      'Podcaster & Journalist',
      'Real Estate Syndicator'
    ];

    const byCategory: Record<CreatorCategory, { successful: number; pending: number; total: number }> = defaultCategories.reduce((acc, cat) => {
      acc[cat] = { successful: 0, pending: 0, total: 0 };
      return acc;
    }, {} as Record<CreatorCategory, { successful: number; pending: number; total: number }>);

    creators.forEach((c) => {
      if (!byCategory[c.creatorCategory]) {
        byCategory[c.creatorCategory] = { successful: 0, pending: 0, total: 0 };
      }
      byCategory[c.creatorCategory].total += 1;
      if (c.status === 'successful') {
        byCategory[c.creatorCategory].successful += 1;
      } else {
        byCategory[c.creatorCategory].pending += 1;
      }
    });

    return {
      total,
      successful,
      pending,
      successRate,
      pendingRate,
      avgMatchScore,
      byDocType,
      byCategory
    };
  }, [creators]);

  // Action: Verify a pending creator (simulate high-fidelity liveness pass)
  const verifyCreator = useCallback((creatorId: string) => {
    setCreators((prev) =>
      prev.map((c) => {
        if (c.id !== creatorId) return c;
        const randomToken = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const randomAntiSpoof = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const score = Math.round((98.5 + Math.random() * 1.4) * 10) / 10;

        return {
          ...c,
          status: 'successful' as const,
          verifiedAt: new Date().toISOString(),
          faceMatchScore: score,
          facialLandmarksCount: 468,
          antiSpoofProof: `sha256:${randomAntiSpoof}`,
          cryptographicToken: `ed25519:verif:${randomToken}`,
          pendingReason: undefined,
          notes: 'Biometric 3D face mesh scan verified on local device hardware enclave.'
        };
      })
    );
  }, []);

  // Action: Mark creator as pending (for testing workflow)
  const markCreatorPending = useCallback((creatorId: string, reason?: CreatorVerificationItem['pendingReason']) => {
    setCreators((prev) =>
      prev.map((c) => {
        if (c.id !== creatorId) return c;
        return {
          ...c,
          status: 'pending' as const,
          pendingReason: reason || 'Awaiting 3D Face Mesh Scan',
          verifiedAt: undefined,
          faceMatchScore: undefined,
          notes: 'Re-verification requested by creator.'
        };
      })
    );
  }, []);

  // Action: Add a new creator record
  const addCreator = useCallback((newCreator: Omit<CreatorVerificationItem, 'id' | 'submittedAt'>) => {
    const item: CreatorVerificationItem = {
      ...newCreator,
      id: `creator-bio-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    setCreators((prev) => [item, ...prev]);
  }, []);

  // Action: Delete a creator
  const removeCreator = useCallback((creatorId: string) => {
    setCreators((prev) => prev.filter((c) => c.id !== creatorId));
  }, []);

  // Action: Reset to defaults
  const resetToDefaults = useCallback(() => {
    setCreators(INITIAL_CREATORS);
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(INITIAL_CREATORS));
  }, []);

  return {
    creators,
    stats,
    verifyCreator,
    markCreatorPending,
    addCreator,
    removeCreator,
    resetToDefaults
  };
}
