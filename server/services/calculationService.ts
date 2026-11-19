import { INCENTIVE_TIERS, IncentiveTier } from '../config/incentiveTiers.js';
import { Employee } from '../config/employeeConfig.js';

export interface MilestoneProgressItem {
  threshold: number;
  baseBonus: number;
  finalBonus: number;
  achieved: boolean;
  current: boolean;
}

export interface NextMilestoneInfo {
  threshold: number;
  needed: number;
  baseBonus: number;
  finalBonus: number;
  additionalBonus: number;
}

export interface CalculationSuccessResult {
  status: 'AVAILABLE';
  executive: {
    id: string;
    name: string;
    email: string;
  };
  monthlyOutcomes: number;
  adjustment: number;
  multiplier: number;
  baseBonus: number;
  finalIncentive: number;
  nextMilestone: NextMilestoneInfo | null;
  milestones: MilestoneProgressItem[];
}

export interface CalculationUnavailableResult {
  status: 'UNAVAILABLE';
  message: string;
}

export type CalculationResult = CalculationSuccessResult | CalculationUnavailableResult;

export function validateMonthlyOutcomes(outcomes: unknown): number {
  if (
    typeof outcomes !== 'number' ||
    !Number.isInteger(outcomes) ||
    Number.isNaN(outcomes) ||
    outcomes < 0
  ) {
    throw new Error('Monthly outcomes must be a non-negative integer');
  }
  return outcomes;
}

export function calculateIncentive(
  employee: Employee,
  monthlyOutcomesInput: unknown
): CalculationResult {
  const outcomes = validateMonthlyOutcomes(monthlyOutcomesInput);

  if (employee.adjustment === null || employee.adjustment === undefined) {
    return {
      status: 'UNAVAILABLE',
      message: 'Incentive configuration unavailable'
    };
  }

  const adjustment = employee.adjustment;
  // Multiplier formula: 1 + (adjustment / 100)
  // Round multiplier to 2 decimal places to avoid IEEE 754 precision issues (e.g. 1 + 0.2 = 1.20)
  const multiplier = Number((1 + adjustment / 100).toFixed(4));

  // Determine achieved milestone and next milestone
  // INCENTIVE_TIERS: 50, 55, 60, 65, 70, 75
  let highestAchievedTier: IncentiveTier | null = null;
  let nextTier: IncentiveTier | null = null;

  for (let i = 0; i < INCENTIVE_TIERS.length; i++) {
    const tier = INCENTIVE_TIERS[i];
    if (outcomes >= tier.threshold) {
      highestAchievedTier = tier;
    } else {
      if (!nextTier) {
        nextTier = tier;
      }
    }
  }

  const baseBonus = highestAchievedTier ? highestAchievedTier.baseBonus : 0;
  const finalIncentive = Math.round(baseBonus * multiplier);

  // Next milestone details
  let nextMilestone: NextMilestoneInfo | null = null;
  if (nextTier) {
    const nextBaseBonus = nextTier.baseBonus;
    const nextFinalBonus = Math.round(nextBaseBonus * multiplier);
    const needed = nextTier.threshold - outcomes;
    const additionalBonus = Math.max(0, nextFinalBonus - finalIncentive);

    nextMilestone = {
      threshold: nextTier.threshold,
      needed,
      baseBonus: nextBaseBonus,
      finalBonus: nextFinalBonus,
      additionalBonus
    };
  }

  // Milestone progression for tracker
  const milestones: MilestoneProgressItem[] = INCENTIVE_TIERS.map((tier) => {
    const achieved = outcomes >= tier.threshold;
    const isCurrent = highestAchievedTier ? highestAchievedTier.threshold === tier.threshold : false;
    const tierFinalBonus = Math.round(tier.baseBonus * multiplier);

    return {
      threshold: tier.threshold,
      baseBonus: tier.baseBonus,
      finalBonus: tierFinalBonus,
      achieved,
      current: isCurrent
    };
  });

  return {
    status: 'AVAILABLE',
    executive: {
      id: employee.id,
      name: employee.name,
      email: employee.email
    },
    monthlyOutcomes: outcomes,
    adjustment,
    multiplier,
    baseBonus,
    finalIncentive,
    nextMilestone,
    milestones
  };
}
