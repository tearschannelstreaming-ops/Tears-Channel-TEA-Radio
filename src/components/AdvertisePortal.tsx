import React, { useState } from 'react';
import { AD_PACKAGES } from '../data/mockData';
import { AdPackage } from '../types';
import { Megaphone, CheckCircle2, Tv, Radio, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const AdvertisePortal: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<AdPackage>(AD_PACKAGES[1]);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: 'Automotive & Logistics',
    adLength: '30 Seconds',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        industry: 'Automotive & Logistics',
        adLength: '30 Seconds',
        notes: ''
      });
    }, 4000);
  };

  return (
    <div className="space-y-8">
      
      {/* Editorial Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#1e1529] to-slate-900 border border-slate-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span>NATIONWIDE TELEVISION &amp; RADIO COMMERCIAL AIRTIME</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Broadcast Your Business on T.E.A.R.S. Channel &amp; Roku TV
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Reach engaged viewers across smart TV streaming, mobile apps, and drivers tuning into T.E.A.R.adio across Detroit and nationwide. High-impact exposure for local businesses, commercial land developers, and innovative enterprises.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <span>Roku TV Verified Channel</span>
            <span>·</span>
            <span>T.E.A.R.adio Drive-Time Drops</span>
            <span>·</span>
            <span>Ad Desk: <a href="mailto:support@tearschannel.online" className="text-amber-400 hover:underline">support@tearschannel.online</a></span>
          </div>
        </div>
      </div>

      {/* Package Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {AD_PACKAGES.map(pkg => {
          const isSelected = selectedPackage.id === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-amber-950/20 border-amber-400 shadow-xl ring-1 ring-amber-400/40'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-semibold">{pkg.duration}</span>
                  {isSelected && (
                    <span className="text-[10px] font-mono uppercase bg-amber-400 text-black px-2 py-0.5 rounded font-bold">
                      Selected
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">{pkg.name}</h3>
                
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {pkg.priceEst}
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">{pkg.description}</p>

                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="text-xs font-semibold text-slate-400">Included Distribution:</div>
                  {pkg.platforms.map((plt, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-amber-400 text-xs">✓</span>
                      <span>{plt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="text-slate-500">Best for: </span>
                <span className="text-slate-300 font-medium">{pkg.bestFor}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking / Inquiry Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
        <div className="max-w-2xl mb-6">
          <h3 className="text-xl font-bold text-white">Book Airtime / Schedule Rate Consultation</h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Currently configuring: <strong className="text-amber-400">{selectedPackage.name}</strong> ({selectedPackage.duration} · {selectedPackage.priceEst})
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 bg-amber-400/5 rounded-xl border border-amber-400/20 p-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Commercial Request Received</h4>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Our broadcast advertising department will review your campaign details and contact you within 24 business hours to confirm airtime slots and video asset specs.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Business / Organization Name *
                </label>
                <input
                  required
                  type="text"
                  value={formData.businessName}
                  onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Motor City Logistics Inc."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Contact Person *
                </label>
                <input
                  required
                  type="text"
                  value={formData.contactName}
                  onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="e.g. Jeanell Land"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="marketing@company.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(313) 555-0144"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Industry / Category
                </label>
                <select
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option>Automotive &amp; Logistics</option>
                  <option>Real Estate &amp; Land Development</option>
                  <option>Legal &amp; Professional Practice</option>
                  <option>Restaurant &amp; Hospitality</option>
                  <option>Health &amp; Medical Clinic</option>
                  <option>Entertainment &amp; Media</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Spot Length Preference
                </label>
                <select
                  value={formData.adLength}
                  onChange={e => setFormData({ ...formData, adLength: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option>15 Seconds (Quick Billboard)</option>
                  <option>30 Seconds (Standard TV Commercial)</option>
                  <option>60 Seconds (Full Feature Spot)</option>
                  <option>Dedicated Video Interview Feature</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Campaign Goals &amp; Airtime Window (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Target launch date, audience goals, or existing video asset links..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-amber-400/20"
              >
                <span>Request Airtime Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
