import type { Request, Response } from 'express';
import { Router } from 'express';
import { financeSimulatorService } from '../services/financeSimulatorService';

export const router = Router();

export function handleFinancialSimulation(req: Request, res: Response) {
  try {
    const result = financeSimulatorService.simulate(req.body ?? {});
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request payload.';
    res.status(400).json({ message });
  }
}

router.post('/simulator', handleFinancialSimulation);
