export interface Executive {
  id: string;
  name: string;
  email: string;
}

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

export interface CalculationSuccessData {
  status: 'AVAILABLE' | 'SUCCESS';
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

export interface CalculationUnavailableData {
  status: 'UNAVAILABLE';
  message: string;
}

export interface CalculationErrorData {
  status: 'ERROR';
  message: string;
  error?: string;
}

export type CalculationResponse =
  | CalculationSuccessData
  | CalculationUnavailableData
  | CalculationErrorData;
