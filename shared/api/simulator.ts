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

const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
};

export async function simulateFinancialPlan(
  endpoint: string,
  input: SimulationInput,
  signal?: AbortSignal,
): Promise<SimulationResult> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Falha ao calcular simulação: ${response.status}`);
  }

  return response.json();
}

export function buildFallbackResult(input: SimulationInput): SimulationResult {
  const monthlySavings = Math.max(input.monthlyIncome - input.monthlyExpenses, 0);
  const annualSavings = monthlySavings * 12;
  const investmentReturn = annualSavings * input.investmentRate;

  return {
    monthlySavings,
    annualSavings,
    investmentReturn,
  };
}
