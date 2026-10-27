import { useState, useEffect, useCallback } from 'react';
import { 
  MetaverseTile, 
  SmartCashWallet, 
  AgencyAgreement, 
  PropertySubmission, 
  AgencyAgreementType,
  RealEstateListing 
} from '../types';
import { REAL_ESTATE_LISTINGS } from '../data/mockData';

const METAVERSE_STORAGE_KEY = 'tears_metaverse_state_v1';
const AGREEMENTS_STORAGE_KEY = 'tears_agency_agreements_v1';
const SUBMISSIONS_STORAGE_KEY = 'tears_property_submissions_v1';
const WALLET_STORAGE_KEY = 'tears_smart_cash_wallet_v1';

// Initial 16-Tile Real Estate Board inspired by Monopoly GO! & Detroit Commercial Districts
export const INITIAL_METAVERSE_TILES: MetaverseTile[] = [
  {
    id: 'tile-0',
    index: 0,
    title: 'GO · Broker HQ',
    district: 'All Your Needs Reality LLC HQ',
    type: 'go_start',
    priceNum: 0,
    priceFormatted: 'Collect $200',
    baseRent: 200,
    currentRent: 200,
    upgradeLevel: 0,
    color: 'from-amber-500 to-yellow-600',
    ownedByPlayer: true,
    videoTourTitle: 'All Your Needs Reality LLC Brokerage Showcase',
    videoTourDuration: '3 min 20 sec',
    adSponsorTitle: 'All Your Needs Reality LLC — Full-Service Land & Commercial Brokerage',
    adVideoDuration: '15 sec',
    description: 'Start tile and brokerage headquarters directed by Broker Jeanell Land. Collect $200 Smart Cash every lap around the metaverse!'
  },
  {
    id: 'tile-1',
    index: 1,
    title: 'Woodward Commercial Parcel',
    district: 'Woodward Corridor Trade District',
    type: 'property',
    priceNum: 675000,
    priceFormatted: '$675,000',
    baseRent: 50,
    currentRent: 50,
    upgradeLevel: 1,
    color: 'from-cyan-600 to-blue-700',
    ownedByPlayer: false,
    videoTourTitle: 'Woodward 2.85-Acre Commercial Land Drone Aerial Survey',
    videoTourDuration: '4 min 15 sec',
    adSponsorTitle: 'S.T.E.A.R.Safe Technologies Patented Vehicle Alert System',
    adVideoDuration: '12 sec',
    description: '2.85 Acres of B4-zoned commercial land with 34,000+ daily vehicle traffic. Ready for retail or medical facility.'
  },
  {
    id: 'tile-2',
    index: 2,
    title: 'Chance & Zoning Board',
    district: 'Municipal Planning Dept',
    type: 'chance',
    priceNum: 0,
    priceFormatted: 'Mystery Perk',
    baseRent: 0,
    currentRent: 0,
    upgradeLevel: 0,
    color: 'from-purple-600 to-indigo-700',
    ownedByPlayer: false,
    videoTourTitle: 'Detroit Master Plan & Zoning Modernization Briefing',
    videoTourDuration: '2 min 50 sec',
    adSponsorTitle: 'T.E.A.R.S. Channel 24/7 TV Commercial Network',
    adVideoDuration: '10 sec',
    description: 'Draw a Chance card: receive NEZ tax abatements, free dice rolls, or zoning approvals from the city planning commission.'
  },
  {
    id: 'tile-3',
    index: 3,
    title: 'Jefferson East Waterfront',
    district: 'Riverfront Marina District',
    type: 'property',
    priceNum: 485000,
    priceFormatted: '$485,000',
    baseRent: 40,
    currentRent: 40,
    upgradeLevel: 0,
    color: 'from-cyan-600 to-blue-700',
    ownedByPlayer: false,
    videoTourTitle: 'Jefferson Riverfront 1.42-Acre Mixed-Use Site Walk',
    videoTourDuration: '3 min 45 sec',
    adSponsorTitle: 'Smart Cash Real Estate Rewards & Co-Op Network',
    adVideoDuration: '15 sec',
    description: '1.42 Acres walking distance to riverfront marinas and parks. Approved for multi-family residential + ground retail.'
  },
  {
    id: 'tile-4',
    index: 4,
    title: 'Tax Savings Assessment',
    district: 'IRS & Michigan Treasury',
    type: 'tax_savings',
    priceNum: 0,
    priceFormatted: 'Tax Credit +$150',
    baseRent: 150,
    currentRent: 150,
    upgradeLevel: 0,
    color: 'from-emerald-600 to-teal-700',
    ownedByPlayer: false,
    videoTourTitle: 'Commercial Real Estate Cost Segregation Masterclass',
    videoTourDuration: '5 min 10 sec',
    adSponsorTitle: 'Creator Tax Portal & 1099-NEC Expense Ingestion Engine',
    adVideoDuration: '12 sec',
    description: 'Claim your 1031 Exchange and Section 179 depreciation deductions. Earn bonus Smart Cash credits.'
  },
  {
    id: 'tile-5',
    index: 5,
    title: 'Grand River Logistics Flex',
    district: 'Industrial Freight Corridor',
    type: 'property',
    priceNum: 395000,
    priceFormatted: '$395,000',
    baseRent: 35,
    currentRent: 35,
    upgradeLevel: 0,
    color: 'from-orange-600 to-amber-700',
    ownedByPlayer: false,
    videoTourTitle: 'Grand River 3.6-Acre Heavy Industrial Flex Tour',
    videoTourDuration: '3 min 30 sec',
    adSponsorTitle: 'S.T.E.A.R.Safe Clean-Room Vehicle Telemetry System',
    adVideoDuration: '10 sec',
    description: 'M4 Intensive Industrial heavy yard with security perimeter fence and seamless access to I-96 and Southfield freight arteries.'
  },
  {
    id: 'tile-6',
    index: 6,
    title: 'Community Chest',
    district: 'Detroit Land Bank Authority',
    type: 'chest',
    priceNum: 0,
    priceFormatted: 'Grant Vault',
    baseRent: 0,
    currentRent: 0,
    upgradeLevel: 0,
    color: 'from-pink-600 to-rose-700',
    ownedByPlayer: false,
    videoTourTitle: 'Neighborhood Enterprise & Urban Equity Showcase',
    videoTourDuration: '2 min 40 sec',
    adSponsorTitle: 'All Your Needs Reality LLC — Community Reinvestment',
    adVideoDuration: '15 sec',
    description: 'Community Chest jackpot: Collect urban development grants, free parcel appraisal vouchers, and marketing bonuses.'
  },
  {
    id: 'tile-7',
    index: 7,
    title: 'Boston-Edison Infill Assemblage',
    district: 'Historic Architectural Enclave',
    type: 'property',
    priceNum: 180000,
    priceFormatted: '$180,000',
    baseRent: 25,
    currentRent: 25,
    upgradeLevel: 0,
    color: 'from-orange-600 to-amber-700',
    ownedByPlayer: false,
    videoTourTitle: '6-Lot Contiguous Residential Parcel Walking Tour',
    videoTourDuration: '4 min 05 sec',
    adSponsorTitle: 'T.E.A.R.S. Studio CMS & HD Broadcast Network',
    adVideoDuration: '12 sec',
    description: '6 contiguous city lots near historic Boston-Edison. Perfect for luxury duplex or infill residential development.'
  },
  {
    id: 'tile-8',
    index: 8,
    title: 'Free Parking · Drone Pad',
    district: 'Aerial Inspection Zone',
    type: 'smart_cash_bonus',
    priceNum: 0,
    priceFormatted: 'Free Drone Survey',
    baseRent: 100,
    currentRent: 100,
    upgradeLevel: 0,
    color: 'from-violet-600 to-purple-800',
    ownedByPlayer: false,
    videoTourTitle: '4K Drone Aerial Site Survey Methodology with Jeanell Land',
    videoTourDuration: '3 min 15 sec',
    adSponsorTitle: 'All Your Needs Reality LLC Drone Filming Fleet',
    adVideoDuration: '10 sec',
    description: 'Free parking and aerial staging lounge. Relax without rent penalties and recharge your dice energy pool!'
  },
  {
    id: 'tile-9',
    index: 9,
    title: 'Motor City Innovation Corridor',
    district: 'Tech & Mobility Hub',
    type: 'property',
    priceNum: 890000,
    priceFormatted: '$890,000',
    baseRent: 75,
    currentRent: 75,
    upgradeLevel: 0,
    color: 'from-red-600 to-rose-700',
    ownedByPlayer: false,
    videoTourTitle: 'Automotive & EV Research Facility Site Walkthrough',
    videoTourDuration: '5 min 20 sec',
    adSponsorTitle: 'S.T.E.A.R.Safe Mobility Patents & Hardware Display',
    adVideoDuration: '15 sec',
    description: 'Strategic commercial development parcel zoned for EV fleet charging, laboratory research, and robotics testing.'
  },
  {
    id: 'tile-10',
    index: 10,
    title: 'Chance & Tax Credits',
    district: 'Michigan Strategic Fund',
    type: 'chance',
    priceNum: 0,
    priceFormatted: 'Opportunity Zone',
    baseRent: 0,
    currentRent: 0,
    upgradeLevel: 0,
    color: 'from-purple-600 to-indigo-700',
    ownedByPlayer: false,
    videoTourTitle: 'Opportunity Zone Capital Gains Tax Strategy',
    videoTourDuration: '3 min 50 sec',
    adSponsorTitle: 'Smart Cash Co-Op Real Estate Network',
    adVideoDuration: '10 sec',
    description: 'Federal Opportunity Zone tax deferral active! Draw a card to multiply your real estate holdings.'
  },
  {
    id: 'tile-11',
    index: 11,
    title: 'Warren Avenue Commercial Center',
    district: 'Midtown Commercial Sector',
    type: 'property',
    priceNum: 520000,
    priceFormatted: '$520,000',
    baseRent: 45,
    currentRent: 45,
    upgradeLevel: 0,
    color: 'from-red-600 to-rose-700',
    ownedByPlayer: false,
    videoTourTitle: 'Warren Ave Corner Lot Commercial Walkthrough',
    videoTourDuration: '3 min 10 sec',
    adSponsorTitle: 'All Your Needs Reality LLC — Jeanell Land Brokerage',
    adVideoDuration: '12 sec',
    description: 'Prime signalized intersection corner parcel. Ideal for commercial bank, quick-serve retail, or medical pharmacy.'
  },
  {
    id: 'tile-12',
    index: 12,
    title: 'Smart Cash Rewards Depot',
    district: 'Affiliate Payout Hub',
    type: 'smart_cash_bonus',
    priceNum: 0,
    priceFormatted: 'Cash Bounty +$250',
    baseRent: 250,
    currentRent: 250,
    upgradeLevel: 0,
    color: 'from-emerald-500 to-green-600',
    ownedByPlayer: false,
    videoTourTitle: 'How to Earn 25% Co-Op Broker Fees with All Your Needs Reality LLC',
    videoTourDuration: '4 min 15 sec',
    adSponsorTitle: 'Smart Cash Real Estate Offerwall & Player Bounties',
    adVideoDuration: '15 sec',
    description: 'Instant cash bounty! Claim affiliate credits and learn how to refer buyers and sellers for 25% broker co-op payouts.'
  },
  {
    id: 'tile-13',
    index: 13,
    title: 'Griswold Financial Tower Parcel',
    district: 'Downtown Financial Core',
    type: 'property',
    priceNum: 1250000,
    priceFormatted: '$1,250,000',
    baseRent: 110,
    currentRent: 110,
    upgradeLevel: 0,
    color: 'from-blue-700 to-indigo-900',
    ownedByPlayer: false,
    videoTourTitle: 'Griswold High-Density Infill Parcel Architectural Tour',
    videoTourDuration: '4 min 45 sec',
    adSponsorTitle: 'T.E.A.R.S. Channel Primetime Television Network',
    adVideoDuration: '15 sec',
    description: 'Prestige downtown Detroit parcel with high-density vertical air rights. The pinnacle property on the board!'
  },
  {
    id: 'tile-14',
    index: 14,
    title: 'Title & Escrow Clearance',
    district: 'Wayne County Register of Deeds',
    type: 'chest',
    priceNum: 0,
    priceFormatted: 'Clean Deed',
    baseRent: 0,
    currentRent: 0,
    upgradeLevel: 0,
    color: 'from-pink-600 to-rose-700',
    ownedByPlayer: false,
    videoTourTitle: 'Title Insurance & Clean Deed Closing Guide',
    videoTourDuration: '3 min 00 sec',
    adSponsorTitle: 'All Your Needs Reality LLC — Secure Escrow Services',
    adVideoDuration: '10 sec',
    description: 'Warranty deed verified and title insurance issued. Collect a $100 escrow closing bonus.'
  },
  {
    id: 'tile-15',
    index: 15,
    title: 'Campus Martius Sovereign Parcel',
    district: 'Downtown Central Square',
    type: 'property',
    priceNum: 1450000,
    priceFormatted: '$1,450,000',
    baseRent: 135,
    currentRent: 135,
    upgradeLevel: 0,
    color: 'from-blue-700 to-indigo-900',
    ownedByPlayer: false,
    videoTourTitle: 'Campus Martius Prime Commercial Showcase',
    videoTourDuration: '5 min 00 sec',
    adSponsorTitle: 'All Your Needs Reality LLC — Premier Representation',
    adVideoDuration: '15 sec',
    description: 'World-class civic gathering location. Maximum foot traffic, retail dominance, and generational equity.'
  }
];

