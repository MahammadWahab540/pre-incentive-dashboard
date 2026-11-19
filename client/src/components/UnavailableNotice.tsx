import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { Executive } from '../types';

interface UnavailableNoticeProps {
  executive: Executive;
}

export const UnavailableNotice: React.FC<UnavailableNoticeProps> = ({ executive }) => {
  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-card text-[#1D1D1F] transition-all">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700 shadow-sm">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-lg font-semibold text-amber-950">
              Incentive configuration unavailable
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-200/80 text-amber-900">
              NA Policy
            </span>
          </div>

          <p className="text-sm text-amber-900/80 leading-relaxed mt-1">
            Standard incentive policy adjustments are currently not configured or marked as{' '}
            <span className="font-semibold text-amber-950">Not Applicable (NA)</span> for{' '}
            <span className="font-semibold text-amber-950">{executive.name}</span> ({executive.email}).
          </p>

          <div className="mt-4 p-4 rounded-2xl bg-white/80 border border-amber-200/50 text-xs text-amber-950/70 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              Policy Notice
            </div>
            <p>
              Per company guidelines, compensation records for this executive are managed under an unstandardized or specialized agreement. Incentive figures and multipliers are intentionally withheld to ensure absolute compensation accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
