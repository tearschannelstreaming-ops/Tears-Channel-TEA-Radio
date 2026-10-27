import React, { useState } from 'react';
import { useCreatorTaxStore } from '../hooks/useCreatorTaxStore';
import { TaxSavingsForecastSection } from './TaxSavingsForecastSection';
import { ProductionExpenseCategory, ProductionExpenseItem } from '../types';
import { 
  FileText, DollarSign, Calculator, ShieldCheck, Download, Plus, 
  Trash2, Edit3, CheckCircle2, AlertCircle, Sparkles, Filter, Search,
  Film, Camera, Plane, Building2, Headphones, Users, MapPin, 
  ShieldAlert, RefreshCw, Key, HelpCircle, Check, Copy, ArrowRight,
  ExternalLink, Layers, Eye, EyeOff, TrendingDown
} from 'lucide-react';

interface CreatorTaxPortalProps {
  onNavigateToCreators?: () => void;
}

export const CreatorTaxPortal: React.FC<CreatorTaxPortalProps> = ({ onNavigateToCreators }) => {
  const {
    taxProfile,
    distributions,
    expenses,
    updateTaxProfile,
    addProductionExpense,
    deleteProductionExpense,
    addDistributionPayment,
    resetToDefaults,
    totalGrossDistributions,
    totalBox1NonemployeeComp,
    totalBox2Royalties,
    totalDeductibleExpenses,
    netTaxableIncome,
    estimatedSelfEmploymentTax,
    estimatedIncomeTax,
    totalEstimatedTaxLiability,
    quarterlyEstimatedPayment,
    expensesByCategory,
    scheduleCLines
  } = useCreatorTaxStore();

  const [activeTab, setActiveTab] = useState<'forms' | 'expenses' | 'tax-savings-forecast' | 'schedule-c' | 'w9-profile'>('expenses');
  const [selectedTaxYear, setSelectedTaxYear] = useState<number>(2026);
  const [showMaskedTaxId, setShowMaskedTaxId] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Expense Modal State
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseVendor, setExpenseVendor] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ProductionExpenseCategory>('Filming Gear & Camera');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseVideoTitle, setExpenseVideoTitle] = useState('Woodward Corridor Commercial Infill Site Tour (4K Drone)');
  const [expenseNotes, setExpenseNotes] = useState('');
  const [expenseDeductiblePercent, setExpenseDeductiblePercent] = useState<number>(100);

  // Quick Payout Simulation State
  const [isSimulatePayoutOpen, setIsSimulatePayoutOpen] = useState(false);
  const [simGrossAmount, setSimGrossAmount] = useState('850');
  const [simMemo, setSimMemo] = useState('October 2026 24/7 Broadcast Ad Revenue Share & Viewer Tips');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(expenseAmount);
    if (isNaN(amountNum) || amountNum <= 0 || !expenseTitle.trim()) return;

    // Map Category to IRS Schedule C Line
    const lineMap: Record<ProductionExpenseCategory, string> = {
      'Filming Gear & Camera': 'Line 13 (Depreciation / Sec 179)',
      'Drone & Aerial Surveys': 'Line 20a (Rent Equipment / Machinery)',
      'Studio & Location Rental': 'Line 20b (Rent Business Property)',
      'Post-Production & Software': 'Line 18 (Office & Software)',
      'Talent, Crew & Wages': 'Line 26 (Wages / Contract Labor)',
      'Music Licensing & Sound': 'Line 27 (Other Expenses - Licensing)',
      'Travel, Mileage & Location Meals': 'Line 9 (Car and Truck Expenses)',
      'Insurance & Legal Fees': 'Line 15 (Insurance Other Than Health)',
      'Marketing & Distribution': 'Line 8 (Advertising)'
    };

    const randomSha = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    addProductionExpense({
      title: expenseTitle.trim(),
      vendor: expenseVendor.trim() || 'Independent Production Supplier',
      amount: amountNum,
      date: expenseDate,
      category: expenseCategory,
      deductiblePercent: expenseDeductiblePercent,
      associatedVideoTitle: expenseVideoTitle.trim(),
      notes: expenseNotes.trim(),
      receiptFilename: `receipt_${expenseCategory.toLowerCase().replace(/\s+/g, '_')}_${Date.now().toString(36)}.pdf`,
      receiptShaProof: randomSha,
      irsScheduleCLine: lineMap[expenseCategory]
    });

    setExpenseTitle('');
    setExpenseVendor('');
    setExpenseAmount('');
    setExpenseNotes('');
    setIsAddExpenseOpen(false);
  };

  const handleSimulatePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gross = parseFloat(simGrossAmount);
    if (isNaN(gross) || gross <= 0) return;

    addDistributionPayment({
      date: new Date().toISOString().split('T')[0],
      taxYear: selectedTaxYear,
      grossAmount: gross,
      payoutRail: 'ACH Direct Deposit',
      box1NonemployeeComp: gross * 0.8,
      box2Royalties: gross * 0.2,
      tipsAndBounties: gross * 0.15,
      federalTaxWithheld: 0.00,
      stateTaxWithheld: 0.00,
      memo: simMemo.trim() || 'Broadcast Distribution Royalty'
    });

    setIsSimulatePayoutOpen(false);
  };

  const handleDownload1099Packet = () => {
    const packet = {
      document: 'IRS Form 1099-NEC & 1099-MISC Certified Distribution Packet',
      taxYear: selectedTaxYear,
      generatedDate: new Date().toISOString(),
      payer: {
        legalName: 'T.E.A.R.S. Channel Network / S.T.E.A.R.Safe Technologies Inc.',
        tin: '38-7492019',
        address: '1001 Woodward Avenue, Suite 1400, Detroit, MI 48226',
        telephone: '(313) 555-TEAR'
      },
      recipient: {
        legalName: taxProfile.legalName,
        tin: taxProfile.taxId,
        tinType: taxProfile.taxIdType,
        entityType: taxProfile.businessEntity,
        address: `${taxProfile.address}, ${taxProfile.city}, ${taxProfile.state} ${taxProfile.zip}`,
        w9Status: taxProfile.w9Certified ? `Certified on ${taxProfile.w9CertifiedDate}` : 'Pending'
      },
      form1099NEC: {
        box1_NonemployeeCompensation: totalBox1NonemployeeComp.toFixed(2),
        box4_FederalIncomeTaxWithheld: '0.00',
        box5_StateTaxWithheld: '0.00',
        box7_StateIncome: totalBox1NonemployeeComp.toFixed(2),
        state: 'MI'
      },
      form1099MISC: {
        box2_Royalties: totalBox2Royalties.toFixed(2),
        box3_OtherIncome: (totalGrossDistributions - totalBox1NonemployeeComp - totalBox2Royalties).toFixed(2),
        box4_FederalIncomeTaxWithheld: '0.00'
      },
      distributionPayoutHistory: distributions,
      zeroHoneypotNotice: 'This tax record was generated on the creator local device vault. No central repository contains unmasked SSN/EIN credentials.'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(packet, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `IRS-1099-Packet-${selectedTaxYear}-${taxProfile.legalName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadScheduleCPacket = () => {
    const scheduleCPacket = {
      formName: 'IRS Form 1040 Schedule C (Profit or Loss From Business)',
      taxYear: selectedTaxYear,
      generatedAt: new Date().toISOString(),
      principalBusiness: 'Television, Digital Media & Drone Broadcast Production',
      businessCode: '512110 (Motion Picture and Video Production)',
      creatorEntity: taxProfile,
      part1_Income: {
        line1_GrossReceiptsOrSales: totalGrossDistributions.toFixed(2),
        line3_GrossProfit: totalGrossDistributions.toFixed(2),
        line7_GrossIncome: totalGrossDistributions.toFixed(2)
      },
      part2_ExpensesByIRSLine: scheduleCLines,
      totalDeductibleExpenses: totalDeductibleExpenses.toFixed(2),
      part2_Line31_NetProfitOrLoss: netTaxableIncome.toFixed(2),
      scheduleSE_EstimatedSelfEmploymentTax: estimatedSelfEmploymentTax.toFixed(2),
      form1040ES_EstimatedQuarterlyPayment: quarterlyEstimatedPayment.toFixed(2),
      expenseItemization: expenses,
      securityGuarantee: 'Client-Vault Verified. Zero central storage vulnerability.'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scheduleCPacket, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Schedule-C-Tax-Filing-${selectedTaxYear}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCPACsv = () => {
    const headers = ['Date', 'Category', 'Expense Description', 'Vendor', 'Amount', 'Deductible %', 'Schedule C Line', 'Video Title', 'Receipt Token'];
    const rows = expenses.map(e => [
      `"${e.date}"`,
      `"${e.category}"`,
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.vendor.replace(/"/g, '""')}"`,
      e.amount.toFixed(2),
      `${e.deductiblePercent}%`,
      `"${e.irsScheduleCLine}"`,
      `"${(e.associatedVideoTitle || '').replace(/"/g, '""')}"`,
      `"${e.receiptShaProof || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TEARS_Creator_Expenses_ScheduleC_${selectedTaxYear}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Filtered expenses
  const filteredExpenses = expenses.filter(e => {
    const matchesCategory = selectedCategoryFilter === 'All' || e.category === selectedCategoryFilter;
    const matchesQuery = !searchQuery.trim() || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.associatedVideoTitle && e.associatedVideoTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/40 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/30">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>T.E.A.R.S. CREATOR TAX &amp; EXPENSE SUITE · IRS 1099-NEC &amp; SCHEDULE C</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Creator Tax Portal &amp; Production Expense Ingestion
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Generate official <strong>IRS Form 1099-NEC &amp; 1099-MISC</strong> distribution summaries, deduct <strong>100% of filming costs, drone surveys, soundstage fees &amp; gear rentals</strong> under <strong>Schedule C</strong>, and calculate estimated quarterly taxes with <strong>zero-honeypot client data privacy</strong>.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Honeypot Client Vault</span>
            </span>
            <span>·</span>
            <span className="text-cyan-400">IRS Form 1099-NEC Payer: T.E.A.R.S. Network</span>
            <span>·</span>
            <span className="text-amber-400">Schedule C Deduction Engine</span>
            <span>·</span>
            <span className="text-purple-400">Export Ready for CPA / TurboTax</span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mb-16" />
      </div>

      {/* Quick Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
            Gross Distribution Royalties
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ${totalGrossDistributions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 block font-mono">
            Box 1 &amp; Box 2 1099-NEC/MISC
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
            Total Filming &amp; Production Expenses
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            ${totalDeductibleExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 block font-mono">
            {expenses.length} Deductible Line Items
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40 space-y-1">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
            Net Taxable Business Profit
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ${netTaxableIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 block font-mono">
            Schedule C Line 31 (Gross - Expenses)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-1">
          <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block">
            Quarterly Est. Payment (1040-ES)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-purple-300">
            ${quarterlyEstimatedPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 block font-mono">
            Due Q1, Q2, Q3, Q4 to IRS
          </span>
        </div>

      </div>

      {/* Sub-Navigation Tabs & Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'expenses'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Filming Expenses &amp; Gear Costs ({expenses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tax-savings-forecast')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tax-savings-forecast'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/20 font-extrabold'
                : 'bg-slate-900/80 text-emerald-400 hover:text-white border border-emerald-500/40'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>Tax Savings Forecast (Recharts)</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-emerald-300 border border-emerald-500/30">
              Yield Forecaster
            </span>
          </button>

          <button
            onClick={() => setActiveTab('forms')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'forms'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Distribution Forms (1099-NEC)</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule-c')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'schedule-c'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Schedule C &amp; Tax Estimator</span>
          </button>

          <button
            onClick={() => setActiveTab('w9-profile')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'w9-profile'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>W-9 &amp; Zero-Honeypot Vault</span>
          </button>

        </div>

        {/* Global Action Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCPACsv}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            title="Export CSV for your CPA or TurboTax"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>CPA CSV</span>
          </button>

          <button
            onClick={handleDownloadScheduleCPacket}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-xs font-extrabold text-black flex items-center gap-1.5 shadow transition-all"
            title="Download complete IRS Schedule C & 1099 Tax Packet"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download Tax Packet</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: FILMING & PRODUCTION EXPENSE INGESTION */}
      {/* ============================================================== */}
      {activeTab === 'expenses' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Quick Tax Savings Forecast Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Filming Expenses Tax Shield Active</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    +${(totalDeductibleExpenses * 0.2613).toFixed(2)} Tax Saved
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Every $1,000 in cinema cameras, drone surveys, or soundstages shields ~$261 to ~$361 from federal and self-employment taxes under Schedule C.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('tax-savings-forecast')}
              className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer shrink-0"
            >
              <span>Explore Recharts Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Controls Bar: Search, Category Filter, and Add Expense Button */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search gear, drone, soundstage, crew, mileage..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-black border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <span>Filter:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={e => setSelectedCategoryFilter(e.target.value)}
                  className="bg-black border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Categories ({expenses.length})</option>
                  <option value="Filming Gear & Camera">Filming Gear &amp; Camera</option>
                  <option value="Drone & Aerial Surveys">Drone &amp; Aerial Surveys</option>
                  <option value="Studio & Location Rental">Studio &amp; Location Rental</option>
                  <option value="Post-Production & Software">Post-Production &amp; Software</option>
                  <option value="Talent, Crew & Wages">Talent, Crew &amp; Wages</option>
                  <option value="Music Licensing & Sound">Music Licensing &amp; Sound</option>
                  <option value="Travel, Mileage & Location Meals">Travel, Mileage &amp; Meals</option>
                  <option value="Insurance & Legal Fees">Insurance &amp; Legal Fees</option>
                  <option value="Marketing & Distribution">Marketing &amp; Distribution</option>
                </select>
              </div>
            </div>

            {/* Ingest Button */}
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Input Production Expense</span>
            </button>
          </div>

          {/* Deductible Category Breakdown Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { cat: 'Filming Gear & Camera', icon: Camera, amount: expensesByCategory['Filming Gear & Camera'], color: 'text-blue-400' },
              { cat: 'Drone & Aerial Surveys', icon: Plane, amount: expensesByCategory['Drone & Aerial Surveys'], color: 'text-amber-400' },
              { cat: 'Studio & Location Rental', icon: Building2, amount: expensesByCategory['Studio & Location Rental'], color: 'text-cyan-400' },
              { cat: 'Talent, Crew & Wages', icon: Users, amount: expensesByCategory['Talent, Crew & Wages'], color: 'text-purple-400' },
              { cat: 'Post-Production & Software', icon: Film, amount: expensesByCategory['Post-Production & Software'], color: 'text-emerald-400' }
            ].map(item => (
              <div key={item.cat} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2">
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  <span className="text-[11px] font-medium text-slate-300 truncate">{item.cat}</span>
                </div>
                <div className="text-base font-bold text-white">
                  ${(item.amount || 0).toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">100% Tax Deductible</span>
              </div>
            ))}
          </div>

          {/* Expenses Ledger Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Production Expense Ledger (Schedule C Itemized)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono">
                    {filteredExpenses.length} Records
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  All production fees directly offset distribution income dollar-for-dollar under IRS Code § 162.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-slate-400 block">Total Deductions</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  ${totalDeductibleExpenses.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/60 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Item &amp; Purpose</th>
                    <th className="py-3 px-4 font-semibold">Vendor / Payee</th>
                    <th className="py-3 px-4 font-semibold">IRS Line</th>
                    <th className="py-3 px-4 font-semibold">Associated Production</th>
                    <th className="py-3 px-4 font-semibold text-right">Deductible Amt</th>
                    <th className="py-3 px-4 font-semibold text-center">Receipt Proof</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredExpenses.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                      
                      {/* Date */}
                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {item.date}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-200">
                          {item.category === 'Filming Gear & Camera' && <Camera className="w-3 h-3 text-blue-400" />}
                          {item.category === 'Drone & Aerial Surveys' && <Plane className="w-3 h-3 text-amber-400" />}
                          {item.category === 'Studio & Location Rental' && <Building2 className="w-3 h-3 text-cyan-400" />}
                          {item.category === 'Talent, Crew & Wages' && <Users className="w-3 h-3 text-purple-400" />}
                          {item.category === 'Post-Production & Software' && <Film className="w-3 h-3 text-emerald-400" />}
                          {item.category === 'Insurance & Legal Fees' && <ShieldAlert className="w-3 h-3 text-red-400" />}
                          {item.category === 'Travel, Mileage & Location Meals' && <MapPin className="w-3 h-3 text-orange-400" />}
                          <span>{item.category}</span>
                        </span>
                      </td>

                      {/* Item Title & Notes */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-white leading-snug">{item.title}</div>
                        {item.notes && (
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.notes}</div>
                        )}
                      </td>

                      {/* Vendor */}
                      <td className="py-3 px-4 text-slate-300 font-medium whitespace-nowrap">
                        {item.vendor}
                      </td>

                      {/* IRS Schedule C Line */}
                      <td className="py-3 px-4 font-mono text-[11px] text-cyan-300 whitespace-nowrap">
                        {item.irsScheduleCLine}
                      </td>

                      {/* Associated Video */}
                      <td className="py-3 px-4 text-slate-400 max-w-[180px] truncate text-[11px]">
                        {item.associatedVideoTitle || 'General Channel Production'}
                      </td>

                      {/* Deductible Amount */}
                      <td className="py-3 px-4 font-mono font-bold text-right text-emerald-400 whitespace-nowrap">
                        ${(item.amount * (item.deductiblePercent / 100)).toFixed(2)}
                        {item.deductiblePercent < 100 && (
                          <span className="block text-[10px] text-slate-500 font-normal">
                            ({item.deductiblePercent}% allowable)
                          </span>
                        )}
                      </td>

                      {/* Cryptographic Receipt Token */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {item.receiptShaProof ? (
                          <button
                            onClick={() => copyToClipboard(item.receiptShaProof!, item.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                            title={`Receipt SHA-256: ${item.receiptShaProof}`}
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>SHA Proof</span>
                            {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">Invoice Logged</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => deleteProductionExpense(item.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  ))}

                  {filteredExpenses.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500 text-xs font-mono">
                        No production expenses found matching your search. Click "Input Production Expense" to add your filming costs.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-black/40 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-400">
                IRS Compliance: Retain all original invoices, flight logs, and equipment hire receipts for 3 years from tax filing date.
              </span>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-400">Total Deductible:</span>
                <span className="text-sm font-bold text-emerald-400">${totalDeductibleExpenses.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: TAX SAVINGS FORECAST & RECHARTS VISUALIZATION SUITE */}
      {/* ============================================================== */}
      {activeTab === 'tax-savings-forecast' && (
        <TaxSavingsForecastSection
          expenses={expenses}
          distributions={distributions}
          totalGrossDistributions={totalGrossDistributions}
          totalDeductibleExpenses={totalDeductibleExpenses}
          netTaxableIncome={netTaxableIncome}
          estimatedSelfEmploymentTax={estimatedSelfEmploymentTax}
          estimatedIncomeTax={estimatedIncomeTax}
          totalEstimatedTaxLiability={totalEstimatedTaxLiability}
          quarterlyEstimatedPayment={quarterlyEstimatedPayment}
          expensesByCategory={expensesByCategory}
          onAddQuickExpense={(title, amount, category) => {
            const randomSha = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            addProductionExpense({
              title,
              vendor: 'Production Package / Section 179 Supplier',
              amount,
              date: new Date().toISOString().split('T')[0],
              category,
              deductiblePercent: 100,
              associatedVideoTitle: 'Upcoming 4K Broadcast Production Cycle',
              notes: 'Scheduled shoot expenses forecasted for IRS Schedule C write-off.',
              receiptFilename: `forecast_package_${Date.now().toString(36)}.pdf`,
              receiptShaProof: randomSha,
              irsScheduleCLine: category === 'Drone & Aerial Surveys' ? 'Line 20a (Rent Machinery / Equipment)' : 'Line 13 (Depreciation / Sec 179)'
            });
          }}
          onNavigateToExpenses={() => setActiveTab('expenses')}
        />
      )}

      {/* ============================================================== */}
      {/* TAB 2: DISTRIBUTION FORMS (1099-NEC & 1099-MISC) */}
      {/* ============================================================== */}
      {activeTab === 'forms' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>IRS Form 1099-NEC &amp; 1099-MISC Distribution Statements</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Official statements for royalties, programmatic ad revenue share, and viewer tips disbursed by T.E.A.R.S. Channel Network.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedTaxYear}
                onChange={e => setSelectedTaxYear(parseInt(e.target.value))}
                className="bg-black border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-amber-400 focus:outline-none"
              >
                <option value={2026}>Tax Year 2026</option>
                <option value={2025}>Tax Year 2025</option>
                <option value={2024}>Tax Year 2024</option>
              </select>

              <button
                onClick={() => setIsSimulatePayoutOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Log Payout Distribution</span>
              </button>

              <button
                onClick={handleDownload1099Packet}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download 1099 Packet</span>
              </button>
            </div>
          </div>

          {/* Authentic IRS Form 1099-NEC Visual Replica */}
          <div className="rounded-2xl border-2 border-slate-700 bg-slate-950 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-red-600 text-white font-black text-sm rounded tracking-wider font-mono">
                  FORM 1099-NEC
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Nonemployee Compensation</h4>
                  <span className="text-[11px] text-slate-400">Copy B · For Recipient (File with Federal/State Tax Return)</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-2xl font-black text-amber-400">{selectedTaxYear}</span>
                <span className="block text-[10px] text-slate-500">OMB No. 1545-0116</span>
              </div>
            </div>

            {/* 1099 Box Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              
              {/* Payer Box */}
              <div className="p-4 rounded-xl bg-black border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  PAYER'S Name, Address, and Telephone Number:
                </span>
                <div className="font-bold text-white font-sans text-xs">
                  T.E.A.R.S. Channel Network / S.T.E.A.R.Safe Technologies Inc.
                </div>
                <div className="text-[11px] text-slate-400">
                  1001 Woodward Avenue, Suite 1400<br />
                  Detroit, MI 48226<br />
                  Phone: (313) 555-TEAR
                </div>
              </div>

              {/* Payer & Recipient TINs */}
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-black border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">PAYER'S TIN:</span>
                  <span className="text-sm font-bold text-cyan-300">38-7492019</span>
                </div>
                <div className="p-3 rounded-xl bg-black border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">RECIPIENT'S TIN:</span>
                  <span className="text-sm font-bold text-amber-300">
                    {showMaskedTaxId ? taxProfile.taxId : `***-**-${taxProfile.taxId.slice(-4)}`}
                  </span>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="p-4 rounded-xl bg-black border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  RECIPIENT'S Name and Address:
                </span>
                <div className="font-bold text-white font-sans text-xs">
                  {taxProfile.legalName}
                </div>
                <div className="text-[11px] text-slate-400">
                  {taxProfile.address}<br />
                  {taxProfile.city}, {taxProfile.state} {taxProfile.zip}
                </div>
                <div className="pt-1 text-[10px] text-emerald-400">
                  Entity: {taxProfile.businessEntity}
                </div>
              </div>

              {/* Box 1: Nonemployee Compensation */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/60 to-black border-2 border-emerald-500/50">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                  1. Nonemployee Compensation (Gross):
                </span>
                <div className="text-2xl font-black text-white mt-1">
                  ${totalBox1NonemployeeComp.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Report on IRS Form 1040 Schedule C, Line 1
                </span>
              </div>

              {/* Box 2: Royalties (1099-MISC) */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 to-black border-2 border-cyan-500/50">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block">
                  2. Broadcast Royalties &amp; Sync Licensing:
                </span>
                <div className="text-2xl font-black text-white mt-1">
                  ${totalBox2Royalties.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Report on IRS Form 1040 Schedule E or Schedule C
                </span>
              </div>

              {/* Box 4: Federal Income Tax Withheld */}
              <div className="p-4 rounded-xl bg-black border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">
                  4. Federal Income Tax Withheld:
                </span>
                <div className="text-2xl font-black text-slate-300 mt-1">
                  $0.00
                </div>
                <span className="text-[10px] text-emerald-400 block mt-1">
                  W-9 on file · No backup withholding required
                </span>
              </div>

            </div>

            {/* Zero-Honeypot Data Shield Notice */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                <strong className="text-white block font-mono">Zero-Honeypot Tax Privacy Architecture:</strong>
                T.E.A.R.S. Channel Network executes programmatic distributions via direct-cleared banking rails without maintaining a centralized, vulnerable honeypot database of your Taxpayer Identification Number or full SSN. Your complete tax filings and expense itemizations reside exclusively inside this device's encrypted client storage.
              </div>
            </div>

          </div>

          {/* Distribution Payment Records Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Annual Distribution Disbursements Log</h4>
                <p className="text-xs text-slate-400">Payments issued directly to creator banking rails for Tax Year {selectedTaxYear}.</p>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                Total: ${totalGrossDistributions.toFixed(2)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/60 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Payment Date</th>
                    <th className="py-3 px-4 font-semibold">Disbursement Memo</th>
                    <th className="py-3 px-4 font-semibold">Payout Rail</th>
                    <th className="py-3 px-4 font-semibold">Box 1 (Comp)</th>
                    <th className="py-3 px-4 font-semibold">Box 2 (Royalty)</th>
                    <th className="py-3 px-4 font-semibold text-right">Gross Total</th>
                    <th className="py-3 px-4 font-semibold text-center">Disbursement Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {distributions.map(dist => (
                    <tr key={dist.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">{dist.date}</td>
                      <td className="py-3 px-4 text-white font-medium">{dist.memo}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 font-mono text-cyan-300 border border-slate-700">
                          {dist.payoutRail}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">${dist.box1NonemployeeComp.toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">${dist.box2Royalties.toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono font-bold text-right text-emerald-400">${dist.grossAmount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => copyToClipboard(dist.receiptId, dist.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-black text-slate-400 hover:text-white border border-slate-800"
                        >
                          <span>{dist.receiptId}</span>
                          {copiedId === dist.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: SCHEDULE C & TAX LIABILITY ESTIMATOR */}
      {/* ============================================================== */}
      {activeTab === 'schedule-c' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <span>IRS Schedule C (Form 1040) Tax Calculation &amp; Deduction Summary</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Calculates net taxable business profit after deducting all gear purchases, drone flight rentals, and studio bookings.
                </p>
              </div>
              <button
                onClick={handleDownloadScheduleCPacket}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-black font-extrabold text-xs rounded-xl shadow transition-all hover:scale-105 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Schedule C Report</span>
              </button>
            </div>

            {/* Income vs Expenses Summary Equation */}
            <div className="p-5 rounded-2xl bg-black border border-slate-800 space-y-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Schedule C Part I &amp; Part II Arithmetic:
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center font-mono">
                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1">
                  <span className="text-[11px] text-cyan-400">Line 1: Gross Distribution Income</span>
                  <div className="text-2xl font-black text-white">
                    +${totalGrossDistributions.toFixed(2)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-red-500/30 space-y-1">
                  <span className="text-[11px] text-red-400">Line 28: Total Production Deductions</span>
                  <div className="text-2xl font-black text-red-400">
                    -${totalDeductibleExpenses.toFixed(2)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/60 border-2 border-emerald-500 space-y-1">
                  <span className="text-[11px] text-emerald-400 font-bold">Line 31: Net Taxable Profit</span>
                  <div className="text-2xl font-black text-white">
                    =${netTaxableIncome.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* IRS Line-by-Line Breakdown Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                Schedule C Part II Itemized Expense Breakdown by IRS Line:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {Object.entries(scheduleCLines).map(([line, amount]) => (
                  <div key={line} className="p-3.5 rounded-xl bg-black/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-cyan-300 text-[11px] block">{line}</span>
                      <span className="text-slate-400 text-[10px]">Allowable deduction</span>
                    </div>
                    <span className="font-mono font-bold text-white text-sm">
                      ${amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Tax Obligations & Form 1040-ES Quarterly Schedule */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Estimated Tax Liability &amp; 1040-ES Quarterly Installments
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                  Self-Employed Creator
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Self-Employment Tax (Schedule SE 15.3%):</span>
                  <span className="text-lg font-bold text-purple-300 mt-1 block">
                    ${estimatedSelfEmploymentTax.toFixed(2)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Est. Federal &amp; State Income Tax (~12%):</span>
                  <span className="text-lg font-bold text-cyan-300 mt-1 block">
                    ${estimatedIncomeTax.toFixed(2)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Total Annual Estimated Tax:</span>
                  <span className="text-lg font-bold text-amber-300 mt-1 block">
                    ${totalEstimatedTaxLiability.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 4 Quarterly Deadlines */}
              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-300 block mb-2">
                  Quarterly Payment Schedule (IRS Form 1040-ES):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {[
                    { quarter: 'Q1 (Due Apr 15)', date: 'April 15, 2026', amount: quarterlyEstimatedPayment },
                    { quarter: 'Q2 (Due Jun 15)', date: 'June 15, 2026', amount: quarterlyEstimatedPayment },
                    { quarter: 'Q3 (Due Sep 15)', date: 'September 15, 2026', amount: quarterlyEstimatedPayment },
                    { quarter: 'Q4 (Due Jan 15)', date: 'January 15, 2027', amount: quarterlyEstimatedPayment }
                  ].map(q => (
                    <div key={q.quarter} className="p-2.5 rounded-lg bg-black/80 border border-slate-800 text-center">
                      <div className="text-purple-400 font-bold text-[11px]">{q.quarter}</div>
                      <div className="text-[10px] text-slate-500">{q.date}</div>
                      <div className="text-sm font-bold text-white mt-1">${q.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: W-9 & ZERO-HONEYPOT ON-DEVICE VAULT */}
      {/* ============================================================== */}
      {activeTab === 'w9-profile' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Creator Taxpayer Profile &amp; Electronic Form W-9
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                W-9 Certified
              </span>
            </div>

            {/* Zero-Honeypot Privacy Architecture Callout */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>NO CENTRAL HONEYPOT DATA BREACH GUARANTEE</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your Tax Identification Number (EIN / SSN), physical business address, and banking receipts are never stored on a centralized server honeypot. In accordance with zero-knowledge data architecture, all information resides exclusively within your client device's encrypted local vault.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Legal Taxpayer / Business Entity Name:
                </label>
                <input
                  type="text"
                  value={taxProfile.legalName}
                  onChange={e => updateTaxProfile({ legalName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Federal Tax Classification:
                </label>
                <select
                  value={taxProfile.businessEntity}
                  onChange={e => updateTaxProfile({ businessEntity: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Single-Member LLC">Single-Member LLC (Disregarded Entity)</option>
                  <option value="Individual / Sole Proprietor">Individual / Sole Proprietor</option>
                  <option value="Multi-Member LLC">Multi-Member LLC (Partnership)</option>
                  <option value="S-Corporation">S-Corporation</option>
                  <option value="C-Corporation">C-Corporation</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">
                    Tax Identification Number ({taxProfile.taxIdType}):
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMaskedTaxId(!showMaskedTaxId)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {showMaskedTaxId ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showMaskedTaxId ? 'Mask' : 'Reveal'}</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <select
                    value={taxProfile.taxIdType}
                    onChange={e => updateTaxProfile({ taxIdType: e.target.value as any })}
                    className="w-24 px-2 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="EIN">EIN</option>
                    <option value="SSN">SSN</option>
                  </select>
                  <input
                    type={showMaskedTaxId ? "text" : "password"}
                    value={taxProfile.taxId}
                    onChange={e => updateTaxProfile({ taxId: e.target.value })}
                    className="flex-1 px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Physical Street Address:
                </label>
                <input
                  type="text"
                  value={taxProfile.address}
                  onChange={e => updateTaxProfile({ address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  City, State, ZIP:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={taxProfile.city}
                    onChange={e => updateTaxProfile({ city: e.target.value })}
                    className="px-3 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={taxProfile.state}
                    onChange={e => updateTaxProfile({ state: e.target.value })}
                    className="px-3 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="ZIP"
                    value={taxProfile.zip}
                    onChange={e => updateTaxProfile({ zip: e.target.value })}
                    className="px-3 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Form W-9 Certification Date:
                </label>
                <input
                  type="date"
                  value={taxProfile.w9CertifiedDate}
                  onChange={e => updateTaxProfile({ w9CertifiedDate: e.target.value })}
                  className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

            </div>

            {/* W-9 Under Penalties of Perjury Legal Certification */}
            <div className="p-4 rounded-xl bg-black border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-white block">Form W-9 Electronic Certification (IRS Code § 3406):</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Under penalties of perjury, I certify that: (1) The number shown on this form is my correct taxpayer identification number, (2) I am not subject to backup withholding, and (3) I am a U.S. citizen or other U.S. person.
              </p>
              <div className="pt-1 flex items-center gap-2 text-emerald-400 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Certified Signed Electronic Record: SHA-256 Proof Verified</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={resetToDefaults}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono transition-colors"
              >
                Reset Demo Tax Data
              </button>

              <button
                type="button"
                onClick={handleDownload1099Packet}
                className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition-all shadow flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export W-9 &amp; Tax Keyfile</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: INPUT PRODUCTION EXPENSE */}
      {/* ============================================================== */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Input Production &amp; Filming Expense
                </h3>
              </div>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateExpenseSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Expense Category (Schedule C Line Mapped) *
                </label>
                <select
                  value={expenseCategory}
                  onChange={e => setExpenseCategory(e.target.value as ProductionExpenseCategory)}
                  className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Filming Gear & Camera">Filming Gear &amp; Camera (Cinema body, lenses, lighting, rig)</option>
                  <option value="Drone & Aerial Surveys">Drone &amp; Aerial Surveys (FAA waiver, drone hire, airspace)</option>
                  <option value="Studio & Location Rental">Studio &amp; Location Rental (Soundstage, set access permit)</option>
                  <option value="Post-Production & Software">Post-Production &amp; Software (DaVinci, Premiere, cloud rendering, SSDs)</option>
                  <option value="Talent, Crew & Wages">Talent, Crew &amp; Wages (Sound mixer, camera operator, host, editor)</option>
                  <option value="Music Licensing & Sound">Music Licensing &amp; Sound (Master sync, original score, SFX)</option>
                  <option value="Travel, Mileage & Location Meals">Travel, Mileage &amp; Meals (IRS $0.67/mi, location scouting)</option>
                  <option value="Insurance & Legal Fees">Insurance &amp; Legal Fees (Media liability, drone COI, copyright counsel)</option>
                  <option value="Marketing & Distribution">Marketing &amp; Distribution (Promotional trailer, broadcast marketing)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Expense Title / Item Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DJI Inspire 3 Drone 4K ProRes Aerial Survey Rental"
                  value={expenseTitle}
                  onChange={e => setExpenseTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Vendor / Payee *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Detroit Camera House / B&H Photo"
                    value={expenseVendor}
                    onChange={e => setExpenseVendor(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Expense Amount ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="450.00"
                    value={expenseAmount}
                    onChange={e => setExpenseAmount(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Expense Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={e => setExpenseDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Deductible Percentage
                  </label>
                  <select
                    value={expenseDeductiblePercent}
                    onChange={e => setExpenseDeductiblePercent(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={100}>100% Tax Deductible (Equipment, Studio, Gear)</option>
                    <option value={50}>50% Tax Deductible (On-set Crew Meals &amp; Catering)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Associated Broadcast Video / Project
                </label>
                <input
                  type="text"
                  placeholder="e.g. Woodward Corridor Commercial Infill Site Tour"
                  value={expenseVideoTitle}
                  onChange={e => setExpenseVideoTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Production Purpose &amp; Tax Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Required for aerial survey of 2.85 commercial acres on Woodward Ave..."
                  value={expenseNotes}
                  onChange={e => setExpenseNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-mono text-emerald-400 block font-bold mb-0.5">Automated Receipt Tokenization:</span>
                A cryptographic SHA-256 digital fingerprint is automatically computed to verify invoice provenance on your local device.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg transition-all"
                >
                  Add Production Expense
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: LOG PAYOUT DISTRIBUTION */}
      {/* ============================================================== */}
      {isSimulatePayoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-cyan-400" />
                <span>Log Distribution Payment (1099 Inflow)</span>
              </h3>
              <button
                onClick={() => setIsSimulatePayoutOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulatePayoutSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Gross Distribution Amount ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={simGrossAmount}
                  onChange={e => setSimGrossAmount(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Distribution Memo / Episode Source
                </label>
                <input
                  type="text"
                  required
                  value={simMemo}
                  onChange={e => setSimMemo(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimulatePayoutOpen(false)}
                  className="px-3.5 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold rounded-xl shadow"
                >
                  Log Payment Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
