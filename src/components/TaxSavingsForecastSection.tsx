import React, { useState, useMemo } from 'react';
import { ProductionExpenseCategory, ProductionExpenseItem, DistributionPaymentRecord } from '../types';
import { 
  Calculator, DollarSign, TrendingDown, TrendingUp, Sparkles, 
  ArrowRight, CheckCircle2, AlertCircle, Layers, Sliders, 
  Camera, Film, Plane, Building2, Headphones, Users, Plus, 
  RefreshCw, Download, HelpCircle, BarChart3, PieChart as PieIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface TaxSavingsForecastSectionProps {
  expenses: ProductionExpenseItem[];
  distributions: DistributionPaymentRecord[];
  totalGrossDistributions: number;
  totalDeductibleExpenses: number;
  netTaxableIncome: number;
  estimatedSelfEmploymentTax: number;
  estimatedIncomeTax: number;
  totalEstimatedTaxLiability: number;
  quarterlyEstimatedPayment: number;
  expensesByCategory: Record<ProductionExpenseCategory, number>;
  onAddQuickExpense?: (title: string, amount: number, category: ProductionExpenseCategory) => void;
  onNavigateToExpenses?: () => void;
}

export const TaxSavingsForecastSection: React.FC<TaxSavingsForecastSectionProps> = ({
  expenses,
  distributions,
  totalGrossDistributions,
  totalDeductibleExpenses,
  netTaxableIncome,
  estimatedSelfEmploymentTax,
  estimatedIncomeTax,
  totalEstimatedTaxLiability,
  quarterlyEstimatedPayment,
  expensesByCategory,
  onAddQuickExpense,
  onNavigateToExpenses
}) => {
  // Interactive Simulation State
  const [projectedAdditionalSpend, setProjectedAdditionalSpend] = useState<number>(2500);
  const [selectedTaxBracket, setSelectedTaxBracket] = useState<'standard' | 'high' | 'michigan'>('standard');
  const [activeChartModel, setActiveChartModel] = useState<'all' | 'waterfall' | 'trajectory' | 'category' | 'quarterly'>('all');
  const [commitSuccessMessage, setCommitSuccessMessage] = useState<string | null>(null);

  // Marginal Tax Rate calculation based on bracket
  // Standard: 15.3% SE (on 92.35% = 14.13%) + 12% Fed Income = 26.13%
  // High: 15.3% SE + 22% Fed Income = 36.13%
  // Michigan: 15.3% SE + 12% Fed + 4.25% State = 30.38%
  const marginalTaxRate = useMemo(() => {
    switch (selectedTaxBracket) {
      case 'high':
        return 0.3613;
      case 'michigan':
        return 0.3038;
      case 'standard':
      default:
        return 0.2613;
    }
  }, [selectedTaxBracket]);

  const taxBracketLabel = useMemo(() => {
    switch (selectedTaxBracket) {
      case 'high':
        return '36.1% (High Earner: 15.3% SE + 22% Fed)';
      case 'michigan':
        return '30.4% (Great Lakes: 15.3% SE + 12% Fed + 4.25% MI)';
      case 'standard':
      default:
        return '26.1% (Standard Creator: 15.3% SE + 12% Fed)';
    }
  }, [selectedTaxBracket]);

  // Baseline scenario (Zero expenses deducted)
  const baselineUnmitigatedTax = useMemo(() => {
    const seTax = (totalGrossDistributions * 0.9235) * 0.153;
    const incTax = totalGrossDistributions * (selectedTaxBracket === 'high' ? 0.22 : selectedTaxBracket === 'michigan' ? 0.1625 : 0.12);
    return seTax + incTax;
  }, [totalGrossDistributions, selectedTaxBracket]);

  // Current scenario (With already logged filming costs)
  const currentActualTax = useMemo(() => {
    if (netTaxableIncome <= 0) return 0;
    const seTax = (netTaxableIncome * 0.9235) * 0.153;
    const incTax = netTaxableIncome * (selectedTaxBracket === 'high' ? 0.22 : selectedTaxBracket === 'michigan' ? 0.1625 : 0.12);
    return seTax + incTax;
  }, [netTaxableIncome, selectedTaxBracket]);

  // Current Realized Tax Savings
  const currentTaxSavings = useMemo(() => {
    return Math.max(0, baselineUnmitigatedTax - currentActualTax);
  }, [baselineUnmitigatedTax, currentActualTax]);

  // Forecast scenario (With Projected Additional Production Spend)
  const forecastTotalExpenses = useMemo(() => {
    return totalDeductibleExpenses + projectedAdditionalSpend;
  }, [totalDeductibleExpenses, projectedAdditionalSpend]);

  const forecastNetTaxableIncome = useMemo(() => {
    return Math.max(0, totalGrossDistributions - forecastTotalExpenses);
  }, [totalGrossDistributions, forecastTotalExpenses]);

  const forecastTaxLiability = useMemo(() => {
    if (forecastNetTaxableIncome <= 0) return 0;
    const seTax = (forecastNetTaxableIncome * 0.9235) * 0.153;
    const incTax = forecastNetTaxableIncome * (selectedTaxBracket === 'high' ? 0.22 : selectedTaxBracket === 'michigan' ? 0.1625 : 0.12);
    return seTax + incTax;
  }, [forecastNetTaxableIncome, selectedTaxBracket]);

  const forecastTotalTaxSavings = useMemo(() => {
    return Math.max(0, baselineUnmitigatedTax - forecastTaxLiability);
  }, [baselineUnmitigatedTax, forecastTaxLiability]);

  const incrementalTaxSavings = useMemo(() => {
    return Math.max(0, currentActualTax - forecastTaxLiability);
  }, [currentActualTax, forecastTaxLiability]);

  const forecastQuarterlyPayment = useMemo(() => {
    return forecastTaxLiability / 4;
  }, [forecastTaxLiability]);

  const quarterlyPaymentSavings = useMemo(() => {
    return Math.max(0, (currentActualTax / 4) - forecastQuarterlyPayment);
  }, [currentActualTax, forecastQuarterlyPayment]);

  // Dollars needed to achieve zero tax liability
  const breakevenDeductionNeeded = useMemo(() => {
    return Math.max(0, netTaxableIncome);
  }, [netTaxableIncome]);

  // -------------------------------------------------------------
  // RECHARTS DATASET 1: Scenario Comparison (Waterfall / Bar)
  // -------------------------------------------------------------
  const scenarioComparisonData = useMemo(() => [
    {
      scenario: 'Zero Write-Offs',
      Revenue: Math.round(totalGrossDistributions),
      Expenses: 0,
      TaxOwed: Math.round(baselineUnmitigatedTax),
      TaxSaved: 0
    },
    {
      scenario: 'Current Logged',
      Revenue: Math.round(totalGrossDistributions),
      Expenses: Math.round(totalDeductibleExpenses),
      TaxOwed: Math.round(currentActualTax),
      TaxSaved: Math.round(currentTaxSavings)
    },
    {
      scenario: 'Forecasted (+Sim)',
      Revenue: Math.round(totalGrossDistributions),
      Expenses: Math.round(forecastTotalExpenses),
      TaxOwed: Math.round(forecastTaxLiability),
      TaxSaved: Math.round(forecastTotalTaxSavings)
    }
  ], [
    totalGrossDistributions, 
    baselineUnmitigatedTax, 
    totalDeductibleExpenses, 
    currentActualTax, 
    currentTaxSavings, 
    forecastTotalExpenses, 
    forecastTaxLiability, 
    forecastTotalTaxSavings
  ]);

  // -------------------------------------------------------------
  // RECHARTS DATASET 2: Expense Trajectory Curve (Area Chart)
  // -------------------------------------------------------------
  const trajectoryCurveData = useMemo(() => {
    const steps = [0, 1000, 2000, 3000, 4000, 5000, 6500, 8000, 10000];
    return steps.map(spend => {
      const simulatedExpenses = totalDeductibleExpenses + spend;
      const net = Math.max(0, totalGrossDistributions - simulatedExpenses);
      const seTax = (net * 0.9235) * 0.153;
      const incTax = net * (selectedTaxBracket === 'high' ? 0.22 : selectedTaxBracket === 'michigan' ? 0.1625 : 0.12);
      const taxOwed = net <= 0 ? 0 : seTax + incTax;
      const taxSaved = Math.max(0, baselineUnmitigatedTax - taxOwed);
      return {
        stepLabel: spend === 0 ? 'Current' : `+${(spend / 1000).toFixed(0)}k`,
        additionalSpend: spend,
        totalExpenses: Math.round(simulatedExpenses),
        taxLiability: Math.round(taxOwed),
        taxSaved: Math.round(taxSaved)
      };
    });
  }, [totalDeductibleExpenses, totalGrossDistributions, selectedTaxBracket, baselineUnmitigatedTax]);

  // -------------------------------------------------------------
  // RECHARTS DATASET 3: Category Breakdown of Tax Savings
  // -------------------------------------------------------------
  const categorySavingsData = useMemo(() => {
    return (Object.keys(expensesByCategory) as ProductionExpenseCategory[])
      .map(cat => {
        const amount = expensesByCategory[cat] || 0;
        const taxSaved = amount * marginalTaxRate;
        const shortName = cat
          .replace('Filming Gear & Camera', 'Camera Gear')
          .replace('Drone & Aerial Surveys', 'Drone Surveys')
          .replace('Studio & Location Rental', 'Soundstages')
          .replace('Post-Production & Software', 'Post Software')
          .replace('Talent, Crew & Wages', 'Crew Wages')
          .replace('Music Licensing & Sound', 'Sound/Music')
          .replace('Travel, Mileage & Location Meals', 'Travel/Mileage')
          .replace('Insurance & Legal Fees', 'Insurance')
          .replace('Marketing & Distribution', 'Marketing');
        return {
          name: shortName,
          fullName: cat,
          expenseAmount: Math.round(amount),
          taxSavings: Math.round(taxSaved)
        };
      })
      .filter(item => item.expenseAmount > 0)
      .sort((a, b) => b.taxSavings - a.taxSavings);
  }, [expensesByCategory, marginalTaxRate]);

  // -------------------------------------------------------------
  // RECHARTS DATASET 4: Quarterly 1040-ES Installment Relief
  // -------------------------------------------------------------
  const quarterlyComparisonData = useMemo(() => {
    const quarters = ['Q1 (Apr 15)', 'Q2 (Jun 15)', 'Q3 (Sep 15)', 'Q4 (Jan 15)'];
    const baselineQ = baselineUnmitigatedTax / 4;
    const currentQ = currentActualTax / 4;
    const forecastQ = forecastTaxLiability / 4;

    return quarters.map(q => ({
      quarter: q,
      'Unmitigated (No Write-Offs)': Math.round(baselineQ),
      'Current Realized': Math.round(currentQ),
      'Forecasted with Shoot': Math.round(forecastQ)
    }));
  }, [baselineUnmitigatedTax, currentActualTax, forecastTaxLiability]);

  // Quick preset handler
  const handleApplyPreset = (amount: number) => {
    setProjectedAdditionalSpend(amount);
  };

  const handleCommitQuickExpense = () => {
    if (!onAddQuickExpense) return;
    onAddQuickExpense(
      `Forecasted Production Shoot Package (${taxBracketLabel.split(' ')[0]})`,
      projectedAdditionalSpend,
      'Filming Gear & Camera'
    );
    setCommitSuccessMessage(`Added $${projectedAdditionalSpend.toLocaleString()} to your Schedule C filming expenses!`);
    setTimeout(() => setCommitSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      
      {/* Forecast Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/50 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/30">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>RECHARTS PRODUCTION TAX SAVINGS FORECASTER · SCHEDULE C WRITE-OFF YIELD</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            Production &amp; Filming Tax Savings Visualizer
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Every dollar invested into <strong>cinema cameras, drone aerials, soundstages, editing suites, and crew</strong> reduces your net taxable profit dollar-for-dollar. Explore real-time forecast models using the <strong>Recharts library</strong> to project your tax savings and IRS 1040-ES relief.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
            <span className="text-emerald-400 font-bold">
              ● Tax Savings Yield: ${(marginalTaxRate * 100).toFixed(1)} per $100 spent
            </span>
            <span>·</span>
            <span className="text-cyan-400">Section 179 Instant Expensing</span>
            <span>·</span>
            <span className="text-amber-400">Schedule SE FICA Mitigation</span>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-12 -mb-12" />
      </div>

      {/* Primary KPI Grid: Current vs Forecasted Tax Savings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Current Realized Tax Savings */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-slate-900 to-black border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Current Realized Tax Savings
            </span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            ${currentTaxSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Deducted from <strong>${totalDeductibleExpenses.toLocaleString()}</strong> in logged filming &amp; drone costs.
          </p>
          <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-300 flex justify-between">
            <span>Tax Liability Cut:</span>
            <span className="font-bold">
              {baselineUnmitigatedTax > 0 
                ? `${Math.round((currentTaxSavings / baselineUnmitigatedTax) * 100)}% Reduction` 
                : '100%'}
            </span>
          </div>
        </div>

        {/* Card 2: Forecasted Total Tax Savings */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/50 via-slate-900 to-black border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Projected Total Tax Savings
            </span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-300">
            ${forecastTotalTaxSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            With <strong>+${projectedAdditionalSpend.toLocaleString()}</strong> in forecasted upcoming shoot expenses.
          </p>
          <div className="pt-2 border-t border-cyan-500/20 text-[11px] font-mono text-cyan-300 flex justify-between">
            <span>Incremental Savings:</span>
            <span className="font-bold">+${incrementalTaxSavings.toFixed(2)}</span>
          </div>
        </div>

        {/* Card 3: Remaining Forecasted Tax Liability */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-black border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
              Forecasted Remaining Tax
            </span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            ${forecastTaxLiability.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Down from unmitigated <strong>${baselineUnmitigatedTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> if zero expenses were claimed.
          </p>
          <div className="pt-2 border-t border-amber-500/20 text-[11px] font-mono text-amber-300 flex justify-between">
            <span>Net Taxable Income:</span>
            <span className="font-bold">${forecastNetTaxableIncome.toFixed(2)}</span>
          </div>
        </div>

        {/* Card 4: Form 1040-ES Quarterly Relief */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-black border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
              Quarterly Payment Relief
            </span>
            <TrendingDown className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-300">
            ${forecastQuarterlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Per quarter installment due to IRS, saving <strong>${quarterlyPaymentSavings.toFixed(2)}/qtr</strong>.
          </p>
          <div className="pt-2 border-t border-purple-500/20 text-[11px] font-mono text-purple-300 flex justify-between">
            <span>Schedule SE + 1040:</span>
            <span className="font-bold">4 Equal Qtrs</span>
          </div>
        </div>

      </div>

      {/* Interactive What-If Simulation Controls */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Interactive Production Cost &amp; Tax Bracket Simulator</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust upcoming production budgets to forecast how gear and filming write-offs reduce your tax burden.
            </p>
          </div>

          {/* Quick Commit Action */}
          {onAddQuickExpense && (
            <div className="flex items-center gap-2 self-start md:self-auto">
              {commitSuccessMessage && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{commitSuccessMessage}</span>
                </span>
              )}
              <button
                onClick={handleCommitQuickExpense}
                className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Forecasted Spend (+${projectedAdditionalSpend.toLocaleString()})</span>
              </button>
            </div>
          )}
        </div>

        {/* Controls Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          
          {/* Spend Slider (7 Cols) */}
          <div className="lg:col-span-7 space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Forecasted Additional Filming &amp; Production Budget:</span>
              </span>
              <span className="font-mono text-sm font-extrabold text-cyan-400">
                +${projectedAdditionalSpend.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="15000"
              step="250"
              value={projectedAdditionalSpend}
              onChange={e => setProjectedAdditionalSpend(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>+$0</span>
              <span>+$5,000</span>
              <span>+$10,000</span>
              <span>+$15,000 Max</span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 mr-1 font-mono">Quick Packages:</span>
              <button
                onClick={() => handleApplyPreset(1200)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-mono hover:text-white transition-colors"
              >
                +$1.2k Gimbal Kit
              </button>
              <button
                onClick={() => handleApplyPreset(2500)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-mono hover:text-white transition-colors"
              >
                +$2.5k Drone Crew
              </button>
              <button
                onClick={() => handleApplyPreset(4800)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-mono hover:text-white transition-colors"
              >
                +$4.8k Studio Booking
              </button>
              <button
                onClick={() => handleApplyPreset(8500)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-mono hover:text-white transition-colors"
              >
                +$8.5k Feature Package
              </button>
              <button
                onClick={() => handleApplyPreset(0)}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                title="Reset simulation to $0"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Tax Bracket & Safe-Harbor Setting (5 Cols) */}
          <div className="lg:col-span-5 space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Marginal Tax Bracket Model:</span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {(marginalTaxRate * 100).toFixed(1)}% Rate
              </span>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setSelectedTaxBracket('standard')}
                className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  selectedTaxBracket === 'standard'
                    ? 'bg-emerald-500/20 border border-emerald-500 text-white font-bold'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>Standard Creator (12% Fed + 15.3% SE)</span>
                <span className="font-mono text-[11px] text-emerald-400">26.1%</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTaxBracket('michigan')}
                className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  selectedTaxBracket === 'michigan'
                    ? 'bg-emerald-500/20 border border-emerald-500 text-white font-bold'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>Michigan Inclusive (+4.25% State MI)</span>
                <span className="font-mono text-[11px] text-cyan-400">30.4%</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTaxBracket('high')}
                className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  selectedTaxBracket === 'high'
                    ? 'bg-emerald-500/20 border border-emerald-500 text-white font-bold'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>High Earner Creator (22% Fed + 15.3% SE)</span>
                <span className="font-mono text-[11px] text-purple-400">36.1%</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Recharts Visual Suite */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
        
        {/* Visual Switcher Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>RECHARTS VISUALIZATION SUITE</span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
              Production Expense Impact &amp; Tax Reduction Charts
            </h4>
          </div>

          {/* Model Switcher */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveChartModel('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartModel === 'all'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 4 Charts</span>
            </button>

            <button
              onClick={() => setActiveChartModel('waterfall')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartModel === 'waterfall'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Scenario Comparison</span>
            </button>

            <button
              onClick={() => setActiveChartModel('trajectory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartModel === 'trajectory'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Savings Trajectory</span>
            </button>

            <button
              onClick={() => setActiveChartModel('category')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartModel === 'category'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Category Savings</span>
            </button>

            <button
              onClick={() => setActiveChartModel('quarterly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartModel === 'quarterly'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>1040-ES Installments</span>
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Scenario Comparison (Waterfall BarChart) */}
          {(activeChartModel === 'all' || activeChartModel === 'waterfall') && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Scenario Comparison: Zero vs. Current vs. Forecasted</span>
                  </h5>
                  <p className="text-[11px] text-slate-400">Tax liability decreases as production expenses are deducted</p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  -${forecastTotalTaxSavings.toFixed(0)} Saved
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenarioComparisonData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="scenario" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-xs space-y-1">
                              <div className="font-bold text-white">{label}</div>
                              {payload.map((entry, index) => (
                                <div key={`item-${index}`} className="font-mono flex justify-between gap-3" style={{ color: entry.color }}>
                                  <span>{entry.name}:</span>
                                  <span className="font-bold">${Number(entry.value).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={32}
                      formatter={value => <span className="text-[11px] text-slate-300">{value}</span>}
                    />
                    <Bar dataKey="Expenses" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    <Bar dataKey="TaxOwed" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    <Bar dataKey="TaxSaved" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Revenue Baseline: ${totalGrossDistributions.toLocaleString()}</span>
                <span className="text-emerald-400">Tax Mitigated: {baselineUnmitigatedTax > 0 ? `${Math.round((forecastTotalTaxSavings / baselineUnmitigatedTax) * 100)}%` : '100%'}</span>
              </div>
            </div>
          )}

          {/* Chart 2: Cumulative Trajectory Curve (AreaChart) */}
          {(activeChartModel === 'all' || activeChartModel === 'trajectory') && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Filming Spend Trajectory vs. Cumulative Tax Savings</span>
                  </h5>
                  <p className="text-[11px] text-slate-400">Shows expanding tax savings as filming costs scale toward full offset</p>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold">
                  {(marginalTaxRate * 100).toFixed(1)}% Multiplier
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trajectoryCurveData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorTaxSaved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTaxLiability" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="stepLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-xs space-y-1">
                              <div className="font-bold text-white">Tier: {label}</div>
                              {payload.map((entry, index) => (
                                <div key={`tr-${index}`} className="font-mono flex justify-between gap-3" style={{ color: entry.color }}>
                                  <span>{entry.name}:</span>
                                  <span className="font-bold">${Number(entry.value).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={32}
                      formatter={value => <span className="text-[11px] text-slate-300">{value}</span>}
                    />
                    <Area type="monotone" dataKey="taxSaved" name="Tax Saved ($)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTaxSaved)" />
                    <Area type="monotone" dataKey="taxLiability" name="Tax Liability ($)" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorTaxLiability)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Sweet-Spot Deduction: ${totalGrossDistributions.toLocaleString()}</span>
                <span className="text-emerald-400">Tax Shield: Activated</span>
              </div>
            </div>
          )}

          {/* Chart 3: Category Savings Breakdown (BarChart) */}
          {(activeChartModel === 'all' || activeChartModel === 'category') && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-purple-400" />
                    <span>Tax Savings Harvested by Filming &amp; Production Category</span>
                  </h5>
                  <p className="text-[11px] text-slate-400">Dollar value of tax shield created by each expense type</p>
                </div>
                <span className="text-[11px] font-mono text-purple-400 font-bold">
                  {categorySavingsData.length} Active Lines
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categorySavingsData} layout="vertical" margin={{ top: 10, right: 15, left: 35, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const item = categorySavingsData.find(c => c.name === label);
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-xs space-y-1">
                              <div className="font-bold text-white">{item?.fullName || label}</div>
                              <div className="text-cyan-300 font-mono">
                                Expense Amount: <span className="font-bold">${item?.expenseAmount.toLocaleString()}</span>
                              </div>
                              <div className="text-emerald-400 font-mono">
                                Tax Saved: <span className="font-bold">${item?.taxSavings.toLocaleString()}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                                Effective Write-off Yield: {(marginalTaxRate * 100).toFixed(1)}%
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={32}
                      formatter={value => <span className="text-[11px] text-slate-300">{value}</span>}
                    />
                    <Bar dataKey="expenseAmount" name="Expense Amount ($)" fill="#06b6d4" radius={[0, 4, 4, 0]} maxBarSize={16} />
                    <Bar dataKey="taxSavings" name="Tax Saved ($)" fill="#10b981" radius={[0, 4, 4, 0]} maxBarSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Top Saver: {categorySavingsData[0]?.name || 'Gear'} (${categorySavingsData[0]?.taxSavings || 0})</span>
                <span className="text-cyan-400">IRS Safe Harbor: Section 179</span>
              </div>
            </div>
          )}

          {/* Chart 4: Form 1040-ES Quarterly Installments (Grouped BarChart) */}
          {(activeChartModel === 'all' || activeChartModel === 'quarterly') && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-purple-400" />
                    <span>Quarterly Estimated Tax Relief (Form 1040-ES)</span>
                  </h5>
                  <p className="text-[11px] text-slate-400">Quarterly cash out-of-pocket required across scenarios</p>
                </div>
                <span className="text-[11px] font-mono text-purple-300 font-bold">
                  -${quarterlyPaymentSavings.toFixed(0)}/Qtr Relief
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quarterlyComparisonData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-xs space-y-1">
                              <div className="font-bold text-white">{label}</div>
                              {payload.map((entry, index) => (
                                <div key={`q-${index}`} className="font-mono flex justify-between gap-3" style={{ color: entry.color }}>
                                  <span>{entry.name}:</span>
                                  <span className="font-bold">${Number(entry.value).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={32}
                      formatter={value => <span className="text-[11px] text-slate-300">{value}</span>}
                    />
                    <Bar dataKey="Unmitigated (No Write-Offs)" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={22} />
                    <Bar dataKey="Current Realized" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={22} />
                    <Bar dataKey="Forecasted with Shoot" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Deadlines: Apr 15 · Jun 15 · Sep 15 · Jan 15</span>
                <span className="text-emerald-400">Direct Deposit Safe</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Production Expense IRS Write-Off Optimization Guide */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">
              Creator Production Write-Off Optimization Strategies (IRS Schedule C &amp; Section 179)
            </h4>
          </div>
          {onNavigateToExpenses && (
            <button
              onClick={onNavigateToExpenses}
              className="text-xs text-cyan-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              <span>View All Logged Receipts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Camera className="w-4 h-4" />
              <span>Section 179 Gear Expensing</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Deduct <strong>100% of purchase price</strong> for camera bodies, cinema lenses, gimbals, microphones, and editing computers in the year purchased rather than depreciating over 5 years.
            </p>
            <div className="text-[11px] font-mono text-emerald-400">
              Schedule C Line 13 · Direct write-off
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Plane className="w-4 h-4" />
              <span>Drone Surveys &amp; FAA Waivers</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Rental fees for aerial inspection drones, airspace authorization filings, and aerial camera operators are <strong>100% deductible business machinery leases</strong>.
            </p>
            <div className="text-[11px] font-mono text-emerald-400">
              Schedule C Line 20a · Full deduction
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-purple-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>Soundstage &amp; Location Leases</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Studio rentals, soundstage day rates, and commercial shoot permits qualify under business property leases, shielding up to <strong>36.1% in direct tax savings</strong>.
            </p>
            <div className="text-[11px] font-mono text-emerald-400">
              Schedule C Line 20b · Certified receipts
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
