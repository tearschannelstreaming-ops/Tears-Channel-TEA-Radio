export type ChannelId = 'tears-prime' | 'real-estate-tv' | 'tear-radio' | 'business-spotlight';

export type FavoriteChannelMap = Record<ChannelId, boolean>;

export interface ChannelFavoriteState {
  favorites: ChannelId[];
  isFavorite: (channelId: ChannelId) => boolean;
  toggleFavorite: (channelId: ChannelId) => void;
  clearFavorites: () => void;
}

export interface Channel {
  id: ChannelId;
  number: string;
  name: string;
  tagline: string;
  genre: string;
  nowPlaying: string;
  currentHost: string;
  resolution: string;
  isFavorite?: boolean;
}

export interface ProgramSchedule {
  id: string;
  channelId: ChannelId;
  timeSlot: string; // e.g. "08:00 AM - 10:00 AM"
  startTime: string;
  endTime: string;
  title: string;
  category: 'Entertainment' | 'Real Estate' | 'Radio & Music' | 'Business & News';
  host: string;
  description: string;
  isLiveNow?: boolean;
}

export interface VodItem {
  id: string;
  title: string;
  rawFilename?: string;
  correctedFromError?: string;
  wasDuplicate?: boolean;
  duplicateCount?: number;
  category: 'Entertainment' | 'Real Estate' | 'Advertisements' | 'T.E.A.R.adio' | 'Action' | 'Children' | 'Educational' | 'Religious' | 'Soul & Motown';
  genre?: string;
  duration: string;
  views: string;
  date: string;
  description: string;
  gradient: string;
  badge: string;
  featured?: boolean;
  screenshotRef?: string;
  artworkUrl?: string;
}

export interface RealEstateListing {
  id: string;
  title: string;
  location: string;
  type: 'Commercial Land' | 'Residential Development' | 'Mixed-Use Parcel' | 'Industrial Flex';
  price: string;
  size: string; // e.g. "2.4 Acres" or "12,500 Sq Ft"
  zoning: string; // e.g. "B4 Commercial"
  highlights: string[];
  description: string;
  broker: string;
  featured: boolean;
  status: 'Available' | 'Pending Due Diligence' | 'Under Contract';
}

export interface AdPackage {
  id: string;
  name: string;
  duration: string;
  frequency: string;
  platforms: string[];
  priceEst: string;
  description: string;
  bestFor: string;
}

export interface DeveloperPlatformLink {
  id: string;
  platform: 'Universal Web PWA' | 'Apple iOS & iPadOS' | 'Roku TV' | 'Apple TV (tvOS)' | 'Amazon Fire TV' | 'Android TV & Google Play' | 'Samsung Tizen & LG webOS' | 'Universal Deep Linking';
  badge: string;
  status: 'Production Live' | 'Ready to Deploy' | 'Developer Testing' | 'Active Store Link';
  appIdOrBundle: string;
  storeUrl?: string;
  devPortalUrl: string;
  sdkOrDoc: string;
  quickInstructions: string[];
  configSnippet?: string;
}

export interface ChannelSettings {
  app_name: string;
  enableSSAI: boolean;
  disabledMenus: string[];
  donation_link: string;
  banner_button_text: string;
  disable_mobile_fab: boolean;
  disable_mobile_tabs: boolean;
  disable_mobile_banners: boolean;
  disable_mobile_videojs: boolean;
  disable_mobile_ads_live: boolean;
  disable_mobile_ads_video: boolean;
  disable_mobile_login_wall: boolean;
  disable_mobile_guest_login: boolean;
  disable_mobile_ads_featured: boolean;
  disable_subscription_mobile: boolean;
  disable_mobile_live_autoplay: boolean;
  disable_mobile_search_genres: boolean;
  disable_mobile_upgrade_button: boolean;
  disable_mobile_scheduled_playlist: boolean;
  disable_subscription_buttons_mobile: boolean;
}

export type ProductionExpenseCategory = 
  | 'Filming Gear & Camera'
  | 'Drone & Aerial Surveys'
  | 'Studio & Location Rental'
  | 'Post-Production & Software'
  | 'Talent, Crew & Wages'
  | 'Music Licensing & Sound'
  | 'Travel, Mileage & Location Meals'
  | 'Insurance & Legal Fees'
  | 'Marketing & Distribution';

export interface ProductionExpenseItem {
  id: string;
  date: string;
  category: ProductionExpenseCategory;
  title: string;
  vendor: string;
  amount: number;
  deductiblePercent: number; // 100 or 50 for meals
  associatedVideoTitle?: string;
  receiptFilename?: string;
  receiptShaProof?: string;
  irsScheduleCLine: string; // e.g. "Line 13 (Depreciation)", "Line 20 (Rent)", "Line 24 (Travel)", "Line 26 (Wages)"
  notes?: string;
}

