import { Channel, ProgramSchedule, VodItem, RealEstateListing, AdPackage, DeveloperPlatformLink, ChannelSettings } from '../types';

export const CHANNEL_CONFIG: ChannelSettings = {
  app_name: "T.E.A.R.S",
  enableSSAI: false,
  disabledMenus: ["audios", "my-list"],
  donation_link: "https://c.org/nx2fdzbjB7",
  banner_button_text: "More",
  disable_mobile_fab: true,
  disable_mobile_tabs: false,
  disable_mobile_banners: false,
  disable_mobile_videojs: false,
  disable_mobile_ads_live: false,
  disable_mobile_ads_video: false,
  disable_mobile_login_wall: true,
  disable_mobile_guest_login: true,
  disable_mobile_ads_featured: false,
  disable_subscription_mobile: true,
  disable_mobile_live_autoplay: true,
  disable_mobile_search_genres: false,
  disable_mobile_upgrade_button: true,
  disable_mobile_scheduled_playlist: true,
  disable_subscription_buttons_mobile: true
};

export const CHANNELS: Channel[] = [
  {
    id: 'tears-prime',
    number: 'CH 101',
    name: 'T.E.A.R.S. Primetime TV',
    tagline: 'Television, Entertainment & Culture',
    genre: 'General Entertainment',
    nowPlaying: 'A Perfect Murder (2025) — True Crime Mystery',
    currentHost: 'Jeanell Land & Guest Hosts',
    resolution: '4K HDR'
  },
  {
    id: 'real-estate-tv',
    number: 'CH 102',
    name: 'T.E.A.R. Real Estate Network',
    tagline: 'Prime Acreage, Commercial Lots & Urban Equity',
    genre: 'Real Estate & Land',
    nowPlaying: 'Metro Detroit Commercial Land Showcase: Woodward Corridor',
    currentHost: 'Jeanell Land, Licensed Land Broker',
    resolution: '1080p60'
  },
  {
    id: 'tear-radio',
    number: 'CH 103',
    name: 'T.E.A.R.adio 24/7 Live Stream',
    tagline: 'Urban Grooves, Smooth Jazz & Driver Traffic Safety',
    genre: 'Radio & Traffic Dispatch',
    nowPlaying: 'Johnnie Taylor Soul Marathon & Highway Safety Dispatch',
    currentHost: 'DJ Smooth & Dispatch Team',
    resolution: 'Lossless Audio'
  },
  {
    id: 'business-spotlight',
    number: 'CH 104',
    name: 'Advertisement & Business TV',
    tagline: 'Commercial Spotlights & S.T.E.A.R.Safe Innovation',
    genre: 'Commercial & Economy',
    nowPlaying: 'S.T.E.A.R.Safe Technologies & Motor City Enterprise Forum',
    currentHost: 'Marcus Vance, Business Desk',
    resolution: '1080p60'
  }
];

export const SCHEDULE: ProgramSchedule[] = [
  {
    id: 'prog-live-movie',
    channelId: 'tears-prime',
    timeSlot: '04:22 AM - 05:47 AM',
    startTime: '04:22',
    endTime: '05:47',
    title: 'A Perfect Murder (2025) — True Crime Thriller',
    category: 'Entertainment',
    host: 'T.E.A.R.S. Feature Cinema',
    description: 'A suspenseful dramatic feature inspired by true investigations into unsolved cases, spotlighting justice, intrigue, and resilient families.',
    isLiveNow: true
  },
  {
    id: 'prog-upcoming-1',
    channelId: 'tears-prime',
    timeSlot: '05:47 AM - 07:01 AM',
    startTime: '05:47',
    endTime: '07:01',
    title: 'Salt 2: High Stakes Action (Angelina Jolie & Denzel Washington Tribute)',
    category: 'Entertainment',
    host: 'Action Cinema Hour',
    description: 'High-octane espionage action thriller following undercover operatives fighting corruption against international syndicates.'
  },
  {
    id: 'prog-upcoming-2',
    channelId: 'tears-prime',
    timeSlot: '07:01 AM - 08:26 AM',
    startTime: '07:01',
    endTime: '08:26',
    title: 'Someone\'s Offspring (2024) — Mystery & Family Drama',
    category: 'Entertainment',
    host: 'T.E.A.R.S. Morning Theater',
    description: 'An emotional family mystery delving into hidden heritage, maternal devotion, and shocking revelations in a suburban community.'
  },
  {
    id: 'prog-upcoming-3',
    channelId: 'tears-prime',
    timeSlot: '08:26 AM - 09:30 AM',
    startTime: '08:26',
    endTime: '09:30',
    title: 'Claressa Shields: Champion\'s Response & Detroit Legacy',
    category: 'Entertainment',
    host: 'Jeanell Land Sports Desk',
    description: 'Flint and Detroit champion Claressa Shields breaks down historic boxing bouts, overcoming adversity, and giving back to Michigan youth.'
  },
  {
    id: 'prog-radio-1',
    channelId: 'tear-radio',
    timeSlot: '09:30 AM - 12:00 PM',
    startTime: '09:30',
    endTime: '12:00',
    title: 'Johnnie Taylor & Stax Soul Legacy Showcase',
    category: 'Radio & Music',
    host: 'DJ Smooth on T.E.A.R.adio',
    description: 'Celebrating timeless soul music from Stax/Volt records, Johnnie Taylor classics including "Last Two Dollars", "Good Love", and "Soul Heaven".'
  },
  {
    id: 'prog-re-1',
    channelId: 'real-estate-tv',
    timeSlot: '12:00 PM - 02:00 PM',
    startTime: '12:00',
    endTime: '14:00',
    title: 'Detroit Commercial & Residential Land Opportunity Hour',
    category: 'Real Estate',
    host: 'Jeanell Land, CEO & Land Broker',
    description: 'Strategic analysis of prime Detroit parcels, zoning conversions (B4/SD2/M4), and building generational equity through direct land acquisition.'
  }
];

