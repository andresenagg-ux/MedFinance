import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { cdiService } from '../services/cdiService';

export async function getCdiQuote(req: Request, res: Response) {
  try {
    const amountParam = req.query.amount;
    const investmentAmount =
      amountParam !== undefined && amountParam !== '' ? Number(amountParam) : undefined;

    if (amountParam !== undefined && (investmentAmount === undefined || Number.isNaN(investmentAmount) || investmentAmount <= 0)) {
      res.status(400).json({ message: 'The "amount" query parameter must be a positive number.' });
      return;
    }

    const { date, rate } = await cdiService.getLatestRate();

    logger.debug('Fetched latest CDI rate', { date, rate });

    const response: {
      date: string;
      annualRate: number;
      investmentProjection?: {
        principal: number;
        profitAfterOneYear: number;
        finalAmountAfterOneYear: number;
      };
    } = {
      date,
      annualRate: rate,
    };

    if (investmentAmount !== undefined) {
      const profit = investmentAmount * (rate / 100);
      response.investmentProjection = {
        principal: investmentAmount,
        profitAfterOneYear: Number(profit.toFixed(2)),
        finalAmountAfterOneYear: Number((investmentAmount + profit).toFixed(2)),
      };
    }

    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while fetching CDI rate';
    logger.error('Failed to retrieve the CDI rate', { message });
    res.status(502).json({ message: 'Unable to retrieve CDI rate from Banco Central do Brasil.' });
  }
}
