import { useState, useEffect, useCallback, useMemo } from 'react';
import { CreatorTaxProfile, ProductionExpenseItem, DistributionPaymentRecord, ProductionExpenseCategory } from '../types';

const TAX_PROFILE_KEY = 'tears_creator_tax_profile_v1';
const EXPENSES_KEY = 'tears_creator_expenses_v1';
const DISTRIBUTIONS_KEY = 'tears_creator_distributions_v1';

const INITIAL_TAX_PROFILE: CreatorTaxProfile = {
  legalName: 'Detroit Sovereign Media LLC',
  businessEntity: 'Single-Member LLC',
  taxIdType: 'EIN',
  taxId: '38-9418290',
  address: '1001 Woodward Avenue, Suite 1400',
  city: 'Detroit',
  state: 'MI',
  zip: '48226',
  w9Certified: true,
  w9CertifiedDate: '2026-01-15'
};

const INITIAL_DISTRIBUTIONS: DistributionPaymentRecord[] = [
  {
    id: 'dist-2026-01',
    date: '2026-03-31',
    taxYear: 2026,
    grossAmount: 1450.00,
    payoutRail: 'ACH Direct Deposit',
    box1NonemployeeComp: 1250.00,
    box2Royalties: 200.00,
    tipsAndBounties: 150.00,
    federalTaxWithheld: 0.00,
    stateTaxWithheld: 0.00,
    receiptId: 'RCPT-ACH-20260331-891',
    memo: 'Q1 2026 70% Ad Revenue Share & Broadcast Royalty Distribution'
  },
  {
    id: 'dist-2026-02',
    date: '2026-06-30',
    taxYear: 2026,
    grossAmount: 1895.50,
    payoutRail: 'ACH Direct Deposit',
    box1NonemployeeComp: 1500.00,
    box2Royalties: 395.50,
    tipsAndBounties: 280.00,
    federalTaxWithheld: 0.00,
    stateTaxWithheld: 0.00,
    receiptId: 'RCPT-ACH-20260630-412',
    memo: 'Q2 2026 Primetime True Crime & Real Estate Tour Broadcast Share'
  },
  {
    id: 'dist-2026-03',
    date: '2026-09-30',
    taxYear: 2026,
    grossAmount: 2150.00,
    payoutRail: 'ACH Direct Deposit',
    box1NonemployeeComp: 1800.00,
    box2Royalties: 350.00,
    tipsAndBounties: 340.00,
    federalTaxWithheld: 0.00,
    stateTaxWithheld: 0.00,
    receiptId: 'RCPT-ACH-20260930-774',
    memo: 'Q3 2026 Woodward Commercial Land Infill Tour Referral Bounty (Token AC8E6C053)'
  }
];

