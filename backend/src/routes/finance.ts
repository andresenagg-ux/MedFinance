import { Router } from 'express';
import { simulateFinance } from '../controllers/financeSimulatorController';

export const router = Router();

router.post('/simulator', simulateFinance);