/**
 * Scanned Media Library directly from T.E.A.R.S. Channel screenshots,
 * with error corrections, deduplication, and rich metadata.
 */
export const VOD_ITEMS: VodItem[] = [
  {
    id: 'media-viral-reels',
    title: 'Viral Reels & Community Highlights',
    rawFilename: 'viral_reels_compilation_featured.mp4',
    correctedFromError: 'Extracted from home featured banner; formatted title and added descriptive community summary',
    category: 'Entertainment',
    genre: 'Viral Reels',
    duration: '15 min 20 sec',
    views: '45.8K',
    date: 'Apr 2026',
    description: 'Trending community clips, dance celebrations, entrepreneur shoutouts, and viral moments broadcast on T.E.A.R.S. Channel.',
    gradient: 'from-blue-900 via-indigo-950 to-black',
    badge: 'Featured Banner',
    featured: true,
    screenshotRef: '/app-media/screen1.png'
  },
  {
    id: 'media-jt-last-two-dollars',
    title: 'Johnnie Taylor — Last Two Dollars',
    rawFilename: 'johnnie_taylor_last_two_dollars.mp4',
    correctedFromError: 'Removed raw ".mp4", un-snaked underscores, capitalized proper artist name and song title, restored album "Good Love!" attribution. Deduplicated 2 redundant uploads.',
    wasDuplicate: true,
    duplicateCount: 2,
    category: 'Soul & Motown',
    genre: 'Soul & Motown',
    duration: '5 min 17 sec',
    views: '32.1K',
    date: 'Apr 2026',
    description: 'Classic soulful R&B performance of the legendary hit "Last Two Dollars" from Johnnie Taylor\'s acclaimed "Good Love!" album.',
    gradient: 'from-amber-950/80 via-slate-900 to-black',
    badge: 'Soul Classic',
    featured: true,
    screenshotRef: '/app-media/screen3.png'
  },
  {
    id: 'media-jt-i-believe-in-you',
    title: 'Johnnie Taylor — I Believe in You (You Believe in Me)',
    rawFilename: 'johnnie_taylor_i_believe_in_you_you_believe_in_me.mp4',
    correctedFromError: 'Converted raw snake_case filename with ".mp4" to clean official song title with parentheses.',
    category: 'Soul & Motown',
    genre: 'Soul & Motown',
    duration: '4 min 35 sec',
    views: '18.4K',
    date: 'Apr 2026',
    description: 'Timeless 1973 Stax Records smash hit that reached #1 on the Billboard R&B chart. Essential Detroit urban radio favorite.',
    gradient: 'from-yellow-950/80 via-slate-900 to-black',
    badge: 'Stax Records #1',
    screenshotRef: '/app-media/screen6.png'
  },
  {
    id: 'media-jt-good-love',
    title: 'Johnnie Taylor — Good Love',
    rawFilename: 'johnnie_taylor_good_love.mp4',
    correctedFromError: 'Removed ".mp4" extension and formatted title case for title track of the 1996 Malaco Records album.',
    category: 'Soul & Motown',
    genre: 'Soul & Motown',
    duration: '4 min 48 sec',
    views: '14.9K',
    date: 'Apr 2026',
    description: 'Title track from Johnnie Taylor\'s bestselling blues/soul release on Malaco Records. Soul-stirring southern rhythm and blues.',
    gradient: 'from-orange-950/80 via-slate-900 to-black',
    badge: 'Malaco Records',
    screenshotRef: '/app-media/screen6.png'
  },
  {
    id: 'media-jt-soul-heaven',
    title: 'Johnnie Taylor — Soul Heaven',
    rawFilename: 'johnnie_taylor_soul_heaven.mp4',
    correctedFromError: 'Converted raw filename to proper tribute track title.',
    category: 'Soul & Motown',
    genre: 'Soul & Motown',
    duration: '4 min 12 sec',
    views: '21.5K',
    date: 'Apr 2026',
    description: 'A poignant musical tribute imagining legendary soul singers uniting in heaven, featuring Otis Redding, Sam Cooke, and Jackie Wilson.',
    gradient: 'from-purple-950/80 via-slate-900 to-black',
    badge: 'Soul Tribute',
    screenshotRef: '/app-media/screen6.png'
  },
  {
    id: 'media-jt-just-because',
    title: 'Johnnie Taylor — Just Because',
    rawFilename: 'johnnie_taylor_just_because.mp4',
    correctedFromError: 'Removed trailing newline, extension, and snake_case formatting.',
    category: 'Soul & Motown',
    genre: 'Soul & Motown',
    duration: '3 min 58 sec',
    views: '11.2K',
    date: 'Apr 2026',
    description: 'Heartfelt smooth soul ballad showcasing Johnnie Taylor\'s emotional vocal range and dynamic storytelling.',
    gradient: 'from-rose-950/80 via-slate-900 to-black',
    badge: 'R&B Ballad',
    screenshotRef: '/app-media/screen6.png'
  },
  {
    id: 'media-perfect-murder',
    title: 'A Perfect Murder (2025) — True Crime Thriller',
    rawFilename: 'a_perfect_murder_2025_a_thriller_movies_2025_new_releases_based_on_true_story_2025.mp4',
    correctedFromError: 'Consolidated repetitive "2025_a_thriller_movies_2025_new_releases_based_on_true_story" SEO-spam filename into clean broadcast title with year and genre.',
    category: 'Action',
    genre: 'Action & Mystery',
    duration: '1h 25m 44s',
    views: '54.7K',
    date: 'Apr 2026',
    description: 'A riveting true-crime thriller following detective investigators solving an intricate cold case and confronting long-buried secrets.',
    gradient: 'from-red-950/80 via-slate-900 to-black',
    badge: 'Live Broadcast Feature',
    screenshotRef: '/app-media/screen2.png'
  },
  {
    id: 'media-salt-2',
    title: 'Salt 2: International Espionage',
    rawFilename: 'salt_2_denzel_washington_angelina_jolie_h....mp4',
    correctedFromError: 'Fixed truncated filename, removed underscores, clarified star tribute and title.',
    category: 'Action',
    genre: 'Action & Cinema',
    duration: '1h 13m 53s',
    views: '39.4K',
    date: 'Apr 2026',
    description: 'Thrilling action sequence featuring covert agent evasion, geopolitical intrigue, and relentless combat maneuvers.',
    gradient: 'from-zinc-900 via-slate-900 to-black',
    badge: 'Action Cinema',
    screenshotRef: '/app-media/screen2.png'
  },
  {
    id: 'media-someones-offspring',
    title: 'Someone\'s Offspring (2024) — Mystery Drama',
    rawFilename: 'someones_offspring_2024_lmn_best_lifetime....mp4',
    correctedFromError: 'Cleaned unformatted TV rip filename; removed "lmn_best_lifetime" tags and restored proper apostrophe and punctuation.',
    category: 'Entertainment',
    genre: 'Drama & Mystery',
    duration: '1h 24m 34s',
    views: '26.8K',
    date: 'Apr 2026',
    description: 'Engrossing drama unraveling secrets when a young woman searches for her biological parents and encounters unexpected opposition.',
    gradient: 'from-amber-950/60 via-slate-900 to-black',
    badge: 'Drama Feature',
    screenshotRef: '/app-media/screen2.png'
  },
  {
    id: 'media-claressa-shields',
    title: 'Claressa Shields: Champion\'s Response & Flint Legacy',
    rawFilename: 'claressa_shields_interview_response_flint_champion.mp4',
    correctedFromError: 'Expanded truncated "Claress... respon..." into full documentary title with athlete recognition.',
    category: 'Entertainment',
    genre: 'Sports & Culture',
    duration: '42 min',
    views: '48.3K',
    date: 'Apr 2026',
    description: 'Undisputed world champion Claressa Shields speaks candidly on Michigan boxing, legacy, training discipline, and community youth programs.',
    gradient: 'from-emerald-950/60 via-slate-900 to-black',
    badge: 'Michigan Champion',
    screenshotRef: '/app-media/screen2.png'
  },
  {
    id: 'media-re-woodward',
    title: 'Woodward Corridor Commercial Parcel Tour',
    rawFilename: 'woodward_2_85_acre_commercial_parcel_dossier.mp4',
    correctedFromError: 'Formatted commercial land walkthrough with broker credentials.',
    category: 'Real Estate',
    genre: 'Commercial Land',
    duration: '22 min',
    views: '14.2K',
    date: 'Oct 2026',
    description: 'Comprehensive drone footage and site feasibility assessment for 2.85 acres of B4-zoned land with 34,000+ daily vehicle count.',
    gradient: 'from-cyan-950/80 via-slate-900 to-black',
    badge: 'Broker Exclusive',
    featured: true
  },
  {
    id: 'media-stearsafe-tech',
    title: 'S.T.E.A.R.Safe Technologies: Driver Safety Innovation',
    rawFilename: 'stearsafe_technologies_driver_alert_patented_safety.mp4',
    correctedFromError: 'Removed internal file tags; verified technology specs.',
    category: 'Advertisements',
    genre: 'Tech & Safety',
    duration: '18 min',
    views: '9.4K',
    date: 'Oct 2026',
    description: 'Overview of patented vehicle alert mechanisms and driver assistance technology created to protect drivers and reduce collisions.',
    gradient: 'from-blue-950/80 via-slate-900 to-black',
    badge: 'Technology Showcase'
  },
  {
    id: 'media-detroit-ballroom',
    title: 'Detroit Style Ballroom: The Elegance, Steps & Soul',
    rawFilename: 'detroit_style_urban_ballroom_dance_culture.mp4',
    correctedFromError: 'Cleaned filename, formatted title case, added cultural history metadata.',
    category: 'Entertainment',
    genre: 'Culture & Dance',
    duration: '45 min',
    views: '38.6K',
    date: 'Sep 2026',
    description: 'An intimate docuseries delving into the history of Detroit urban ballroom dancing, competitive masterclasses, and community connection.',
    gradient: 'from-rose-950/60 via-slate-900 to-black',
    badge: 'Popular Episode',
    featured: true
  },
  {
    id: 'media-edu-landowner',
    title: 'First-Time Commercial Landowner Masterclass',
    rawFilename: 'first_time_commercial_landowner_masterclass_jeanell.mp4',
    correctedFromError: 'Cleaned educator tag, structured land curriculum overview.',
    category: 'Educational',
    genre: 'Real Estate Education',
    duration: '32 min',
    views: '16.5K',
    date: 'Oct 2026',
    description: 'CEO & Land Broker Jeanell Land breaks down deed research, commercial zoning (B4/M4), title search clearance, and land equity.',
    gradient: 'from-teal-950/80 via-slate-900 to-black',
    badge: 'Land Masterclass'
  },
  {
    id: 'media-edu-safety',
    title: 'S.T.E.A.R.Safe: Driver Highway Safety & Accident Prevention',
    rawFilename: 'stearsafe_driver_safety_collision_prevention_science.mp4',
    correctedFromError: 'Converted technical file code to educational safety curriculum.',
    category: 'Educational',
    genre: 'Driver Safety',
    duration: '24 min',
    views: '12.8K',
    date: 'Oct 2026',
    description: 'Instructional driver education exploring highway blind spots, reaction time latency, and preventative driving techniques for commercial and family transit.',
    gradient: 'from-cyan-950/80 via-slate-900 to-black',
    badge: 'Driver Education'
  },
  {
    id: 'media-child-workshop',
    title: 'Kids Imagination Workshop: Tales & Animated Adventures',
    rawFilename: 'kids_imagination_workshop_animated_adventures_ep1.mp4',
    correctedFromError: 'Removed episode tags and raw extension; formatted Children\'s programming title.',
    category: 'Children',
    genre: 'Kids & Family',
    duration: '20 min',
    views: '19.3K',
    date: 'Oct 2026',
    description: 'Creative arts and storytelling workshop encouraging Detroit young learners to illustrate stories, learn phonics, and build confidence.',
    gradient: 'from-yellow-950/80 via-slate-900 to-black',
    badge: 'Kids Favorite'
  },
  {
    id: 'media-child-dreamers',
    title: 'Little Dreamers: Detroit Youth Storytelling Hour',
    rawFilename: 'little_dreamers_detroit_youth_story_hour.mp4',
    correctedFromError: 'Formatted children\'s literature series title and description.',
    category: 'Children',
    genre: 'Kids Literature',
    duration: '26 min',
    views: '14.1K',
    date: 'Sep 2026',
    description: 'Wholesome children\'s reading circle celebrating courage, sharing, friendship, and curious young minds exploring science and nature.',
    gradient: 'from-amber-950/80 via-slate-900 to-black',
    badge: 'Family Matinee'
  },
  {
    id: 'media-rel-gospel',
    title: 'Sunday Morning Gospel Praise & Detroit Faith Leaders Forum',
    rawFilename: 'sunday_morning_gospel_praise_detroit_faith_forum.mp4',
    correctedFromError: 'Cleaned Sunday broadcast rip title and attributed faith community partners.',
    category: 'Religious',
    genre: 'Gospel & Faith',
    duration: '52 min',
    views: '35.4K',
    date: 'Oct 2026',
    description: 'Uplifting gospel choir harmonies and an inspirational discussion with Detroit community pastors on fellowship, compassion, and family renewal.',
    gradient: 'from-purple-950/80 via-slate-900 to-black',
    badge: 'Inspirational'
  },
  {
    id: 'media-rel-grace',
    title: 'Voices of Grace: Inspiring Hymns & Spiritual Reflection',
    rawFilename: 'voices_of_grace_inspiring_hymns_spiritual_renewal.mp4',
    correctedFromError: 'Cleaned unformatted audio/video worship title and added hymn program notes.',
    category: 'Religious',
    genre: 'Spiritual Music',
    duration: '38 min',
    views: '22.7K',
    date: 'Sep 2026',
    description: 'Soul-stirring vocal performances of timeless spiritual hymns accompanied by acoustic piano and reflective devotional readings.',
    gradient: 'from-indigo-950/80 via-slate-900 to-black',
    badge: 'Spiritual Peace'
  },
  {
    id: 'media-ad-culinary',
    title: 'Local Commercial Spot: Motor City Culinary Guild',
    rawFilename: 'local_commercial_motor_city_culinary_guild_spot.mp4',
    correctedFromError: 'Formatted commercial ad feature with broadcast spot classification.',
    category: 'Advertisements',
    genre: 'Culinary Commerce',
    duration: '4 min',
    views: '6.7K',
    date: 'Aug 2026',
    description: 'High-definition 4K commercial advertisement spotlighting downtown Detroit restaurateurs and specialty catering brands broadcast on Roku TV.',
    gradient: 'from-orange-950/60 via-slate-900 to-black',
    badge: 'Ad Spotlight'
  }
];