const INITIAL_EXPENSES: ProductionExpenseItem[] = [
  {
    id: 'exp-101',
    date: '2026-02-14',
    category: 'Drone & Aerial Surveys',
    title: 'DJI Inspire 3 Aerial Drone Kit Rental & Airspace Waiver',
    vendor: 'Detroit Cinema Rental House',
    amount: 580.00,
    deductiblePercent: 100,
    associatedVideoTitle: 'Woodward Corridor Commercial Infill Site Tour (4K Drone)',
    receiptFilename: 'receipt_drone_rental_feb2026.pdf',
    receiptShaProof: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    irsScheduleCLine: 'Line 20a (Rent/Lease Vehicles, Machinery, Equipment)',
    notes: 'FAA Part 107 Class D Airspace authorization and 4K ProRes RAW drone capture.'
  },
  {
    id: 'exp-102',
    date: '2026-03-02',
    category: 'Filming Gear & Camera',
    title: 'Sony FX6 Cinema Camera & 24-70mm G-Master Lens Package',
    vendor: 'B&H Photo Video / Michigan Camera Hub',
    amount: 850.00,
    deductiblePercent: 100,
    associatedVideoTitle: 'Woodward Corridor Commercial Infill Site Tour (4K Drone)',
    receiptFilename: 'invoice_camera_fx6_march.pdf',
    receiptShaProof: 'b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01',
    irsScheduleCLine: 'Line 13 (Depreciation and Section 179 Expense Deduction)',
    notes: 'Broadcast 4K 10-bit 4:2:2 cinema camera gear for ground-level walk of 2.85-acre parcel.'
  },
  {
    id: 'exp-103',
    date: '2026-04-18',
    category: 'Studio & Location Rental',
    title: 'Detroit Downtown Soundstage & Acoustic Stage Booking (Day Rate)',
    vendor: 'Motown Riverfront Soundstage LLC',
    amount: 650.00,
    deductiblePercent: 100,
    associatedVideoTitle: 'Detroit Soul Sessions: Live Studio Jam & Rhythm Section',
    receiptFilename: 'soundstage_rental_agreement.pdf',
    receiptShaProof: 'c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012',
    irsScheduleCLine: 'Line 20b (Rent or Lease Other Business Property)',
    notes: 'Acoustically isolated soundstage session for live rhythm section broadcast recording.'
  },
  {
    id: 'exp-104',
    date: '2026-05-10',
    category: 'Talent, Crew & Wages',
    title: '1st Assistant Camera (AC) & Production Sound Mixer Compensation',
    vendor: 'Great Lakes Film Crew Guild (Contract 1099-NEC)',
    amount: 900.00,
    deductiblePercent: 100,
    associatedVideoTitle: 'Detroit Soul Sessions: Live Studio Jam & Rhythm Section',
    receiptFilename: 'crew_invoice_signed_w9.pdf',
    receiptShaProof: 'd4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123',
    irsScheduleCLine: 'Line 26 (Wages / Contract Labor)',
    notes: 'Boom mic operator and 2nd camera focus puller for 10-hour studio day.'
  },
  {
    id: 'exp-105',
    date: '2026-06-05',
    category: 'Post-Production & Software',
    title: 'Blackmagic DaVinci Resolve Studio & 4TB NVMe RAID Drive',
    vendor: 'Apple Inc. & B&H Photo',
    amount: 420.00,
    deductiblePercent: 100,
    associatedVideoTitle: 'All T.E.A.R.S. Channel Uploads',
    receiptFilename: 'software_editing_hardware.pdf',
    receiptShaProof: 'e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01234',
    irsScheduleCLine: 'Line 18 (Office Expense & Software)',
    notes: 'Color grading suite and ultra-fast high bitrate SSD array for 4K video exports.'
  },
  {
    id: 'exp-106',
    date: '2026-07-22',
    category: 'Insurance & Legal Fees',
    title: 'S.T.E.A.R.Safe CyberSure™ & Aerial Drone Liability Policy Premium',
    vendor: 'S.T.E.A.R.Safe Risk Solutions & CyberSure Mutual LLC',
    amount: 399.00,
    deductiblePercent: 100,
    associatedVideoTitle: 'All T.E.A.R.S. Channel Broadcasts',
    receiptFilename: 'certificate_of_insurance_CYBERSURE.pdf',
    receiptShaProof: 'f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012345',
    irsScheduleCLine: 'Line 15 (Insurance Other Than Health)',
    notes: 'Annual policy protecting client device vault and zero-liability broadcast indemnity.'
  },
  {
    id: 'exp-107',
    date: '2026-08-11',
    category: 'Travel, Mileage & Location Meals',
    title: 'On-Location Commercial Site Survey Mileage (340 Miles @ $0.67/mi)',
    vendor: 'Standard IRS Mileage Deduction Log',
    amount: 227.80,
    deductiblePercent: 100,
    associatedVideoTitle: 'Woodward Corridor Commercial Infill Site Tour (4K Drone)',
    receiptFilename: 'mileage_log_woodward_corridor.pdf',
    receiptShaProof: '0718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456',
    irsScheduleCLine: 'Line 9 (Car and Truck Expenses)',
    notes: 'Direct transit between editing suite, soundstage, and 4 Detroit infill land parcels.'
  }
];

