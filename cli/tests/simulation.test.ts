import { buildSimulationSummary, calculateSimulation, SimulationError, validateInput } from '../src/simulation';

describe('calculateSimulation', () => {
  it('computes savings and investment return for valid input', () => {
    const result = calculateSimulation({
      monthlyIncome: 12000,
      monthlyExpenses: 7500,
      investmentRate: 0.1,
    });

    expect(result).toEqual({
      monthlySavings: 4500,
      annualSavings: 54000,
      investmentReturn: 5400,
    });
  });

  it('never returns negative savings', () => {
    const result = calculateSimulation({
      monthlyIncome: 5000,
      monthlyExpenses: 6000,
      investmentRate: 0.08,
    });

    expect(result.monthlySavings).toBe(0);
    expect(result.annualSavings).toBe(0);
    expect(result.investmentReturn).toBe(0);
  });
});

describe('validateInput', () => {
  it('throws when any value is not finite', () => {
    expect(() => validateInput({ monthlyIncome: Number.NaN, monthlyExpenses: 1000, investmentRate: 0.1 })).toThrow(SimulationError);
    expect(() => validateInput({ monthlyIncome: 1000, monthlyExpenses: Number.POSITIVE_INFINITY, investmentRate: 0.1 })).toThrow(SimulationError);
    expect(() => validateInput({ monthlyIncome: 1000, monthlyExpenses: 500, investmentRate: Number.NaN })).toThrow(SimulationError);
  });

  it('throws when values are negative', () => {
    expect(() => validateInput({ monthlyIncome: -1, monthlyExpenses: 0, investmentRate: 0.1 })).toThrow('A renda mensal deve ser maior ou igual a zero.');
    expect(() => validateInput({ monthlyIncome: 0, monthlyExpenses: -10, investmentRate: 0.1 })).toThrow('As despesas mensais devem ser maiores ou iguais a zero.');
    expect(() => validateInput({ monthlyIncome: 0, monthlyExpenses: 0, investmentRate: -0.2 })).toThrow('A taxa de investimento deve ser maior ou igual a zero.');
  });
});

describe('buildSimulationSummary', () => {
  it('renders a human readable summary', () => {
    const summary = buildSimulationSummary(
      {
        monthlyIncome: 8000,
        monthlyExpenses: 5000,
        investmentRate: 0.15,
      },
      {
        monthlySavings: 3000,
        annualSavings: 36000,
        investmentReturn: 5400,
      },
    );

    expect(summary).toContain('Resumo da simulação financeira');
    expect(summary).toContain('Renda mensal:           R$\u00a08.000,00');
    expect(summary).toContain('Taxa de investimento:   15.00%');
    expect(summary).toContain('Retorno em investimentos: R$\u00a05.400,00');
  });
});
