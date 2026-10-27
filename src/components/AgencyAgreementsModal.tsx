import React, { useState } from 'react';
import { 
  AgencyAgreement, 
  AgencyAgreementType 
} from '../types';
import { 
  FileText, ShieldCheck, CheckCircle2, Lock, Download, 
  X, Check, AlertCircle, Sparkles, Building2, UserCheck, 
  Scale, FileSignature, ArrowRight
} from 'lucide-react';

interface AgencyAgreementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreements: AgencyAgreement[];
  onSignAgreement: (
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
  ) => AgencyAgreement;
  onEnterMetaverse?: () => void;
  requiredForMetaverseEntry?: boolean;
}

export const AgencyAgreementsModal: React.FC<AgencyAgreementsModalProps> = ({
  isOpen,
  onClose,
  agreements,
  onSignAgreement,
  onEnterMetaverse,
  requiredForMetaverseEntry = false
}) => {
  const [selectedType, setSelectedType] = useState<AgencyAgreementType>('exclusive_seller');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [askingPrice, setAskingPrice] = useState('$650,000');
  const [signatureText, setSignatureText] = useState('');
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [justSignedAgreement, setJustSignedAgreement] = useState<AgencyAgreement | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !signatureText.trim() || !hasAgreedToTerms) return;

    const agreement = onSignAgreement(
      selectedType,
      {
        name: clientName.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim() || '(313) 555-0100',
        address: clientAddress.trim() || 'Metro Detroit, MI',
        propertyAddress: propertyAddress.trim() || 'Woodward Corridor Parcel, Detroit, MI',
        askingPrice: askingPrice.trim()
      },
      signatureText.trim()
    );

    setJustSignedAgreement(agreement);

    if (onEnterMetaverse && requiredForMetaverseEntry) {
      setTimeout(() => {
        onEnterMetaverse();
        onClose();
      }, 1500);
    }
  };

  const handleDownloadProof = (agr: AgencyAgreement) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(agr, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AllYourNeedsReality_${agr.type}_${agr.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl flex flex-col text-left">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>All Your Needs Reality LLC · Brokerage Compliance</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-amber-400">Jeanell Land, Broker</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {requiredForMetaverseEntry ? 'Metaverse Real Estate World Entry Clearance' : 'Real Estate Agency & Seller Agreements'}
            </h3>
            {requiredForMetaverseEntry && (
              <p className="text-xs text-amber-300 font-medium">
                To inspect commercial parcels, participate on the Metaverse Board, or market property, execute your official representation agreement below.
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 space-y-8 flex-1">
          
          {/* Success Confirmation Toast */}
          {justSignedAgreement && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/60 text-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-white text-sm">
                    Agency Agreement Executed Successfully!
                  </div>
                  <div className="text-xs text-emerald-300 font-mono">
                    ID: {justSignedAgreement.id} · {justSignedAgreement.signatureHash.substring(0, 24)}...
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Brokered with <strong>All Your Needs Reality LLC</strong>. Your client record is active in the Michigan MLS and Metaverse Real Estate ledger.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownloadProof(justSignedAgreement)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-mono font-bold rounded-lg border border-emerald-500/40 flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Proof</span>
                </button>
                {onEnterMetaverse && (
                  <button
                    onClick={() => {
                      onClose();
                      onEnterMetaverse();
                    }}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
                  >
                    <span>Enter Metaverse Board</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Agreement Type Selector Tabs */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
              1. Select Agency Representation Agreement
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Type 1: Exclusive Right to Sell (Seller Agreement) */}
              <button
                type="button"
                onClick={() => setSelectedType('exclusive_seller')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  selectedType === 'exclusive_seller'
                    ? 'bg-amber-500/10 border-amber-400 text-white shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  {selectedType === 'exclusive_seller' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Exclusive Right to Sell</h4>
                  <div className="text-[11px] text-amber-300 font-mono">Seller Agency Agreement</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Market your real property through All Your Needs Reality LLC with TV broadcast + Metaverse digital twin.
                  </p>
                </div>
              </button>

              {/* Type 2: Exclusive Buyer Agency */}
              <button
                type="button"
                onClick={() => setSelectedType('exclusive_buyer')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  selectedType === 'exclusive_buyer'
                    ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/20 text-cyan-400 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  {selectedType === 'exclusive_buyer' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Exclusive Buyer Agency</h4>
                  <div className="text-[11px] text-cyan-300 font-mono">Buyer Representation Agreement</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Fiduciary representation by Broker Jeanell Land to acquire land &amp; commercial assets at optimal terms.
                  </p>
                </div>
              </button>

              {/* Type 3: Broker Affiliate & Co-Op Agreement */}
              <button
                type="button"
                onClick={() => setSelectedType('affiliate_co_op')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  selectedType === 'affiliate_co_op'
                    ? 'bg-purple-500/10 border-purple-400 text-white shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-purple-400/20 text-purple-400 flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>
                  {selectedType === 'affiliate_co_op' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Broker Affiliate &amp; Co-Op</h4>
                  <div className="text-[11px] text-purple-300 font-mono">25% Referral Commission</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Mimics Smart Cash &amp; Monopoly GO offerwalls. Earn 25% broker referral co-op fees on closed deals.
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Legal Contract Preview Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs text-slate-300 leading-relaxed max-h-56 overflow-y-auto">
            <div className="text-amber-400 font-bold border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>AGREEMENT COVENANTS &amp; CONDITIONS · ALL YOUR NEEDS REALITY LLC</span>
              <span className="text-[10px] text-slate-400">STATE OF MICHIGAN</span>
            </div>

            {selectedType === 'exclusive_seller' && (
              <div className="space-y-2 text-[11px]">
                <p><strong>1. APPOINTMENT &amp; EXCLUSIVE RIGHT:</strong> Owner hereby employs All Your Needs Reality LLC (Designated Broker: Jeanell Land) as the sole and exclusive agent to market, broadcast, showcase, and procure ready, willing, and able buyers for the real property described herein.</p>
                <p><strong>2. TELEVISION &amp; METAVERSE BROADCAST RIGHTS:</strong> Owner authorizes All Your Needs Reality LLC to broadcast 4K aerial drone footage, photography, and commercial spotlight segments on T.E.A.R.S. Channel 24/7 TV network, and to generate an interactive digital twin parcel on the Metaverse Real Estate Board.</p>
                <p><strong>3. BROKERAGE COMMISSION:</strong> Owner agrees to pay All Your Needs Reality LLC a total professional fee of 6.0% of the gross sales price upon closing, with 3.0% designated as co-op compensation to procuring buyer brokers.</p>
                <p><strong>4. NONDISCRIMINATION &amp; FAIR HOUSING:</strong> This property is offered in full compliance with Federal Fair Housing laws and Michigan Civil Rights legislation.</p>
              </div>
            )}

            {selectedType === 'exclusive_buyer' && (
              <div className="space-y-2 text-[11px]">
                <p><strong>1. FIDUCIARY APPOINTMENT:</strong> Buyer designates All Your Needs Reality LLC (Jeanell Land, Broker) as Buyer&#39;s exclusive representative. Broker shall exercise undivided loyalty, confidentiality, lawful obedience, and full financial disclosure.</p>
                <p><strong>2. METAVERSE &amp; PROPERTY INSPECTION:</strong> Buyer receives authorized access to inspect off-market commercial parcels, review Phase 1 environmental reports, and access 4K drone video tours on the Metaverse Real Estate World.</p>
                <p><strong>3. COMPENSATION &amp; CO-OP DISCLOSURE:</strong> Broker shall seek compensation from the listing broker or seller via MLS co-op split (standard 3.0%). In the event seller refuses co-op, terms shall be adjusted in writing prior to offer presentation.</p>
              </div>
            )}

            {selectedType === 'affiliate_co_op' && (
              <div className="space-y-2 text-[11px]">
                <p><strong>1. AFFILIATE REFERRAL ENGAGEMENT:</strong> Affiliate is registered to promote All Your Needs Reality LLC commercial listings and T.E.A.R.S. Channel real estate features utilizing unique tracking referral codes.</p>
                <p><strong>2. 25% CO-OP REFERRAL BOUNTY:</strong> Upon the successful close of escrow on any real property transaction procured via Affiliate&#39;s verified referral, All Your Needs Reality LLC agrees to remit 25% of the retained broker fee directly to Affiliate (or their designated brokerage firm).</p>
                <p><strong>3. SMART CASH GAMIFIED BOUNTIES:</strong> Daily check-ins, sponsored video ad completions, and dice milestones in the Metaverse Real Estate World yield instant Smart Cash redeemable for closing credits, appraisal vouchers, or cash payouts.</p>
              </div>
            )}
          </div>

          {/* Signing Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Legal Name / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="e.g. Jeanell Land or Detroit Land Trust LLC"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  placeholder="e.g. client@example.com"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  placeholder="(313) 555-0100"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {selectedType === 'exclusive_seller' ? 'Property Address to Market' : 'Mailing / Business Address'}
                </label>
                <input
                  type="text"
                  value={selectedType === 'exclusive_seller' ? propertyAddress : clientAddress}
                  onChange={e => selectedType === 'exclusive_seller' ? setPropertyAddress(e.target.value) : setClientAddress(e.target.value)}
                  placeholder={selectedType === 'exclusive_seller' ? 'e.g. Woodward Ave Parcel, Detroit, MI' : 'e.g. 100 Renaissance Center, Detroit MI'}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {selectedType === 'exclusive_seller' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Asking Price Target
                  </label>
                  <input
                    type="text"
                    value={askingPrice}
                    onChange={e => setAskingPrice(e.target.value)}
                    placeholder="e.g. $675,000"
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Authorized Marketing Broker
                  </label>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-amber-400">
                    All Your Needs Reality LLC · Jeanell Land, Broker
                  </div>
                </div>
              </div>
            )}

            {/* Signature Input */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileSignature className="w-4 h-4 text-cyan-400" />
                  <span>Sovereign Electronic Signature *</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Cryptographically Sealed</span>
              </label>
              <input
                type="text"
                required
                value={signatureText}
                onChange={e => setSignatureText(e.target.value)}
                placeholder="Type your Full Legal Name (e.g. /s/ Jeanell Land)"
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeCheckbox"
                  required
                  checked={hasAgreedToTerms}
                  onChange={e => setHasAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-950 border-slate-700 text-amber-400 focus:ring-amber-400"
                />
                <label htmlFor="agreeCheckbox" className="text-[11px] text-slate-400 cursor-pointer">
                  I agree that my typed signature constitutes a legally binding agreement with All Your Needs Reality LLC and designated broker Jeanell Land under the Michigan Uniform Electronic Transactions Act.
                </label>
              </div>
            </div>

            {/* Submit Action */}
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
                disabled={!hasAgreedToTerms || !signatureText.trim() || !clientName.trim()}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs sm:text-sm shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Execute Agreement &amp; Enter Metaverse Real Estate World</span>
              </button>
            </div>
          </form>

          {/* Active Signed Agreements List */}
          {agreements.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                Active Executed Agency Agreements ({agreements.length})
              </h4>
              <div className="space-y-2">
                {agreements.map(agr => (
                  <div
                    key={agr.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{agr.title}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          Active · Verified
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Client: {agr.clientName} · Broker: {agr.brokerageName} ({agr.brokerName})
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadProof(agr)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Download agreement record"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
