import { Executive, CalculationResponse } from '../types';

export async function fetchExecutives(): Promise<Executive[]> {
  const response = await fetch('/api/executives');
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Failed to fetch executives: ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function calculateIncentive(
  executiveId: string,
  monthlyOutcomes: number
): Promise<CalculationResponse> {
  const response = await fetch('/api/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      executiveId,
      monthlyOutcomes,
    }),
  });

  const data = await response.json().catch(() => ({
    status: 'ERROR' as const,
    message: 'Invalid response from server',
  }));

  if (!response.ok && data.status !== 'UNAVAILABLE') {
    return {
      status: 'ERROR',
      message: data.error || data.message || `Calculation failed with status ${response.status}`,
    };
  }

  return data as CalculationResponse;
}
