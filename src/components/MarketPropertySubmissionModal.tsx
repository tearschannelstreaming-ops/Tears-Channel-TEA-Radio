import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, CheckCircle2, UploadCloud, 
  DollarSign, MapPin, X, ArrowRight, Sparkles 
} from 'lucide-react';
import { PropertySubmission } from '../types';

interface MarketPropertySubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProperty: (data: Omit<PropertySubmission, 'id' | 'submittedAt' | 'status'>) => PropertySubmission;
  onNavigateToAgreements?: () => void;
}

export const MarketPropertySubmissionModal: React.FC<MarketPropertySubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmitProperty,
  onNavigateToAgreements
}) => {
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [cityStateZip, setCityStateZip] = useState('Detroit, MI');
  const [askingPrice, setAskingPrice] = useState('');
  const [propertyType, setPropertyType] = useState<PropertySubmission['propertyType']>('Commercial Land');
  const [size, setSize] = useState('');
  const [zoning, setZoning] = useState('B4 General Business');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [representationRequested, setRepresentationRequested] = useState(true);
  const [submittedItem, setSubmittedItem] = useState<PropertySubmission | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !ownerEmail.trim() || !propertyAddress.trim() || !askingPrice.trim()) return;

    const result = onSubmitProperty({
      ownerName: ownerName.trim(),
      ownerPhone: ownerPhone.trim() || '(313) 555-0199',
      ownerEmail: ownerEmail.trim(),
      propertyAddress: propertyAddress.trim(),
      cityStateZip: cityStateZip.trim(),
      askingPrice: askingPrice.trim(),
      propertyType,
      size: size.trim() || '1.5 Acres',
      zoning: zoning.trim() || 'B4 Commercial',
      description: description.trim() || 'Prime commercial property presented for broadcast marketing and metaverse listing through All Your Needs Reality LLC.',
      mediaUrl: mediaUrl.trim() || undefined,
      representationRequested
    });

    setSubmittedItem(result);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col text-left">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>All Your Needs Reality LLC · Property Intake</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-cyan-400">Jeanell Land, Broker</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Market Your Property with Jeanell Land
            </h3>
            <p className="text-xs text-slate-300">
              List your commercial parcel, industrial flex yard, or acreage on T.E.A.R.S. Channel 24/7 TV, the Michigan MLS, and the Metaverse Real Estate World.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8 space-y-6 flex-1">
          
          {submittedItem ? (
            <div className="p-6 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/60 text-emerald-300 space-y-4 text-center animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white">
                  Property Listed for Marketing!
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  {submittedItem.propertyAddress} ({submittedItem.askingPrice}) has been ingested into the All Your Needs Reality LLC brokerage queue.
                </p>
                <div className="text-[11px] font-mono text-amber-400 pt-1">
                  🎁 Earned +500 Smart Cash Credits &amp; +10 Dice Rolls for Listing!
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                {onNavigateToAgreements && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToAgreements();
                    }}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl shadow cursor-pointer"
                  >
                    Execute Exclusive Seller Agreement →
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Return to Real Estate Portal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Owner Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Owner / Representative Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={ownerPhone}
                    onChange={e => setOwnerPhone(e.target.value)}
                    placeholder="(313) 555-0144"
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={e => setOwnerEmail(e.target.value)}
                    placeholder="owner@example.com"
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Property Address / Cross Streets *
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyAddress}
                    onChange={e => setPropertyAddress(e.target.value)}
                    placeholder="e.g. 7840 Michigan Ave or Woodward &amp; Warren"
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    City, State, Zip
                  </label>
                  <input
                    type="text"
                    value={cityStateZip}
                    onChange={e => setCityStateZip(e.target.value)}
                    placeholder="Detroit, MI 48210"
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Asking Price ($) *
                  </label>
                  <input
                    type="text"
                    required
                    value={askingPrice}
                    onChange={e => setAskingPrice(e.target.value)}
                    placeholder="e.g. $450,000"
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Property Category
                  </label>
                  <select
                    value={propertyType}
                    onChange={e => setPropertyType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Commercial Land">Commercial Land</option>
                    <option value="Mixed-Use Parcel">Mixed-Use Parcel</option>
                    <option value="Industrial Flex">Industrial Flex</option>
                    <option value="Residential Development">Residential Development</option>
                    <option value="Retail / Office">Retail / Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Size / Acreage
                  </label>
                  <input
                    type="text"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    placeholder="e.g. 2.5 Acres or 15,000 Sq Ft"
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Zoning &amp; Utilities
                </label>
                <input
                  type="text"
                  value={zoning}
                  onChange={e => setZoning(e.target.value)}
                  placeholder="e.g. B4 General Business, 3-Phase Electric, City Water/Sewer"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Property Highlights &amp; Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe location advantages, daily traffic count, frontage feet, existing structures or cleared infill status..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Media / Drone Video Link (Optional)
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  placeholder="https://... (Vimeo, YouTube, Google Drive survey)"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Representation Checkbox */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="repCheck"
                  checked={representationRequested}
                  onChange={e => setRepresentationRequested(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-950 border-slate-700 text-amber-400 focus:ring-amber-400"
                />
                <label htmlFor="repCheck" className="text-xs text-slate-300 cursor-pointer">
                  <strong>Broker Representation:</strong> I authorize Broker Jeanell Land and All Your Needs Reality LLC to review this listing, conduct initial due diligence, and broadcast property video highlights across T.E.A.R.S. Channel TV and the Metaverse Real Estate World.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs sm:text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Submit Property to All Your Needs Reality LLC (+500 Credits)</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