export interface CreatorTaxProfile {
  legalName: string;
  businessEntity: 'Individual / Sole Proprietor' | 'Single-Member LLC' | 'Multi-Member LLC' | 'S-Corporation' | 'C-Corporation';
  taxIdType: 'SSN' | 'EIN';
  taxId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  w9Certified: boolean;
  w9CertifiedDate: string;
}

export interface DistributionPaymentRecord {
  id: string;
  date: string;
  taxYear: number;
  grossAmount: number;
  payoutRail: 'ACH Direct Deposit' | 'Stripe Connect' | 'USDC Crypto' | 'Bank Wire';
  box1NonemployeeComp: number;
  box2Royalties: number;
  tipsAndBounties: number;
  federalTaxWithheld: number;
  stateTaxWithheld: number;
  receiptId: string;
  memo: string;
}

export type GovernmentIdType = 'State ID' | 'Passport' | "Driver's License";

export interface BiometricVerificationRecord {
  id: string;
  idType: GovernmentIdType;
  fullName: string;
  documentNumberMasked: string;
  issuingStateOrCountry: string;
  dateOfBirthMasked: string;
  expirationDate: string;
  faceMatchScore: number; // e.g. 99.4
  livenessPassed: boolean;
  eyeBlinkConfirmed: boolean;
  facialLandmarksCount: number; // e.g. 468 3D landmarks
  antiSpoofProof: string;
  cryptographicToken: string;
  verifiedAt: string;
  status: 'Verified Sovereign Identity' | 'Verification Pending' | 'Failed Match';
  zeroHoneypotStorage: 'Client Device Hardware Vault Only';
}

export type CreatorCategory =
  | 'Musician & Producer'
  | 'Broadcast & TV Host'
  | 'Independent Filmmaker'
  | 'Podcaster & Journalist'
  | 'Real Estate Syndicator';

export interface CreatorVerificationItem {
  id: string;
  creatorName: string;
  creatorHandle: string;
  channelOrBandName: string;
  avatarColor: string;
  creatorCategory: CreatorCategory;
  idType: GovernmentIdType;
  jurisdiction: string;
  documentNumberMasked: string;
  status: 'successful' | 'pending';
  submittedAt: string;
  verifiedAt?: string;
  faceMatchScore?: number;
  facialLandmarksCount?: number;
  antiSpoofProof?: string;
  cryptographicToken?: string;
  pendingReason?: 'Awaiting 3D Face Mesh Scan' | 'Government ID OCR Processing' | 'Liveness Challenge Review' | 'MRZ Barcode Validation';
  zeroHoneypotCompliant: boolean;
  notes?: string;
}

export interface VerificationStats {
  total: number;
  successful: number;
  pending: number;
  successRate: number; // e.g. 85.7
  pendingRate: number; // e.g. 14.3
  avgMatchScore: number; // e.g. 99.3%
  byDocType: Record<GovernmentIdType, { successful: number; pending: number; total: number }>;
  byCategory: Record<CreatorCategory, { successful: number; pending: number; total: number }>;
}

export interface AudioTrackRelease {
  id: string;
  title: string;
  artist: string;
  featuredArtists?: string;
  albumOrSingle: 'Single' | 'EP' | 'Album';
  genre: 'Detroit Soul & Motown' | 'Urban R&B' | 'Smooth Jazz' | 'Hip-Hop & Trap' | 'Gospel' | 'Instrumental & Score' | 'Electronic / House';
  bpm: number;
  musicalKey: string;
  explicit: boolean;
  isrc: string; // e.g. "US-TEA-26-00101"
  upc: string; // e.g. "859781290192"
  releaseDate: string;
  duration: string; // e.g. "03:45"
  audioFileName: string;
  audioUrl?: string;
  artworkGradient: string;
  artworkUrl?: string;
  streamCount: number;
  tearRadioAirplayActive: boolean;
  dspDistributions: {
    spotify: 'Live & Streaming' | 'Delivered' | 'Queued';
    appleMusic: 'Live & Streaming' | 'Delivered' | 'Queued';
    amazonMusic: 'Live & Streaming' | 'Delivered' | 'Queued';
    tidal: 'Live & Streaming' | 'Delivered' | 'Queued';
    youtubeMusic: 'Live & Streaming' | 'Delivered' | 'Queued';
  };
  royaltySplits: {
    songwriter: number;
    producer: number;
    vocalist: number;
    publisher: number;
  };
  totalRoyaltiesEarned: number;
}