export function useCreatorTaxStore() {
  const [taxProfile, setTaxProfile] = useState<CreatorTaxProfile>(() => {
    try {
      const saved = localStorage.getItem(TAX_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // storage unavailable
    }
    return INITIAL_TAX_PROFILE;
  });

  const [distributions, setDistributions] = useState<DistributionPaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(DISTRIBUTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // storage unavailable
    }
    return INITIAL_DISTRIBUTIONS;
  });

  const [expenses, setExpenses] = useState<ProductionExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(EXPENSES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // storage unavailable
    }
    return INITIAL_EXPENSES;
  });

  // Local storage persistence (Never on server honeypot)
  useEffect(() => {
    try {
      localStorage.setItem(TAX_PROFILE_KEY, JSON.stringify(taxProfile));
    } catch {}
  }, [taxProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(DISTRIBUTIONS_KEY, JSON.stringify(distributions));
    } catch {}
  }, [distributions]);

  useEffect(() => {
    try {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    } catch {}
  }, [expenses]);

  // Actions
  const updateTaxProfile = useCallback((profile: Partial<CreatorTaxProfile>) => {
    setTaxProfile(prev => ({ ...prev, ...profile }));
  }, []);

  const addProductionExpense = useCallback((item: Omit<ProductionExpenseItem, 'id'>) => {
    const newItem: ProductionExpenseItem = {
      ...item,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newItem, ...prev]);
    return newItem;
  }, []);

  const deleteProductionExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const editProductionExpense = useCallback((id: string, updated: Partial<ProductionExpenseItem>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  }, []);

  const addDistributionPayment = useCallback((payment: Omit<DistributionPaymentRecord, 'id' | 'receiptId'>) => {
    const newPayment: DistributionPaymentRecord = {
      ...payment,
      id: `dist-${Date.now()}`,
      receiptId: `RCPT-ACH-${Date.now().toString(36).toUpperCase()}`
    };
    setDistributions(prev => [newPayment, ...prev]);
    return newPayment;
  }, []);

  const resetToDefaults = useCallback(() => {
    setTaxProfile(INITIAL_TAX_PROFILE);
    setDistributions(INITIAL_DISTRIBUTIONS);
    setExpenses(INITIAL_EXPENSES);
  }, []);

  // Financial Computations
  const totalGrossDistributions = useMemo(() => {
    return distributions.reduce((sum, d) => sum + d.grossAmount, 0);
  }, [distributions]);

  const totalBox1NonemployeeComp = useMemo(() => {
    return distributions.reduce((sum, d) => sum + d.box1NonemployeeComp, 0);
  }, [distributions]);

  const totalBox2Royalties = useMemo(() => {
    return distributions.reduce((sum, d) => sum + d.box2Royalties, 0);
  }, [distributions]);

  const totalDeductibleExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (e.amount * (e.deductiblePercent / 100)), 0);
  }, [expenses]);

  const netTaxableIncome = useMemo(() => {
    return Math.max(0, totalGrossDistributions - totalDeductibleExpenses);
  }, [totalGrossDistributions, totalDeductibleExpenses]);

  // Estimated Self-Employment Tax (Schedule SE: 15.3% on 92.35% of net profit)
  const estimatedSelfEmploymentTax = useMemo(() => {
    if (netTaxableIncome <= 0) return 0;
    return (netTaxableIncome * 0.9235) * 0.153;
  }, [netTaxableIncome]);

  // Estimated Income Tax (Standard effective bracket ~12% for independent creator)
  const estimatedIncomeTax = useMemo(() => {
    if (netTaxableIncome <= 0) return 0;
    return netTaxableIncome * 0.12;
  }, [netTaxableIncome]);

  const totalEstimatedTaxLiability = useMemo(() => {
    return estimatedSelfEmploymentTax + estimatedIncomeTax;
  }, [estimatedSelfEmploymentTax, estimatedIncomeTax]);

  // Quarterly Estimated Payments (Form 1040-ES)
  const quarterlyEstimatedPayment = useMemo(() => {
    return totalEstimatedTaxLiability / 4;
  }, [totalEstimatedTaxLiability]);

  // Category breakdown
  const expensesByCategory = useMemo(() => {
    const map: Record<ProductionExpenseCategory, number> = {
      'Filming Gear & Camera': 0,
      'Drone & Aerial Surveys': 0,
      'Studio & Location Rental': 0,
      'Post-Production & Software': 0,
      'Talent, Crew & Wages': 0,
      'Music Licensing & Sound': 0,
      'Travel, Mileage & Location Meals': 0,
      'Insurance & Legal Fees': 0,
      'Marketing & Distribution': 0
    };
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + (e.amount * (e.deductiblePercent / 100));
    });
    return map;
  }, [expenses]);

  // Schedule C IRS Line breakdown
  const scheduleCLines = useMemo(() => {
    const lines: Record<string, number> = {};
    expenses.forEach(e => {
      const lineName = e.irsScheduleCLine || 'Line 27 (Other Expenses)';
      lines[lineName] = (lines[lineName] || 0) + (e.amount * (e.deductiblePercent / 100));
    });
    return lines;
  }, [expenses]);

  return {
    taxProfile,
    distributions,
    expenses,
    updateTaxProfile,
    addProductionExpense,
    deleteProductionExpense,
    editProductionExpense,
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
  };
}
