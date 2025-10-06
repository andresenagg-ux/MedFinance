export interface SimulationInput {
  monthlyIncome: number;
  monthlyExpenses: number;
  investmentRate: number;
}

export interface SimulationResult {
  monthlySavings: number;
  annualSavings: number;
  investmentReturn: number;
}

export class SimulationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SimulationError';
  }
}

function assertFiniteNumber(value: number, field: string) {
  if (!Number.isFinite(value)) {
    throw new SimulationError(`O valor de "${field}" deve ser um número válido.`);
  }
}

export function validateInput(input: SimulationInput): SimulationInput {
  assertFiniteNumber(input.monthlyIncome, 'monthlyIncome');
  assertFiniteNumber(input.monthlyExpenses, 'monthlyExpenses');
  assertFiniteNumber(input.investmentRate, 'investmentRate');

  if (input.monthlyIncome < 0) {
    throw new SimulationError('A renda mensal deve ser maior ou igual a zero.');
  }

  if (input.monthlyExpenses < 0) {
    throw new SimulationError('As despesas mensais devem ser maiores ou iguais a zero.');
  }

  if (input.investmentRate < 0) {
    throw new SimulationError('A taxa de investimento deve ser maior ou igual a zero.');
  }

  return input;
}

export function calculateSimulation(input: SimulationInput): SimulationResult {
  const { monthlyIncome, monthlyExpenses, investmentRate } = validateInput(input);

  const monthlySavings = Math.max(monthlyIncome - monthlyExpenses, 0);
  const annualSavings = monthlySavings * 12;
  const investmentReturn = annualSavings * investmentRate;

  return {
    monthlySavings,
    annualSavings,
    investmentReturn,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
}

export function buildSimulationSummary(input: SimulationInput, result: SimulationResult): string {
  const lines = [
    'Resumo da simulação financeira',
    '--------------------------------',
    `Renda mensal:           ${formatCurrency(input.monthlyIncome)}`,
    `Despesas mensais:       ${formatCurrency(input.monthlyExpenses)}`,
    `Taxa de investimento:   ${(input.investmentRate * 100).toFixed(2)}%`,
    '',
    `Poupança mensal:        ${formatCurrency(result.monthlySavings)}`,
    `Poupança anual:         ${formatCurrency(result.annualSavings)}`,
    `Retorno em investimentos: ${formatCurrency(result.investmentReturn)}`,
  ];

  return lines.join('\n');
}