export const REAL_ESTATE_LISTINGS: RealEstateListing[] = [
  {
    id: 're-1',
    title: 'Woodward Commercial Development Parcel',
    location: 'Metro Detroit, MI (Woodward Ave Corridor)',
    type: 'Commercial Land',
    price: '$675,000',
    size: '2.85 Acres',
    zoning: 'B4 General Business',
    highlights: [
      'High daily traffic count (34,000+ vehicles/day)',
      'All utilities at curb (3-phase electric, city water/sewer)',
      'Ideal for retail center, medical office, or mixed-use commercial'
    ],
    description: 'Prime, clean-title shovel-ready commercial land package located in the heart of the expanding northern metro trade corridor. Cleared and ready for construction.',
    broker: 'Jeanell Land, Licensed Land Broker',
    featured: true,
    status: 'Available'
  },
  {
    id: 're-2',
    title: 'Jefferson East Waterfront-Adjacent Opportunity Parcel',
    location: 'Detroit Riverfront District, Detroit, MI',
    type: 'Mixed-Use Parcel',
    price: '$485,000',
    size: '1.42 Acres',
    zoning: 'SD2 Special Development / Mixed-Use',
    highlights: [
      'Walking distance to riverfront parks and marina',
      'Eligible for NEZ (Neighborhood Enterprise Zone) tax incentives',
      'Approved for multi-family residential + ground-floor commercial'
    ],
    description: 'Outstanding opportunity to acquire land poised for urban residential and commercial revitalization. Rapidly appreciating submarket with strong municipal backing.',
    broker: 'Jeanell Land, Licensed Land Broker',
    featured: true,
    status: 'Available'
  },
  {
    id: 're-3',
    title: 'Grand River Logistics & Industrial Flex Yard',
    location: 'Grand River & Southfield Freeway, Detroit, MI',
    type: 'Industrial Flex',
    price: '$395,000',
    size: '3.6 Acres',
    zoning: 'M4 Intensive Industrial',
    highlights: [
      'Paved heavy-equipment yard with secure fencing',
      'Immediate access to I-96, Southfield Freeway, and freight arteries',
      'Permitted for fleet parking, storage containers, or manufacturing'
    ],
    description: 'Heavy commercial and logistics parcel equipped with wide curb cuts, level topography, and rail proximity. Exceptional property for transit or distribution operations.',
    broker: 'Jeanell Land, Licensed Land Broker',
    featured: false,
    status: 'Available'
  },
  {
    id: 're-4',
    title: 'Historic Boston-Edison Infill Residential Assemblage',
    location: 'Near Boston-Edison District, Detroit, MI',
    type: 'Residential Development',
    price: '$180,000',
    size: '6 Contiguous City Lots (0.95 Acres)',
    zoning: 'R2 Two-Family Residential',
    highlights: [
      'Rare 6-lot contiguous assemblage on mature tree-lined street',
      'Surrounded by historic architectural renovations',
      'City water & sewer connections active'
    ],
    description: 'Rare opportunity for custom homebuilders, community housing advocates, or duplex developers to acquire adjacent city parcels in one clean transaction.',
    broker: 'Jeanell Land, Licensed Land Broker',
    featured: false,
    status: 'Pending Due Diligence'
  }
];

