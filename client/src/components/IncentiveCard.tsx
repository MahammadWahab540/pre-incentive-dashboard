import React from 'react';
import { TrendingUp, Award, ArrowUpRight, Zap, CheckCircle2, Target } from 'lucide-react';
import { CalculationSuccessData } from '../types';

interface IncentiveCardProps {
  data: CalculationSuccessData;
}

export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const IncentiveCard: React.FC<IncentiveCardProps> = ({ data }) => {
  const isCapped = data.monthlyOutcomes >= 75;
  const isBelowMilestone = data.monthlyOutcomes < 50;
  const currentMilestone = data.milestones.find((m) => m.current)?.threshold ?? null;

  const formatMultiplier = (mult: number, adj: number) => {
    const formattedMult = mult.toFixed(2);
    const sign = adj > 0 ? `+${adj}%` : `${adj}%`;
    return `${formattedMult} (${sign})`;
  };

  return (
    <div className="bg-white border border-[#E8E8ED] rounded-3xl p-6 sm:p-8 shadow-card text-[#1D1D1F] transition-all">
      {/* Top Banner / Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F5F5F7] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
              Calculated Incentive Payout
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-[#0071E3] border border-blue-100">
              {data.executive.name}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
              {formatINR(data.finalIncentive)}
            </span>
            <span className="text-sm font-medium text-[#86868B]">
              INR Net Incentive
            </span>
          </div>
        </div>

        <div className="flex sm:flex-col items-start sm:items-end justify-between gap-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F5F5F7] text-[#1D1D1F]">
            <Award className="w-4 h-4 text-[#0071E3]" />
            <span>
              {isBelowMilestone
                ? 'Below Tier (0 of 50)'
                : isCapped
                ? 'Max Milestone Tier (75+)'
                : `Milestone Achieved: ${currentMilestone}`}
            </span>
          </div>
          <span className="text-[11px] text-[#86868B]">
            Based on {data.monthlyOutcomes} verified outcomes
          </span>
        </div>
      </div>

      {/* Grid of 5 Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mt-6">
        {/* Metric 1: Monthly Outcomes Achieved */}
        <div className="p-4 rounded-2xl bg-[#F5F5F7]/80 border border-[#E8E8ED]/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#86868B] mb-2">
            <span className="text-xs font-medium">Monthly Outcomes</span>
            <Target className="w-3.5 h-3.5 text-[#6E6E73]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
            {data.monthlyOutcomes}
          </div>
          <span className="text-[11px] text-[#86868B] mt-1">
            {isBelowMilestone ? `${50 - data.monthlyOutcomes} away from 50` : 'Verified outcomes'}
          </span>
        </div>

        {/* Metric 2: Base Incentive */}
        <div className="p-4 rounded-2xl bg-[#F5F5F7]/80 border border-[#E8E8ED]/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#86868B] mb-2">
            <span className="text-xs font-medium">Base Incentive</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#6E6E73]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
            {formatINR(data.baseBonus)}
          </div>
          <span className="text-[11px] text-[#86868B] mt-1">
            Standard slab rate
          </span>
        </div>

        {/* Metric 3: Applicable Multiplier */}
        <div className="p-4 rounded-2xl bg-[#F5F5F7]/80 border border-[#E8E8ED]/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#86868B] mb-2">
            <span className="text-xs font-medium">Applicable Multiplier</span>
            <Zap className="w-3.5 h-3.5 text-[#6E6E73]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#1D1D1F] truncate">
            {formatMultiplier(data.multiplier, data.adjustment)}
          </div>
          <span className="text-[11px] text-[#86868B] mt-1">
            {data.adjustment >= 0 ? 'Individual bonus rate' : 'Individual adjustment'}
          </span>
        </div>

        {/* Metric 4: Next Milestone Target */}
        <div className="p-4 rounded-2xl bg-[#F5F5F7]/80 border border-[#E8E8ED]/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#86868B] mb-2">
            <span className="text-xs font-medium">Next Milestone</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#0071E3]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
            {data.nextMilestone ? `${data.nextMilestone.threshold}` : 'Top Tier'}
          </div>
          <span className="text-[11px] text-[#86868B] mt-1">
            {data.nextMilestone
              ? `${data.nextMilestone.needed} more needed`
              : 'Max slab achieved'}
          </span>
        </div>

        {/* Metric 5: Additional Bonus at Next Milestone */}
        <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#0071E3] mb-2">
            <span className="text-xs font-semibold">Bonus at Next</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#0071E3]">
            {data.nextMilestone && data.nextMilestone.additionalBonus > 0
              ? `+${formatINR(data.nextMilestone.additionalBonus)}`
              : isCapped
              ? 'Max Tier'
              : '-'}
          </div>
          <span className="text-[11px] text-[#0071E3]/80 mt-1">
            Incremental earnings
          </span>
        </div>
      </div>
    </div>
  );
};
