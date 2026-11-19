import { Employee } from './_employeeConfig';

export interface IncentiveTier {
  threshold: number;
  baseBonus: number;
}

export const INCENTIVE_TIERS: IncentiveTier[] = [
  { threshold: 50, baseBonus: 10000 },
  { threshold: 55, baseBonus: 12500 },
  { threshold: 60, baseBonus: 18000 },
  { threshold: 65, baseBonus: 20000 },
  { threshold: 70, baseBonus: 30000 },
  { threshold: 75, baseBonus: 35000 }
];

export function calculateIncentive(employee: Employee, monthlyOutcomesInput: unknown) {
  const outcomes = Number(monthlyOutcomesInput);
  if (
    typeof outcomes !== 'number' ||
    !Number.isInteger(outcomes) ||
    Number.isNaN(outcomes) ||
    outcomes < 0
  ) {
    throw new Error('Monthly outcomes must be a non-negative integer');
  }

  if (employee.adjustment === null || employee.adjustment === undefined) {
    return {
      status: 'UNAVAILABLE',
      message: 'Incentive configuration unavailable'
    };
  }

  const adjustment = employee.adjustment;
  const multiplier = Number((1 + adjustment / 100).toFixed(4));

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

  let nextMilestone = null;
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

  const milestones = INCENTIVE_TIERS.map((tier) => {
    const tierFinalBonus = Math.round(tier.baseBonus * multiplier);
    const achieved = outcomes >= tier.threshold;
    const current = highestAchievedTier ? tier.threshold === highestAchievedTier.threshold : false;

    return {
      threshold: tier.threshold,
      baseBonus: tier.baseBonus,
      finalBonus: tierFinalBonus,
      achieved,
      current
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