export const AD_PACKAGES: AdPackage[] = [
  {
    id: 'pkg-1',
    name: 'Local Business TV Spotlight',
    duration: '30-Second Commercial',
    frequency: '12 Airings / Day',
    platforms: ['T.E.A.R.S. Channel Roku TV', 'Web Live Stream', 'Video on Demand Archive'],
    priceEst: '$450 / month',
    description: 'Ideal for local Detroit businesses, legal practices, restaurants, and medical services looking for consistent local television viewership.',
    bestFor: 'Local businesses & professional services'
  },
  {
    id: 'pkg-2',
    name: 'Prime Time 360 Broadcast (TV + T.E.A.R.adio)',
    duration: '60-Sec TV + 30-Sec Radio Spot',
    frequency: '24 Airings / Day (TV) + Hourly Commute Drops (Radio)',
    platforms: ['Roku TV App', 'T.E.A.R.adio 24/7 Feed', 'Mobile Apps (iOS/Android)', 'On-Demand Banner'],
    priceEst: '$950 / month',
    description: 'Comprehensive cross-media exposure reaching drivers during peak morning and evening traffic reports plus primetime streaming viewers.',
    bestFor: 'Regional brands, auto dealers & developers'
  },
  {
    id: 'pkg-3',
    name: 'Real Estate & Land Developer Feature',
    duration: '15-Minute Dedicated Showcase',
    frequency: 'Featured Monthly + Infinite VOD replay',
    platforms: ['Real Estate TV (CH 102)', 'Featured VOD Shelf', 'Dedicated Property Lead Capture Form'],
    priceEst: '$1,400 / feature',
    description: 'A full-length video feature tour of your commercial property or residential community hosted with Land Broker Jeanell Land.',
    bestFor: 'Commercial brokers, architects & real estate funds'
  }
];

