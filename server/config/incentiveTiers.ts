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

export const MIN_MILESTONE_THRESHOLD = 50;
export const MAX_MILESTONE_THRESHOLD = 75;
export const MAX_BASE_BONUS = 35000;