export type SocialPlatform = 'T.E.A.R.S.afe' | 'Facebook' | 'Instagram' | 'X (Twitter)' | 'LinkedIn' | 'WhatsApp' | 'Telegram';

export interface TearSafeSocialPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorRole: string;
  avatarGradient: string;
  timestamp: string;
  content: string;
  mediaType: 'live_broadcast' | 'video_clip' | 'real_estate_tour' | 'audio_track' | 'announcement';
  mediaTitle?: string;
  mediaChannelId?: string;
  mediaUrl?: string;
  likes: number;
  reposts: number;
  commentsCount: number;
  crossPostedPlatforms: SocialPlatform[];
  verified: boolean;
  hashtags: string[];
}

export interface SharePayload {
  title: string;
  text: string;
  url: string;
  category?: string;
  imageUrl?: string;
  hashtags?: string[];
  channelId?: string;
}

export type AppointmentCategory =
  | 'Medical & Doctor'
  | 'Legal & Court / Deposition'
  | 'Creator Shoot & Filming'
  | 'Tax & Financial Review'
  | 'Broadcast Interview / Show'
  | 'Family & Personal Commitment'
  | 'Business / Work Meeting';

export type NotificationChannel =
  | 'audio_chime'
  | 'browser_push'
  | 'screen_hud'
  | 'auto_pause'
  | 'haptic_vibration';

export type NotificationDisplayMode =
  | 'floating_banner'
  | 'glow_border'
  | 'modal_takeover'
  | 'subtle_badge';

export type NotificationFrequency =
  | 'at_time'
  | '5_min_before'
  | '15_min_before'
  | '30_min_before'
  | '60_min_before'
  | 'staggered_series'
  | 'repeating_snooze';

export interface ViewerNotificationPreferences {
  enabledChannels: NotificationChannel[];
  displayMode: NotificationDisplayMode;
  frequency: NotificationFrequency;
  soundEnabled: boolean;
  volume: number; // 0 to 100
  autoPauseVideoOnAlert: boolean;
  leadTimeMinutes: number; // e.g. 15
}

export interface ViewerAppointment {
  id: string;
  title: string;
  category: AppointmentCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  locationOrLink?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  associatedChannelOrShow?: string;
  completed?: boolean;
  createdAt: string;
}

// ==============================================================
// ALL YOUR NEEDS REALITY LLC & METAVERSE REAL ESTATE TYPES
// ==============================================================

export type AgencyAgreementType = 
  | 'exclusive_seller'
  | 'exclusive_buyer'
  | 'affiliate_co_op';

export interface AgencyAgreement {
  id: string;
  type: AgencyAgreementType;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress?: string;
  propertyAddress?: string;
  askingPrice?: string;
  brokerageName: string; // 'All Your Needs Reality LLC'
  brokerName: string; // 'Jeanell Land, Broker'
  commissionTerms: string;
  metaverseRightsIncluded: boolean;
  signedAt: string;
  signatureHash: string;
  clientSignatureText: string;
  status: 'active' | 'draft';
}

export interface PropertySubmission {
  id: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  propertyAddress: string;
  cityStateZip: string;
  askingPrice: string;
  propertyType: 'Commercial Land' | 'Residential Development' | 'Mixed-Use Parcel' | 'Industrial Flex' | 'Retail / Office';
  size: string;
  zoning: string;
  description: string;
  mediaUrl?: string;
  representationRequested: boolean;
  submittedAt: string;
  status: 'Pending Broker Review' | 'Listed on All Your Needs Reality & TV' | 'Under Contract';
}

export type MetaverseTileType = 
  | 'property'
  | 'chance'
  | 'chest'
  | 'broker_hq'
  | 'tax_savings'
  | 'smart_cash_bonus'
  | 'go_start';

export interface MetaverseTile {
  id: string;
  index: number;
  title: string;
  district: string;
  type: MetaverseTileType;
  priceNum: number;
  priceFormatted: string;
  baseRent: number;
  currentRent: number;
  upgradeLevel: number; // 0 = Raw Land, 1 = Rezoned, 2 = Blueprint, 3 = Commercial Highrise
  color: string;
  ownedByPlayer: boolean;
  videoTourTitle: string;
  videoTourDuration: string;
  adSponsorTitle: string;
  adVideoDuration: string;
  description: string;
}

export interface SmartCashWallet {
  credits: number;
  diceRolls: number;
  maxDice: number;
  lapsCompleted: number;
  totalEarningsUsd: number;
  referralCode: string;
  referredCount: number;
  pendingCommissionsUsd: number;
  affiliateTier: 'Bronze Partner' | 'Silver Broker Affiliate' | 'Gold Master Co-Op' | 'Diamond Principal';
  lastRollTimestamp: number;
}