export const TICKER_HEADLINES: string[] = [
  'COMMUNITY PETITION: Support the Family Reunite Act by Founder Jeanell Land on Change.org (c.org/nx2fdzbjB7) for child & family support reform',
  'LIVE ON T.E.A.R.S. CHANNEL: 24/7 Television, Entertainment, Advertisement & Real Estate Network',
  'APPLE APP STORE: T.E.A.R.S App live on iOS & iPadOS (App ID: 6762139785) — Download Free',
  'T.E.A.R.ADIO TRAFFIC DISPATCH: I-75 Northbound moving clear through Downtown Detroit; minor construction delay near Exit 54',
  'REAL ESTATE ALERT: Woodward Corridor 2.85-Acre Commercial Parcel listed exclusively with Land Broker Jeanell Land',
  'ROKU TV ALERT: Add T.E.A.R.S. Channel directly from the Roku Channel Store for instant streaming on your smart TV',
  'DRIVER SAFETY UPDATE: S.T.E.A.R.Safe Technologies advances next-gen driver alert technology for nationwide highway safety',
  'NOW STREAMING: Johnnie Taylor Soul Marathon & Stax Records classics on T.E.A.R.adio',
  'ADVERTISE YOUR BUSINESS: Prime 30s & 60s broadcast commercial slots now booking for Q4 on Roku TV & T.E.A.R.adio'
];

