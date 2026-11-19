import React from 'react';
import { Check, Flame, ChevronRight, Award, Trophy } from 'lucide-react';
import { CalculationSuccessData } from '../types';
import { formatINR } from './IncentiveCard';

interface MilestoneTrackerProps {
  data: CalculationSuccessData;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ data }) => {
  const { monthlyOutcomes, milestones, nextMilestone } = data;

  const progressPercent = Math.min(100, Math.max(0, (monthlyOutcomes / 75) * 100));

  return (
    <div className="bg-white border border-[#E8E8ED] rounded-3xl p-6 sm:p-8 shadow-card text-[#1D1D1F] transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F5F5F7] gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Milestone Progression Tracker
          </h2>
          <p className="text-xs text-[#86868B] mt-0.5">
            Tier thresholds from 50 to 75 verified monthly outcomes
          </p>
        </div>

        {/* Motivational Callout Banner */}
        {nextMilestone ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0071E3] border border-blue-200/60 text-xs font-medium">
            <Flame className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>
              <strong className="font-semibold">{nextMilestone.needed} more outcome{nextMilestone.needed === 1 ? '' : 's'}</strong> needed to reach{' '}
              <strong className="font-semibold">{formatINR(nextMilestone.additionalBonus)}</strong> additional bonus
            </span>
          </div>
        ) : monthlyOutcomes >= 75 ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Maximum Tier Unlocked! Top Performance</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 text-xs font-medium">
            <ChevronRight className="w-4 h-4 text-amber-600" />
            <span>
              <strong className="font-semibold">{50 - monthlyOutcomes} more outcomes</strong> to enter first incentive tier (50)
            </span>
          </div>
        )}
      </div>

      {/* Visual Progression Bar */}
      <div className="mt-8 mb-10 px-2 sm:px-4">
        <div className="flex justify-between items-center text-xs font-medium text-[#86868B] mb-2">
          <span>0 Outcomes</span>
          <span className="font-semibold text-[#1D1D1F]">
            Current: {monthlyOutcomes}
          </span>
          <span>75+ Cap</span>
        </div>

        <div className="relative w-full h-3 bg-[#F5F5F7] rounded-full overflow-hidden p-0.5 border border-[#E8E8ED]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0071E3] to-[#34C759] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tier Steps / Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {milestones.map((m) => {
          const isCurrent = m.current;
          const isAchieved = m.achieved;
          const isNext = nextMilestone ? m.threshold === nextMilestone.threshold : false;

          return (
            <div
              key={m.threshold}
              className={`relative p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-blue-50/70 border-[#0071E3] ring-2 ring-[#0071E3]/20 shadow-sm'
                  : isAchieved
                  ? 'bg-emerald-50/40 border-emerald-200/80'
                  : isNext
                  ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-300/20'
                  : 'bg-[#F5F5F7]/60 border-[#E8E8ED]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                    isCurrent
                      ? 'bg-[#0071E3] text-white'
                      : isAchieved
                      ? 'bg-emerald-600 text-white'
                      : isNext
                      ? 'bg-amber-500 text-white'
                      : 'bg-white text-[#86868B] border border-[#E8E8ED]'
                  }`}
                >
                  {m.threshold} Tier
                </span>

                {isAchieved ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                ) : isNext ? (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                ) : null}
              </div>

              <div>
                <div className="text-sm font-bold text-[#1D1D1F]">
                  {formatINR(m.finalBonus)}
                </div>
                <div className="text-[10px] text-[#86868B] flex items-center justify-between mt-0.5">
                  <span>Base: {formatINR(m.baseBonus)}</span>
                </div>
              </div>

              {/* Status footer pill */}
              <div className="mt-2 pt-2 border-t border-black/5 text-[10px] font-medium">
                {isCurrent ? (
                  <span className="text-[#0071E3] font-semibold">Active Milestone</span>
                ) : isAchieved ? (
                  <span className="text-emerald-700">Achieved</span>
                ) : isNext ? (
                  <span className="text-amber-700 font-semibold">Next Target</span>
                ) : (
                  <span className="text-[#86868B]">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
