import { Router, Request, Response } from 'express';
import { findEmployee } from '../config/employeeConfig.js';
import { calculateIncentive } from '../services/calculationService.js';

export const calculationRouter = Router();

calculationRouter.post('/', (req: Request, res: Response): void => {
  const { executiveId, monthlyOutcomes } = req.body;

  if (!executiveId || typeof executiveId !== 'string') {
    res.status(400).json({
      error: 'Invalid or missing executiveId'
    });
    return;
  }

  const employee = findEmployee(executiveId);
  if (!employee) {
    res.status(404).json({
      error: `Executive with identifier "${executiveId}" not found`
    });
    return;
  }

  if (
    monthlyOutcomes === undefined ||
    monthlyOutcomes === null ||
    typeof monthlyOutcomes !== 'number' ||
    !Number.isInteger(monthlyOutcomes) ||
    Number.isNaN(monthlyOutcomes) ||
    monthlyOutcomes < 0
  ) {
    res.status(400).json({
      error: 'monthlyOutcomes must be a non-negative integer'
    });
    return;
  }

  try {
    const result = calculateIncentive(employee, monthlyOutcomes);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Calculation error';
    res.status(400).json({ error: message });
  }
});