/**
 * Multi-device Development & Deployment Portal Links
 * For iOS, iPadOS, Roku TV, Apple TV (tvOS), Fire TV, Android TV, Samsung Tizen, LG webOS, and Universal Deep Links.
 */
export const DEVELOPER_PLATFORM_LINKS: DeveloperPlatformLink[] = [
  {
    id: 'dev-pwa',
    platform: 'Universal Web PWA',
    badge: 'PWA Standalone 100%',
    status: 'Production Live',
    appIdOrBundle: 'tears-pwa-standalone (v1.0)',
    storeUrl: '/',
    devPortalUrl: 'https://web.dev/explore/progressive-web-apps',
    sdkOrDoc: 'Vite PWA / Service Worker & Web App Manifest',
    quickInstructions: [
      'Installable on Chromium, Edge, iOS Safari, Android, and Smart TV browsers',
      'Full offline media caching, audio background play, and standalone window',
      'Compliant with Web App Manifest (192x192 & 512x512 maskable icons)',
      'Direct in-app install prompt with automatic desktop and mobile detection'
    ],
    configSnippet: `{\n  "name": "T.E.A.R.S. Channel & T.E.A.R.adio",\n  "short_name": "TEARS TV",\n  "start_url": "/",\n  "display": "standalone",\n  "theme_color": "#0b0f17",\n  "background_color": "#0b0f17"\n}`
  },
  {
    id: 'dev-ios',
    platform: 'Apple iOS & iPadOS',
    badge: 'App Store Verified',
    status: 'Production Live',
    appIdOrBundle: 'com.tearschannel.app (App Store ID: 6762139785)',
    storeUrl: 'https://apps.apple.com/app/id6762139785',
    devPortalUrl: 'https://appstoreconnect.apple.com',
    sdkOrDoc: 'Xcode 16 / Swift / AVPlayer & Sovereign T.E.A.R.S. Mobile Architecture',
    quickInstructions: [
      'App Store ID: 6762139785 · Sovereign Target Bundle: com.tearschannel.app (Legacy: com.tvstartup.tears)',
      'Independent Developer Transition: Use App Store Connect "App Transfer" to move app ownership directly into your own Apple Developer Account ($99/yr directly to Apple, $0 to middlemen)',
      'Compatible with iPhone (iOS 15.0+), iPad (iPadOS 15.0+), and Mac (Apple Silicon M1+)',
      'Universal Links Domain: tearschannel.online (Direct in-app deep linking)'
    ],
    configSnippet: `{\n  "app_store_id": "6762139785",\n  "bundle_id": "com.tearschannel.app",\n  "legacy_bundle_id": "com.tvstartup.tears",\n  "universal_links": ["https://tearschannel.online", "https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app"],\n  "primary_genre": "Entertainment (6016)"\n}`
  },
  {
    id: 'dev-roku',
    platform: 'Roku TV',
    badge: 'Smart TV Dominant',
    status: 'Ready to Deploy',
    appIdOrBundle: 'Roku Channel ID: TEARS-CHANNEL-DETROIT',
    storeUrl: 'https://channelstore.roku.com',
    devPortalUrl: 'https://developer.roku.com/developer',
    sdkOrDoc: 'Roku Direct Publisher JSON Feed & SceneGraph BrightScript 3.0',
    quickInstructions: [
      '100% Free Roku Developer Account (Zero monthly fees to third parties)',
      'Direct Publisher Feed: Point your channel to https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app/api/feed.json',
      'Roku automatically renders the 10-foot living room UI, playlists, and live HLS stream',
      'Supports Roku Voice commands ("Play T.E.A.R.S. Channel") and remote deep-linking'
    ],
    configSnippet: `title=T.E.A.R.S. Channel\nmajor_version=1\nminor_version=0\nbuild_version=100\nfeed_url=https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app/api/feed.json\nmm_icon_focus_hd=pkg:/images/icon_hd.png\nsplash_screen_hd=pkg:/images/splash_hd.png`
  },
  {
    id: 'dev-tvos',
    platform: 'Apple TV (tvOS)',
    badge: 'Living Room 4K',
    status: 'Developer Testing',
    appIdOrBundle: 'com.tearschannel.tvos',
    devPortalUrl: 'https://developer.apple.com/tvos/',
    sdkOrDoc: 'tvOS SDK / SwiftUI Focus Engine & TopShelf Extension',
    quickInstructions: [
      'Enable tvOS target in your independent Xcode workspace (Bundle ID: com.tearschannel.tvos)',
      'Implement TVTopShelfProvider to show "Live Now: A Perfect Murder" and "Woodward Land Tour" on Apple TV home row',
      'Use native AVPlayerViewController with standard Siri Remote play/pause bindings'
    ]
  },
  {
    id: 'dev-firetv-android',
    platform: 'Amazon Fire TV',
    badge: 'Fire OS & Alexa',
    status: 'Ready to Deploy',
    appIdOrBundle: 'com.tearschannel.firetv',
    storeUrl: 'https://www.amazon.com/appstore',
    devPortalUrl: 'https://developer.amazon.com/apps-and-games/fire-tv',
    sdkOrDoc: 'Fire TV Hosted Web App (HWA) / Web App Starter Kit (WASK)',
    quickInstructions: [
      '100% Free Amazon Developer Account (No monthly service charges)',
      'Submit as a Hosted Web App (HWA) pointing directly to https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app',
      'Amazon packages your web app into a full-screen Fire TV native application with Alexa voice search'
    ]
  },
  {
    id: 'dev-googleplay-androidtv',
    platform: 'Android TV & Google Play',
    badge: 'Google Play Certified',
    status: 'Ready to Deploy',
    appIdOrBundle: 'com.tearschannel.app',
    storeUrl: 'https://play.google.com/store/apps',
    devPortalUrl: 'https://play.google.com/console',
    sdkOrDoc: 'Android TV Leanback Library, Media3 ExoPlayer & PWA TWA (Trusted Web Activity)',
    quickInstructions: [
      'One-time $25 Google Play registration (No monthly vendor fees)',
      'Package via Bubblewrap or PWABuilder as a Trusted Web Activity (TWA)',
      'Add LEANBACK_LAUNCHER intent filter in AndroidManifest.xml for Google TV and Android TV home screens',
      'Supports Google Cast (Chromecast) from mobile web to big screen TV'
    ]
  },
  {
    id: 'dev-smart-tv-web',
    platform: 'Samsung Tizen & LG webOS',
    badge: 'Smart TV Web OS',
    status: 'Ready to Deploy',
    appIdOrBundle: 'tears-smarttv-web-app',
    devPortalUrl: 'https://developer.samsung.com/smarttv / https://webostv.developer.lge.com',
    sdkOrDoc: 'HTML5 Web App & W3C Packaged Web App widget specifications',
    quickInstructions: [
      'Build using standard web standards: HTML5, CSS3, and JavaScript',
      'Package with config.xml / appinfo.json for Tizen Studio and webOS TV CLI',
      'Handle Remote D-pad key events (KEY_ENTER, KEY_RETURN, KEY_UP, KEY_DOWN)'
    ]
  },
  {
    id: 'dev-dynalinks',
    platform: 'Universal Deep Linking',
    badge: 'Dynalinks Deep Link',
    status: 'Active Store Link',
    appIdOrBundle: 'tears.dynalinks.app',
    storeUrl: 'https://tears.dynalinks.app',
    devPortalUrl: 'https://firebase.google.com/docs/dynamic-links',
    sdkOrDoc: 'Associated Domains / Apple App Site Association (AASA) & Android Asset Links',
    quickInstructions: [
      'Official deep link shown in screenshot 4: tears.dynalinks.app',
      'Redirects to App Store on iOS when app is not installed',
      'Directly launches specific VOD item or Live stream when installed',
      'Compatible with QR code sharing (as seen in silver medallion logo)'
    ],
    configSnippet: `https://tears.dynalinks.app/?link=https://ais-pre-hwog2qx7hqwpm2cxzpdrgt-401364820245.us-west2.run.app/?vod=media-jt-last-two-dollars&apn=com.tearschannel.app&ibi=com.tearschannel.app&isi=6762139785`
  }
];
