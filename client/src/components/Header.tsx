import React from 'react';
import { Award } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-[#E8E8ED] sticky top-0 z-30 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0071E3] to-[#47A1FF] flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">
                PRE Incentive Dashboard
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F5F5F7] text-[#6E6E73] border border-[#E8E8ED]">
                v2.0
              </span>
            </div>
            <p className="text-xs text-[#86868B] font-normal">
              Performance &amp; Relationship Executives • NxtWave Performance Suite
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Calculation
          </div>
        </div>
      </div>
    </header>
  );
};
