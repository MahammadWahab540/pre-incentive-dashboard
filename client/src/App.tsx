import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ExecutiveSelector } from './components/ExecutiveSelector';
import { OutcomeInput } from './components/OutcomeInput';
import { IncentiveCard } from './components/IncentiveCard';
import { MilestoneTracker } from './components/MilestoneTracker';
import { UnavailableNotice } from './components/UnavailableNotice';
import { fetchExecutives, calculateIncentive } from './services/api';
import { Executive, CalculationResponse } from './types';
import { AlertCircle, RefreshCw, Calculator, UserCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);
  const [outcomes, setOutcomes] = useState<number | ''>(60);
  const [calculationResult, setCalculationResult] = useState<CalculationResponse | null>(null);

  const [loadingExecutives, setLoadingExecutives] = useState<boolean>(true);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch executives on mount
  const loadExecutives = useCallback(async () => {
    setLoadingExecutives(true);
    setError(null);
    try {
      const data = await fetchExecutives();
      setExecutives(data);
      // Auto-select first executive if none selected
      if (data.length > 0 && !selectedExecutive) {
        setSelectedExecutive(data[0]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to backend server';
      setError(msg);
    } finally {
      setLoadingExecutives(false);
    }
  }, [selectedExecutive]);

  useEffect(() => {
    loadExecutives();
  }, []);

  // 2. Perform calculation whenever selectedExecutive or outcomes changes
  useEffect(() => {
    if (!selectedExecutive) {
      setCalculationResult(null);
      return;
    }

    if (outcomes === '' || typeof outcomes !== 'number') {
      setCalculationResult(null);
      return;
    }

    let isMounted = true;
    const runCalculation = async () => {
      setCalculating(true);
      try {
        const result = await calculateIncentive(selectedExecutive.id, outcomes);
        if (isMounted) {
          setCalculationResult(result);
          if (result.status === 'ERROR') {
            setError(result.message || 'Calculation failed');
          } else {
            setError(null);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Error executing calculation';
          setError(msg);
          setCalculationResult({
            status: 'ERROR',
            message: msg,
          });
        }
      } finally {
        if (isMounted) {
          setCalculating(false);
        }
      }
    };

    runCalculation();

    return () => {
      isMounted = false;
    };
  }, [selectedExecutive, outcomes]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between text-rose-800 shadow-sm">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button
              onClick={() => {
                setError(null);
                loadExecutives();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-rose-700 border border-rose-200 hover:bg-rose-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Section A: Inputs Card */}
        <section className="bg-white border border-[#E8E8ED] rounded-3xl p-6 sm:p-8 shadow-card">
          <div className="flex items-center space-x-2 pb-5 border-b border-[#F5F5F7] mb-6">
            <Calculator className="w-5 h-5 text-[#0071E3]" />
            <h2 className="text-base font-semibold text-[#1D1D1F]">
              Executive &amp; Outcome Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <ExecutiveSelector
              executives={executives}
              selectedExecutive={selectedExecutive}
              onSelect={(exec) => setSelectedExecutive(exec)}
              isLoading={loadingExecutives}
            />

            <OutcomeInput
              outcomes={outcomes}
              onChange={(val) => setOutcomes(val)}
            />
          </div>
        </section>

        {/* Dynamic Section B & C States */}
        {!selectedExecutive ? (
          <div className="bg-white border border-[#E8E8ED] rounded-3xl p-12 text-center shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mx-auto text-[#86868B] mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#1D1D1F]">
              No Executive Selected
            </h3>
            <p className="text-sm text-[#86868B] max-w-sm mx-auto mt-1">
              Please choose a Relationship Executive above to compute and visualize incentive earnings.
            </p>
          </div>
        ) : outcomes === '' ? (
          <div className="bg-white border border-[#E8E8ED] rounded-3xl p-12 text-center shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mx-auto text-[#86868B] mb-3">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#1D1D1F]">
              Enter Monthly Outcomes
            </h3>
            <p className="text-sm text-[#86868B] max-w-sm mx-auto mt-1">
              Input the number of achieved outcomes or click one of the quick milestone presets above.
            </p>
          </div>
        ) : calculating && !calculationResult ? (
          <div className="bg-white border border-[#E8E8ED] rounded-3xl p-12 text-center shadow-card">
            <div className="w-6 h-6 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#86868B]">Calculating incentive figures...</p>
          </div>
        ) : calculationResult?.status === 'UNAVAILABLE' ? (
          /* Section B (NA State): Elegant warning card */
          <UnavailableNotice executive={selectedExecutive} />
        ) : calculationResult && (calculationResult.status === 'AVAILABLE' || calculationResult.status === 'SUCCESS') ? (
          /* Section B & C: Valid calculation results & Milestone Tracker */
          <div className="space-y-6">
            <IncentiveCard data={calculationResult} />
            <MilestoneTracker data={calculationResult} />
          </div>
        ) : null}
      </main>

      <footer className="w-full border-t border-[#E8E8ED] bg-white py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#86868B] gap-2">
          <span>&copy; {new Date().getFullYear()} NxtWave Technologies • PRE Incentive Management</span>
          <span className="font-mono text-[11px]">Milestones: 50 · 55 · 60 · 65 · 70 · 75</span>
        </div>
      </footer>
    </div>
  );
};
