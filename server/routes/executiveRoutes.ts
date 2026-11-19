import { Router, Request, Response } from 'express';
import { EMPLOYEES } from '../config/employeeConfig.js';

export const executiveRouter = Router();

executiveRouter.get('/', (_req: Request, res: Response) => {
  // Sort executives alphabetically by name
  const sorted = [...EMPLOYEES]
    .map((emp) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  res.json(sorted);
});
