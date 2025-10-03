import { Request, Response } from 'express';
import { financeSimulatorService } from '../services/financeSimulatorService';

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function simulateFinance(req: Request, res: Response) {
  const { loanAmount, annualInterestRate, loanTermMonths, extraPayment } = req.body ?? {};

  const errors: string[] = [];

  if (!isNumber(loanAmount) || loanAmount <= 0) {
    errors.push('loanAmount must be a positive number');
  }

  if (!isNumber(annualInterestRate) || annualInterestRate < 0) {
    errors.push('annualInterestRate must be a non-negative number');
  }

  if (!isNumber(loanTermMonths) || loanTermMonths <= 0) {
    errors.push('loanTermMonths must be a positive number');
  }

  if (extraPayment !== undefined) {
    if (!isNumber(extraPayment) || extraPayment < 0) {
      errors.push('extraPayment must be a non-negative number when provided');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Invalid request data', errors });
  }

  const result = financeSimulatorService.simulate({
    loanAmount,
    annualInterestRate,
    loanTermMonths,
    extraPayment,
  });

  return res.json(result);
}
