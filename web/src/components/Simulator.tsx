import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { SimulationInput, SimulationResult } from '../../../shared/api/simulator';
import { buildFallbackResult, simulateFinancialPlan } from '../../../shared/api/simulator';

const DEBOUNCE_DELAY = 300;
const API_ENDPOINT = '/api/simulator';

const initialState: SimulationInput = {
  monthlyIncome: 30000,
  monthlyExpenses: 18000,
  investmentRate: 0.1,
};

export function Simulator() {
  const [form, setForm] = useState<SimulationInput>(initialState);
  const [result, setResult] = useState<SimulationResult>(buildFallbackResult(initialState));
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsCalculating(true);
    setError(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const abortController = new AbortController();
      abortRef.current = abortController;

      try {
        const data = await simulateFinancialPlan(API_ENDPOINT, form, abortController.signal);
        setResult(data);
      } catch (err) {
        console.error(err);
        setResult(buildFallbackResult(form));
        setError('Não foi possível atualizar a simulação em tempo real. Exibindo cálculo estimado.');
      } finally {
        setIsCalculating(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [form]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: Number(value),
    }));
  }

  return (
    <section aria-live="polite">
      <header>
        <h1>Simulador financeiro</h1>
        <p>Ajuste os valores e veja o resultado recalculado automaticamente.</p>
      </header>

      <form className="simulator-form">
        <label>
          Renda mensal
          <input
            name="monthlyIncome"
            type="number"
            min={0}
            value={form.monthlyIncome}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Despesas mensais
          <input
            name="monthlyExpenses"
            type="number"
            min={0}
            value={form.monthlyExpenses}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Taxa de investimento anual
          <input
            name="investmentRate"
            type="number"
            min={0}
            step={0.01}
            value={form.investmentRate}
            onChange={handleInputChange}
          />
        </label>
      </form>

      {isCalculating ? (
        <p role="status" className="simulator-spinner">
          calculando...
        </p>
      ) : (
        <dl className="simulator-result">
          <div>
            <dt>Poupança mensal</dt>
            <dd>{result.monthlySavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</dd>
          </div>
          <div>
            <dt>Poupança anual</dt>
            <dd>{result.annualSavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</dd>
          </div>
          <div>
            <dt>Retorno do investimento</dt>
            <dd>
              {result.investmentReturn.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </dd>
          </div>
        </dl>
      )}

      {error ? <p className="simulator-error">{error}</p> : null}
    </section>
  );
}
