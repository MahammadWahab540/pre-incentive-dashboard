import React from 'react';
import { Target, AlertCircle } from 'lucide-react';

interface OutcomeInputProps {
  outcomes: number | '';
  onChange: (value: number | '') => void;
  error?: string | null;
}

const PRESET_TIERS = [50, 55, 60, 65, 70, 75];

export const OutcomeInput: React.FC<OutcomeInputProps> = ({
  outcomes,
  onChange,
  error,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.trim();

    if (rawVal === '') {
      onChange('');
      return;
    }

    // Reject decimals or negative signs directly
    if (!/^\d+$/.test(rawVal)) {
      return;
    }

    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    }
  };

  const handlePresetClick = (tier: number) => {
    onChange(tier);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
          Monthly Outcomes Achieved
        </label>
        <span className="text-xs text-[#86868B]">
          Whole positive numbers only
        </span>
      </div>

      <div className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={outcomes}
            onChange={handleInputChange}
            placeholder="Enter outcome count (e.g. 60)"
            className={`w-full min-h-[48px] px-4 pr-12 bg-white border rounded-2xl text-base font-semibold text-[#1D1D1F] placeholder-[#86868B] transition-all duration-200 shadow-sm focus:outline-none ${
              error
                ? 'border-rose-400 ring-4 ring-rose-500/10'
                : 'border-[#D2D2D7] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10'
            }`}
          />
          <div className="absolute right-3.5 flex items-center pointer-events-none text-[#86868B]">
            <Target className="w-5 h-5 text-[#86868B]" />
          </div>
        </div>

        {error && (
          <div className="mt-1.5 flex items-center text-xs text-rose-600 gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Preset Pills */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-[#86868B]">
            Quick Milestone Presets:
          </span>
          {typeof outcomes === 'number' && outcomes > 0 && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[11px] font-medium text-[#0071E3] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PRESET_TIERS.map((tier) => {
            const isSelected = outcomes === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => handlePresetClick(tier)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-sm transform scale-[1.02]'
                    : 'bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border-[#E8E8ED] hover:border-[#D2D2D7]'
                }`}
              >
                {tier} Tier
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