export const INITIAL_SMART_CASH_WALLET: SmartCashWallet = {
  credits: 1250,
  diceRolls: 30,
  maxDice: 50,
  lapsCompleted: 0,
  totalEarningsUsd: 185.00,
  referralCode: 'NEEDS-JEANELL-2026',
  referredCount: 4,
  pendingCommissionsUsd: 1425.00,
  affiliateTier: 'Silver Broker Affiliate',
  lastRollTimestamp: Date.now()
};

export const INITIAL_PROPERTY_SUBMISSIONS: PropertySubmission[] = [
  {
    id: 'sub-001',
    ownerName: 'Marcus Vance',
    ownerPhone: '(313) 555-0144',
    ownerEmail: 'marcus.v@motorcityinvest.com',
    propertyAddress: '7840 Michigan Ave',
    cityStateZip: 'Detroit, MI 48210',
    askingPrice: '$325,000',
    propertyType: 'Commercial Land',
    size: '1.8 Acres',
    zoning: 'B4 General Business',
    description: 'High visibility parcel on Michigan Ave. Paved lot with existing curb cut, all utilities, ideal for commercial drive-thru or logistics hub.',
    representationRequested: true,
    submittedAt: '2026-10-18T14:32:00Z',
    status: 'Listed on All Your Needs Reality & TV'
  },
  {
    id: 'sub-002',
    ownerName: 'Elena Rostova',
    ownerPhone: '(248) 555-0182',
    ownerEmail: 'elena@rostovadevelopment.com',
    propertyAddress: '15200 E Jefferson Ave',
    cityStateZip: 'Grosse Pointe Park / Detroit border, MI 48230',
    askingPrice: '$590,000',
    propertyType: 'Mixed-Use Parcel',
    size: '2.1 Acres',
    zoning: 'SD2 Mixed-Use Commercial / Residential',
    description: 'Corner acreage with water view proximity. Shovel-ready with Phase 1 environmental cleared and city council support.',
    representationRequested: true,
    submittedAt: '2026-10-19T09:15:00Z',
    status: 'Listed on All Your Needs Reality & TV'
  }
];

