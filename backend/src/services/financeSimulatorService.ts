import { roundToTwoDecimals } from '../utils/number';

type SimulatorDistribution = {
  needs: number;
  wants: number;
  savings: number;
};

type SimulatorInput = {
  monthlyIncome: unknown;
  monthlyExpenses?: unknown;
  fixedExpenses?: unknown;
  variableExpenses?: unknown;
  investmentRate?: unknown;
};

type NormalizedSimulatorInput = {
  monthlyIncome: number;
  totalExpenses: number;
  investmentRate: number;
};

type SimulatorResult = {
  finalBalance: number;
  monthlySavings: number;
  annualSavings: number;
  investmentReturn: number;
  distribution: SimulatorDistribution;
};

class FinanceSimulatorService {
  simulate(input: SimulatorInput): SimulatorResult {
    const normalized = this.normalizeInput(input);

    const { monthlyIncome, totalExpenses, investmentRate } = normalized;

    const netBalance = monthlyIncome - totalExpenses;
    const monthlySavings = Math.max(netBalance, 0);
    const annualSavings = monthlySavings * 12;
    const investmentReturn = annualSavings * investmentRate;

    const distributionBase = Math.max(monthlyIncome, 0);

    return {
      finalBalance: roundToTwoDecimals(netBalance),
      monthlySavings: roundToTwoDecimals(monthlySavings),
      annualSavings: roundToTwoDecimals(annualSavings),
      investmentReturn: roundToTwoDecimals(investmentReturn),
      distribution: {
        needs: roundToTwoDecimals(distributionBase * 0.5),
        wants: roundToTwoDecimals(distributionBase * 0.3),
        savings: roundToTwoDecimals(distributionBase * 0.2),
      },
    };
  }

  private normalizeInput(input: SimulatorInput): NormalizedSimulatorInput {
    const monthlyIncome = this.parseNonNegativeNumber(input.monthlyIncome, 'monthlyIncome', {
      required: true,
    })!;

    const investmentRate = this.parseNonNegativeNumber(input.investmentRate, 'investmentRate', {
      defaultValue: 0,
    }) ?? 0;

    const monthlyExpenses = this.parseNonNegativeNumber(input.monthlyExpenses, 'monthlyExpenses');
    const fixedExpenses = this.parseNonNegativeNumber(input.fixedExpenses, 'fixedExpenses', {
      defaultValue: 0,
    }) ?? 0;
    const variableExpenses = this.parseNonNegativeNumber(input.variableExpenses, 'variableExpenses', {
      defaultValue: 0,
    }) ?? 0;

    const totalExpenses =
      typeof monthlyExpenses === 'number'
        ? monthlyExpenses
        : fixedExpenses + variableExpenses;

    return {
      monthlyIncome,
      totalExpenses,
      investmentRate,
    };
  }

  private parseNonNegativeNumber(
    value: unknown,
    fieldName: string,
    { required = false, defaultValue }: { required?: boolean; defaultValue?: number } = {},
  ): number | undefined {
    if (value === undefined || value === null || value === '') {
      if (required) {
        throw new Error(`The "${fieldName}" field is required.`);
      }

      return defaultValue;
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new Error(`The "${fieldName}" field must be a non-negative number.`);
    }

    return parsed;
  }
}

export const financeSimulatorService = new FinanceSimulatorService();
export type { SimulatorResult };
