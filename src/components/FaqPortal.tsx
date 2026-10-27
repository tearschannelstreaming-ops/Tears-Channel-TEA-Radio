import React, { useState } from 'react';
import { 
  HelpCircle, Search, ChevronDown, Smartphone, Tv, Radio, Building2, 
  Megaphone, Heart, Copy, Check, ExternalLink, Mail, Phone, ShieldCheck, 
  Sparkles, CheckCircle2, Send, MessageSquare, Clock
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'channel' | 'realestate' | 'radio' | 'advertising' | 'community';
  question: string;
  answer: string;
  actionText?: string;
  actionUrl?: string;
  isExternalAction?: boolean;
  highlight?: boolean;
}

const FAQ_ITEMS: FaqItem[] = [
  // Real Estate & MLS App
  {
    id: 'mls-app-download',
    category: 'realestate',
    question: 'How do I download Broker Jeanell Land\'s official MLS Mobile Real Estate App?',
    answer: 'You can download Broker Jeanell Land\'s mobile app directly using the link https://mls-client.com/AC8E6C053. When prompted, enter access code "AC8E6C053" to gain full real-time access to Metro Detroit and nationwide MLS listings, commercial development acreage, residential parcels, and direct private messaging with Broker Jeanell Land.',
    actionText: 'Download MLS Mobile App (Code: AC8E6C053)',
    actionUrl: 'https://mls-client.com/AC8E6C053',
    isExternalAction: true,
    highlight: true
  },
  {
    id: 'mls-access-code',
    category: 'realestate',
    question: 'What is the required access code for the mobile real estate app?',
    answer: 'The official access code is "AC8E6C053". Once you download the MLS client app from https://mls-client.com/AC8E6C053, enter code AC8E6C053 to connect directly to Jeanell Land\'s brokerage portal. If you need assistance, contact Jeanell at jeanell@tearschannel.online.',
    actionText: 'Open MLS Portal Link',
    actionUrl: 'https://mls-client.com/AC8E6C053',
    isExternalAction: true
  },
  {
    id: 'real-estate-types',
    category: 'realestate',
    question: 'What types of real estate and land parcels does T.E.A.R.S. Channel feature?',
    answer: 'Our Real Estate Division focuses on prime commercial development land, logistics and industrial flex yards, mixed-use zoning parcels, and prime residential assemblages in Metro Detroit (including the Woodward Corridor and Riverfront) as well as nationwide opportunities. All listings are curated under the direction of licensed Land Broker Jeanell Land.',
    actionText: 'Browse Real Estate Listings',
    actionUrl: '#realestate'
  },
  {
    id: 'schedule-land-tour',
    category: 'realestate',
    question: 'How can I schedule a commercial land walk or property tour?',
    answer: 'You can request a site walk or broker consultation directly on the "Real Estate & Land" tab by selecting any featured parcel, or by emailing Broker Jeanell Land at jeanell@tearschannel.online with your development criteria and timeline.',
    actionText: 'Email Broker Jeanell Land',
    actionUrl: 'mailto:jeanell@tearschannel.online',
    isExternalAction: true
  },

  // T.E.A.R.S. Channel & TV Network
  {
    id: 'tears-meaning',
    category: 'channel',
    question: 'What does the T.E.A.R.S. acronym stand for?',
    answer: 'T.E.A.R.S. stands for Television • Entertainment • Advertisement • RealEstate • Streaming Channel. Founded by CEO & Land Broker Jeanell Land and powered by S.T.E.A.R.Safe Technologies Inc., the network merges 24/7 video entertainment, urban real estate development, and highway safety broadcasting.',
    highlight: true
  },
  {
    id: 'how-to-watch-roku',
    category: 'channel',
    question: 'How do I tune in on Roku TV, Apple TV, and Smart TVs?',
    answer: 'On your Roku Streaming Device or Roku Smart TV, open the Roku Channel Store and search for "T.E.A.R.S. Channel" to add our official channel to your home screen. For Apple TV, Android TV, Fire TV, and Smart TVs, you can tune into our live stream via deep link or watch directly in any web browser at full 4K and 1080p resolution.',
    actionText: 'View Smart TV & Dev Hub',
    actionUrl: '#developer'
  },
  {
    id: 'apple-app-store',
    category: 'channel',
    question: 'Is there an official T.E.A.R.S. app on the Apple App Store?',
    answer: 'Yes! The official T.E.A.R.S. Channel application is available on Apple iOS and iPadOS under App Store ID 6762139785 (Sovereign Target Bundle: com.tearschannel.app). It features live stream broadcasting, on-demand video playback, and push notifications for network specials.',
    actionText: 'View on Apple App Store',
    actionUrl: 'https://apps.apple.com/app/id6762139785',
    isExternalAction: true
  },
  {
    id: 'vod-library',
    category: 'channel',
    question: 'What programs can I watch on the Video On Demand (VOD) catalog?',
    answer: 'Our VOD library features full episodes of "A Perfect Murder", Detroit Urban Spotlights, exclusive Land Tours with Broker Jeanell Land, S.T.E.A.R.Safe mobility innovations, independent films, and T.E.A.R.adio concert archives. All VOD content is organized by category with zero paywalls.',
    actionText: 'Open Video Catalog',
    actionUrl: '#vod'
  },

  // T.E.A.R.adio & Live Audio
  {
    id: 'what-is-tear-radio',
    category: 'radio',
    question: 'What is T.E.A.R.adio and how do I listen?',
    answer: 'T.E.A.R.adio is our 24/7 nationwide audio broadcast network combining classic urban soul (Motown, Stax Records, Johnnie Taylor), smooth jazz, financial market updates, and real-time highway traffic safety dispatch. You can listen on the "T.E.A.R.adio" tab in your browser or stream it to your car audio system via CarPlay or Bluetooth.',
    actionText: 'Listen to T.E.A.R.adio Live',
    actionUrl: '#radio',
    highlight: true
  },
  {
    id: 'traffic-safety-dispatch',
    category: 'radio',
    question: 'How does the highway safety traffic dispatch work?',
    answer: 'Through our parent company S.T.E.A.R.Safe Technologies Inc., T.E.A.R.adio broadcasts live road condition alerts, weather hazards, and interstate congestion reports across Detroit corridors (I-75, I-94, I-96, Lodge Fwy, Southfield Fwy) and major national shipping routes.',
    actionText: 'View Driver Traffic Dispatch',
    actionUrl: '#radio'
  },

  // Advertising & Business
  {
    id: 'advertising-rates',
    category: 'advertising',
    question: 'How can our business book commercial airtime on T.E.A.R.S. Channel?',
    answer: 'We provide commercial packages ranging from 15-second billboard mentions to 30-second and 60-second broadcast commercials aired during primetime television and drive-time radio slots. Custom 30-minute branded video interview specials are also available. Visit our "Advertise" tab or contact support@tearschannel.online for rate cards.',
    actionText: 'Explore Commercial Packages',
    actionUrl: '#advertise'
  },

  // Community & Advocacy
  {
    id: 'family-reunite-act',
    category: 'community',
    question: 'What is the "Family Reunite Act" petition on Change.org?',
    answer: 'The Family Reunite Act is a grassroots national petition spearheaded by founder Jeanell Land advocating for reform of the child support structure in the United States. The initiative promotes equitable child support deductions (mandatory maximum of 25%), protecting child well-being, and ensuring family stability. You can read and sign the petition directly on Change.org at https://c.org/nx2fdzbjB7.',
    actionText: 'Sign Petition on Change.org (c.org/nx2fdzbjB7)',
    actionUrl: 'https://c.org/nx2fdzbjB7',
    isExternalAction: true,
    highlight: true
  },
  // Patentable Architecture & Clean-Room IP
  {
    id: 'patent-product-architecture',
    category: 'community',
    question: 'Is T.E.A.R.S. Channel a proprietary patentable product, and what makes it unique?',
    answer: 'Yes! T.E.A.R.S. Channel was created clean-room from the ground up as a fully proprietary, patent-pending media network architecture by founder Jeanell Land and S.T.E.A.R.Safe Technologies Inc. Its novel utility claims include: 1) Synchronized Multi-Stream Spatial Real Estate Telemetry (linking broadcast frames with GIS parcel data and MLS token AC8E6C053), 2) S.T.E.A.R.Safe Highway Safety Telemetry & Autonomous Audio Ducking (priority roadside hazard alert ducking on radio and TV), 3) Frame-accurate drone computer vision acreage boundary detection, and 4) Multi-CDN zero-collision media deduplication.',
    actionText: 'Inspect Patent Claims & Testbench',
    actionUrl: '#patent',
    highlight: true
  },
  {
    id: 'clean-room-non-infringement',
    category: 'community',
    question: 'How does T.E.A.R.S. Channel ensure zero infringement on third-party systems?',
    answer: 'T.E.A.R.S. Channel is developed with strict clean-room engineering discipline. All media orchestration pipelines, DSP audio ducking algorithms, and geospatial real estate synchronization logic are 100% original intellectual property of S.T.E.A.R.Safe Technologies Inc. References to multi-device stores (Roku, Apple App Store ID: 6762139785, Fire TV) are strictly for nominative fair-use deployment specifications.',
    actionText: 'View Patent & IP Portal',
    actionUrl: '#patent'
  },
  {
    id: 'support-contacts',
    category: 'community',
    question: 'Who should I contact for technical support or executive inquiries?',
    answer: 'For technical help with the streaming app, email support@tearschannel.online. For real estate brokerage, executive partnerships, or speaking inquiries, contact CEO Jeanell Land directly at jeanell@tearschannel.online.',
    actionText: 'Email Network Support',
    actionUrl: 'mailto:support@tearschannel.online',
    isExternalAction: true
  }
];