export const INITIAL_AGREEMENTS: AgencyAgreement[] = [
  {
    id: 'agr-default-buyer',
    type: 'exclusive_buyer',
    title: 'Exclusive Buyer Agency Representation Agreement',
    clientName: 'Jeanell Land Sovereign Investor Group',
    clientEmail: 'investor@tearschannel.online',
    clientPhone: '(313) 444-LAND',
    brokerageName: 'All Your Needs Reality LLC',
    brokerName: 'Jeanell Land, Broker',
    commissionTerms: '3% Procuring Cause Broker Co-Op (Seller Paid) or 2.5% Buyer Contribution Credit',
    metaverseRightsIncluded: true,
    signedAt: '2026-10-15T11:00:00Z',
    signatureHash: 'SHA256:8f4c2b991a0c84918e7d23f46a78b5e90c128456',
    clientSignatureText: 'Jeanell Land / Sovereign Authorized Signatory',
    status: 'active'
  }
];

export function useMetaverseRealEstate() {
  const [tiles, setTiles] = useState<MetaverseTile[]>(() => {
    try {
      const saved = localStorage.getItem(METAVERSE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_METAVERSE_TILES;
  });

  const [wallet, setWallet] = useState<SmartCashWallet>(() => {
    try {
      const saved = localStorage.getItem(WALLET_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SMART_CASH_WALLET;
  });

  const [agreements, setAgreements] = useState<AgencyAgreement[]>(() => {
    try {
      const saved = localStorage.getItem(AGREEMENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_AGREEMENTS;
  });

  const [submissions, setSubmissions] = useState<PropertySubmission[]>(() => {
    try {
      const saved = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PROPERTY_SUBMISSIONS;
  });

  const [playerPosition, setPlayerPosition] = useState<number>(0);
  const [isRolling, setIsRolling] = useState(false);
  const [dice, setDice] = useState<[number, number]>([3, 4]);
  const [activeEventMessage, setActiveEventMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(METAVERSE_STORAGE_KEY, JSON.stringify(tiles));
    } catch {}
  }, [tiles]);

  useEffect(() => {
    try {
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
    } catch {}
  }, [wallet]);

  useEffect(() => {
    try {
      localStorage.setItem(AGREEMENTS_STORAGE_KEY, JSON.stringify(agreements));
    } catch {}
  }, [agreements]);

  useEffect(() => {
    try {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
    } catch {}
  }, [submissions]);

  // Dice roll regeneration (e.g., +1 roll every 60 seconds if below maxDice)
  useEffect(() => {
    const timer = setInterval(() => {
      setWallet(prev => {
        if (prev.diceRolls < prev.maxDice) {
          return { ...prev, diceRolls: prev.diceRolls + 1 };
        }
        return prev;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if player has signed either buyer or seller agency agreement
  const hasValidAgencyAgreement = agreements.some(a => a.status === 'active');

  // Sign a new agency agreement
  const signAgreement = useCallback((
    type: AgencyAgreementType,
    clientData: {
      name: string;
      email: string;
      phone: string;
      address?: string;
      propertyAddress?: string;
      askingPrice?: string;
    },
    signatureText: string
  ): AgencyAgreement => {
    const titles = {
      exclusive_seller: 'Exclusive Right to Sell Listing Agreement (All Your Needs Reality LLC)',
      exclusive_buyer: 'Exclusive Buyer Agency Representation Agreement (All Your Needs Reality LLC)',
      affiliate_co_op: 'Real Estate Broker Affiliate & Co-Op Agreement (25% Commission Referral)'
    };

    const terms = {
      exclusive_seller: '6% Total Brokerage Commission (3% Procuring Co-Op) · Full T.E.A.R.S. Channel TV Marketing & Metaverse Digital Twin',
      exclusive_buyer: '3% Co-Op Broker Compensation Paid by Seller / Fiduciary Representation by Jeanell Land, Broker',
      affiliate_co_op: '25% Broker Referral Fee on Closed Land and Commercial Transactions / Instant Smart Cash Bounties'
    };

    const newAgreement: AgencyAgreement = {
      id: `agr-${Date.now()}`,
      type,
      title: titles[type],
      clientName: clientData.name,
      clientEmail: clientData.email,
      clientPhone: clientData.phone,
      clientAddress: clientData.address,
      propertyAddress: clientData.propertyAddress,
      askingPrice: clientData.askingPrice,
      brokerageName: 'All Your Needs Reality LLC',
      brokerName: 'Jeanell Land, Broker',
      commissionTerms: terms[type],
      metaverseRightsIncluded: true,
      signedAt: new Date().toISOString(),
      signatureHash: `SHA256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      clientSignatureText: signatureText,
      status: 'active'
    };

    setAgreements(prev => [newAgreement, ...prev]);
    return newAgreement;
  }, []);

  // Submit property to market through All Your Needs Reality LLC
  const submitPropertyToMarket = useCallback((data: Omit<PropertySubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSubmission: PropertySubmission = {
      ...data,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'Listed on All Your Needs Reality & TV'
    };

    setSubmissions(prev => [newSubmission, ...prev]);

    // Also award Smart Cash for listing property
    setWallet(prev => ({
      ...prev,
      credits: prev.credits + 500,
      diceRolls: Math.min(prev.maxDice, prev.diceRolls + 10),
      totalEarningsUsd: prev.totalEarningsUsd + 25.00
    }));

    return newSubmission;
  }, []);

  // Roll dice and move around the Monopoly-style board
  const rollDice = useCallback(() => {
    if (wallet.diceRolls <= 0 || isRolling) return;

    setIsRolling(true);
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const totalSteps = die1 + die2;

    setDice([die1, die2]);
    setWallet(prev => ({ ...prev, diceRolls: prev.diceRolls - 1 }));

    // Animate move step-by-step
    setTimeout(() => {
      setPlayerPosition(prevPos => {
        const nextPos = (prevPos + totalSteps) % tiles.length;
        const completedLap = prevPos + totalSteps >= tiles.length;

        // Lap bonus (Passing GO)
        if (completedLap) {
          setWallet(w => ({
            ...w,
            credits: w.credits + 200,
            lapsCompleted: w.lapsCompleted + 1,
            totalEarningsUsd: w.totalEarningsUsd + 10.00
          }));
          setActiveEventMessage('🏁 Completed Metaverse Lap! Collected $200 GO Bonus at All Your Needs Reality HQ!');
        }

        const landedTile = tiles[nextPos];

        // Tile landing event
        if (landedTile.type === 'smart_cash_bonus') {
          setWallet(w => ({
            ...w,
            credits: w.credits + 150,
            diceRolls: Math.min(w.maxDice, w.diceRolls + 3),
            totalEarningsUsd: w.totalEarningsUsd + 7.50
          }));
          setActiveEventMessage(`💰 Landed on ${landedTile.title}! Collected +150 Smart Cash Credits & +3 Dice Rolls!`);
        } else if (landedTile.type === 'tax_savings') {
          setWallet(w => ({
            ...w,
            credits: w.credits + 100,
            totalEarningsUsd: w.totalEarningsUsd + 5.00
          }));
          setActiveEventMessage(`📑 Tax Incentive Approved! Collected +100 Credits from Detroit Treasury.`);
        } else if (landedTile.type === 'chance' || landedTile.type === 'chest') {
          const perks = [
            'Commercial Zoning Variance Granted (+120 Credits)',
            'Drone Aerial Video Sponsor Bonus (+5 Dice Rolls)',
            'NEZ Neighborhood Enterprise Tax Abatement (+80 Credits)',
            'All Your Needs Reality LLC Co-Op Referral Inquiry (+150 Credits)'
          ];
          const perk = perks[Math.floor(Math.random() * perks.length)];
          setWallet(w => ({ ...w, credits: w.credits + 100 }));
          setActiveEventMessage(`🎉 Mystery Event: ${perk}!`);
        } else if (landedTile.type === 'property') {
          setActiveEventMessage(`📍 Landed on ${landedTile.title} in ${landedTile.district}! Click to inspect video & upgrade parcel.`);
        }

        setIsRolling(false);
        return nextPos;
      });
    }, 800);
  }, [wallet.diceRolls, isRolling, tiles]);

  // Upgrade property landmark on the board
  const upgradeProperty = useCallback((tileId: string) => {
    const tile = tiles.find(t => t.id === tileId);
    if (!tile || tile.type !== 'property') return false;

    const upgradeCosts = [150, 350, 750, 1500];
    const cost = upgradeCosts[tile.upgradeLevel] || 500;

    if (wallet.credits < cost) return false;

    setWallet(prev => ({
      ...prev,
      credits: prev.credits - cost,
      totalEarningsUsd: prev.totalEarningsUsd + 15.00
    }));

    setTiles(prev => prev.map(t => {
      if (t.id === tileId) {
        const nextLevel = Math.min(3, t.upgradeLevel + 1);
        const rentMultiplier = [1, 2.5, 5, 10][nextLevel];
        return {
          ...t,
          upgradeLevel: nextLevel,
          ownedByPlayer: true,
          currentRent: Math.round(t.baseRent * rentMultiplier)
        };
      }
      return t;
    }));

    setActiveEventMessage(`🏗️ Upgraded ${tile.title} to Level ${tile.upgradeLevel + 1}! Rent increased.`);
    return true;
  }, [tiles, wallet.credits]);

  // Rewarded Video Ad Completion (Mimics Monopoly GO & Smart Cash rewards)
  const completeRewardedAd = useCallback((propertyTitle: string) => {
    setWallet(prev => ({
      ...prev,
      credits: prev.credits + 50,
      diceRolls: Math.min(prev.maxDice, prev.diceRolls + 5),
      totalEarningsUsd: prev.totalEarningsUsd + 2.50
    }));

    setActiveEventMessage(`✨ Watched Sponsor Ad for ${propertyTitle}! Earned +50 Smart Cash Credits & +5 Free Dice Rolls!`);
  }, []);

  return {
    tiles,
    wallet,
    agreements,
    submissions,
    playerPosition,
    isRolling,
    dice,
    activeEventMessage,
    hasValidAgencyAgreement,
    signAgreement,
    submitPropertyToMarket,
    rollDice,
    upgradeProperty,
    completeRewardedAd,
    clearEventMessage: () => setActiveEventMessage(null)
  };
}
