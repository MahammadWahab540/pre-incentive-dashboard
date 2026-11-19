import { findEmployee } from '../_employeeConfig';
import { calculateIncentive } from '../_calculationService';

export const onRequestPost = async (context: { request: Request }) => {
  try {
    const body = (await context.request.json()) as {
      executiveId?: string;
      monthlyOutcomes?: unknown;
    };

    if (!body || !body.executiveId) {
      return new Response(
        JSON.stringify({
          status: 'ERROR',
          message: 'executiveId is required'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const employee = findEmployee(body.executiveId);
    if (!employee) {
      return new Response(
        JSON.stringify({
          status: 'ERROR',
          message: `Executive not found: ${body.executiveId}`
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    if (
      body.monthlyOutcomes === undefined ||
      body.monthlyOutcomes === null ||
      typeof body.monthlyOutcomes !== 'number' ||
      !Number.isInteger(body.monthlyOutcomes) ||
      body.monthlyOutcomes < 0
    ) {
      return new Response(
        JSON.stringify({
          status: 'ERROR',
          message: 'Monthly outcomes must be a non-negative integer'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const result = calculateIncentive(employee, body.monthlyOutcomes);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Calculation error';
    return new Response(
      JSON.stringify({
        status: 'ERROR',
        message: msg
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