interface FaqPortalProps {
  onSelectTab: (tab: string) => void;
}

export const FaqPortal: React.FC<FaqPortalProps> = ({ onSelectTab }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'mls-app-download': true,
    'tears-meaning': true,
    'what-is-tear-radio': true
  });
  const [copiedCode, setCopiedCode] = useState(false);

  // Direct Contact Form State (routes to support@tearschannel.online)
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('Technical Streaming Support');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    timestamp: string;
    name: string;
    email: string;
    category: string;
    subject: string;
    message: string;
  } | null>(null);

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('AC8E6C053');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
    setIsSubmitting(true);
    const newId = `TEARS-SUP-${Math.floor(100000 + Math.random() * 900000)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedTicket({
        id: newId,
        timestamp: timeStr,
        name: contactName,
        email: contactEmail,
        category: contactCategory,
        subject: contactSubject.trim() || `${contactCategory} Inquiry`,
        message: contactMessage
      });
    }, 600);
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
    setContactName('');
    setContactEmail('');
    setContactCategory('Technical Streaming Support');
    setContactSubject('');
    setContactMessage('');
  };

  const categories = [
    { id: 'all', label: 'All Questions', count: FAQ_ITEMS.length },
    { id: 'realestate', label: 'Real Estate & MLS App', count: FAQ_ITEMS.filter(f => f.category === 'realestate').length },
    { id: 'channel', label: 'T.E.A.R.S. TV Network', count: FAQ_ITEMS.filter(f => f.category === 'channel').length },
    { id: 'radio', label: 'T.E.A.R.adio & Safety', count: FAQ_ITEMS.filter(f => f.category === 'radio').length },
    { id: 'advertising', label: 'Commercial Advertising', count: FAQ_ITEMS.filter(f => f.category === 'advertising').length },
    { id: 'community', label: 'Advocacy & Contacts', count: FAQ_ITEMS.filter(f => f.category === 'community').length }
  ];

  const filteredItems = FAQ_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      item.question.toLowerCase().includes(query) || 
      item.answer.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#131b2e] to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>KNOWLEDGE BASE &amp; FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Common Questions &amp; Direct Resources
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Everything you need to know about the T.E.A.R.S. television network, Broker Jeanell Land&#39;s MLS Client Mobile App, Detroit real estate acreage, 24/7 T.E.A.R.adio broadcasts, and commercial airtime.
          </p>
        </div>

        {/* Ambient background accent */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      </div>

      {/* Featured Banner: Jeanell Land's MLS Client Mobile App */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1f38] via-slate-900 to-[#1e132b] border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Official MLS Client Mobile App</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Download Broker Jeanell Land&#39;s Mobile App
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Browse real-time MLS property listings, commercial development acreage, residential parcels, and chat privately with licensed Land Broker Jeanell Land directly from your smartphone.
            </p>
            
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 bg-black/60 border border-slate-700 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-300">
                <span className="text-slate-400">Access Code:</span>
                <strong className="text-amber-400 text-sm tracking-wider">AC8E6C053</strong>
                <button
                  onClick={handleCopyCode}
                  className="ml-1 p-1 hover:text-white rounded transition-colors text-amber-400"
                  title="Copy access code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copiedCode && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Code AC8E6C053 Copied!
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href="https://mls-client.com/AC8E6C053"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 hover:scale-105"
            >
              <Smartphone className="w-4 h-4" />
              <span>Download Mobile App</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
            <a
              href="mailto:jeanell@tearschannel.online?subject=MLS%20App%20Inquiry%20(Code%20AC8E6C053)"
              className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contact Jeanell Land</span>
            </a>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Navigation */}
      <div className="space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions about T.E.A.R.S. channel, MLS mobile app, real estate parcels, radio stream..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-400/20'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeCategory === cat.id ? 'bg-black/20 text-black font-extrabold' : 'bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-white font-bold text-base">No questions found matching &quot;{searchQuery}&quot;</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or select another category above. You can also reach our team directly.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl font-medium"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          filteredItems.map(item => {
            const isOpen = !!openItems[item.id];
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  item.highlight
                    ? 'border-amber-500/40 bg-gradient-to-r from-slate-900 via-[#161d2d] to-slate-900 shadow-md'
                    : 'border-slate-800/90 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      item.category === 'realestate' ? 'bg-cyan-400' :
                      item.category === 'channel' ? 'bg-amber-400' :
                      item.category === 'radio' ? 'bg-purple-400' :
                      item.category === 'community' ? 'bg-red-400' : 'bg-emerald-400'
                    }`} />
                    <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-amber-400' : ''
                  }`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-800/60 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                    <p>{item.answer}</p>

                    {item.actionText && (
                      <div className="pt-2">
                        {item.isExternalAction ? (
                          <a
                            href={item.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold transition-colors"
                          >
                            <span>{item.actionText}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <button
                            onClick={() => {
                              if (item.actionUrl?.startsWith('#')) {
                                onSelectTab(item.actionUrl.replace('#', ''));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                          >
                            <span>{item.actionText} →</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Direct Contact Form Section: Sends Inquiries Directly to support@tearschannel.online */}
      <div id="contact-support" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0e1626] to-slate-900 border-2 border-slate-800 shadow-2xl space-y-6">
        
        {/* Form Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Direct Support &amp; Network Inquiries</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Send an Inquiry to support@tearschannel.online
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Have a technical question regarding our broadcast, need help with Jeanell Land&#39;s MLS Client Mobile App, or interested in commercial airtime? Fill out the form below for immediate dispatch to our dedicated support team.
            </p>
          </div>

          <div className="flex flex-col sm:items-end text-xs font-mono text-slate-400 space-y-1 shrink-0">
            <div>
              <span className="text-slate-500">Support Desk: </span>
              <a href="mailto:support@tearschannel.online" className="text-cyan-400 hover:underline font-bold">
                support@tearschannel.online
              </a>
            </div>
            <div>
              <span className="text-slate-500">Broker Direct: </span>
              <a href="mailto:jeanell@tearschannel.online" className="text-amber-400 hover:underline">
                jeanell@tearschannel.online
              </a>
            </div>
          </div>
        </div>

        {submittedTicket ? (
          /* Submission Success State */
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-lg font-bold text-white">Inquiry Dispatched Successfully!</h4>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 font-bold">
                    Ticket Ref: {submittedTicket.id}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Thank you, <strong className="text-white">{submittedTicket.name}</strong>! Your inquiry regarding &quot;<strong className="text-emerald-300">{submittedTicket.subject}</strong>&quot; has been recorded and routed directly to <strong className="text-cyan-300">support@tearschannel.online</strong>.
                </p>
              </div>
            </div>

            {/* Ticket Summary Box */}
            <div className="p-4 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono space-y-2 text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
                <div><span className="text-slate-500">Recipient:</span> support@tearschannel.online</div>
                <div><span className="text-slate-500">Time:</span> {submittedTicket.timestamp}</div>
                <div><span className="text-slate-500">From:</span> {submittedTicket.name} ({submittedTicket.email})</div>
                <div><span className="text-slate-500">Category:</span> {submittedTicket.category}</div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-slate-200">
                <span className="text-slate-500 block mb-1">Message Content:</span>
                <p className="font-sans italic bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  &quot;{submittedTicket.message}&quot;
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`mailto:support@tearschannel.online?subject=${encodeURIComponent(`[${submittedTicket.id}] ${submittedTicket.category}: ${submittedTicket.subject}`)}&body=${encodeURIComponent(`From: ${submittedTicket.name} (${submittedTicket.email})\nReference: ${submittedTicket.id}\nCategory: ${submittedTicket.category}\n\nMessage:\n${submittedTicket.message}`)}`}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-400/20"
              >
                <Mail className="w-4 h-4" />
                <span>Open in Email App (Backup Copy)</span>
              </a>

              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
              >
                Send Another Inquiry
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Form */
          <form onSubmit={handleSubmitContact} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Inquiry Department / Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={contactCategory}
                  onChange={e => setContactCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                >
                  <option>Technical Streaming Support</option>
                  <option>MLS Mobile App (Code AC8E6C053)</option>
                  <option>Real Estate &amp; Land Tour Inquiry</option>
                  <option>Commercial Advertising &amp; Airtime</option>
                  <option>T.E.A.R.adio Live Music &amp; Traffic</option>
                  <option>Family Reunite Act Petition Advocacy</option>
                  <option>General Executive Contact</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  value={contactSubject}
                  onChange={e => setContactSubject(e.target.value)}
                  placeholder="e.g. Help setting up MLS App or Smart TV"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Message &amp; Inquiry Details <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                placeholder="Describe your inquiry, question, or support request in detail..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder-slate-500 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct delivery to <strong className="text-white">support@tearschannel.online</strong> with confirmation log.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 hover:scale-105 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Routing to Support...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry to Support</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Still Have Questions / Personal Contacts */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <h4 className="text-lg font-bold text-white tracking-tight">
          Additional Direct Contact &amp; App Resources
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Contact Founder &amp; Land Broker Jeanell Land directly, or download the official MLS Client mobile application.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="mailto:jeanell@tearschannel.online"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-400/20"
          >
            <Mail className="w-4 h-4" />
            <span>Email Jeanell Land (Broker)</span>
          </a>

          <a
            href="mailto:support@tearschannel.online"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors border border-slate-700"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Direct: support@tearschannel.online</span>
          </a>

          <a
            href="https://mls-client.com/AC8E6C053"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-xs flex items-center gap-2 transition-colors border border-cyan-500/30"
          >
            <Smartphone className="w-4 h-4" />
            <span>MLS App Link (Code: AC8E6C053)</span>
          </a>
        </div>
      </div>

    </div>
  );
};
