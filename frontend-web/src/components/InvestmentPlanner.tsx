import { useEffect, useMemo, useState } from 'react';

type CdiResponse = {
  date: string;
  annualRate: number;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function parseNumber(value: string) {
  if (value.trim() === '') {
    return NaN;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

const InvestmentPlanner = () => {
  const [cdiData, setCdiData] = useState<CdiResponse | null>(null);
  const [isLoadingCdi, setIsLoadingCdi] = useState(false);
  const [cdiError, setCdiError] = useState<string | null>(null);

  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [initialInvestment, setInitialInvestment] = useState('');
  const [cdiPercentage, setCdiPercentage] = useState('100');
  const [investmentYears, setInvestmentYears] = useState('1');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [hasManualContribution, setHasManualContribution] = useState(false);

  useEffect(() => {
    if (import.meta.env.MODE === 'test') {
      return undefined;
    }

    const controller = new AbortController();

    const fetchCdi = async () => {
      setIsLoadingCdi(true);
      setCdiError(null);

      try {
        const baseUrl =
          import.meta.env.VITE_API_BASE_URL ?? (typeof window !== 'undefined' ? window.location.origin : undefined);

        if (!baseUrl) {
          throw new Error('Origem da aplicação não encontrada para buscar a taxa do CDI.');
        }

        const endpoint = new URL('/investments/cdi', baseUrl).toString();
        const response = await fetch(endpoint, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Não foi possível carregar a taxa do CDI.');
        }

        const data: CdiResponse = await response.json();
        setCdiData(data);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error(error);
        setCdiError(
          error instanceof Error ? error.message : 'Ocorreu um erro inesperado ao buscar a taxa do CDI.',
        );
        setCdiData(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCdi(false);
        }
      }
    };

    fetchCdi();

    return () => {
      controller.abort();
    };
  }, []);

  const recommendedInvestment = useMemo(() => {
    const income = parseNumber(monthlyIncome);

    if (!Number.isFinite(income) || income <= 0) {
      return null;
    }

    return income * 0.2;
  }, [monthlyIncome]);

  useEffect(() => {
    if (hasManualContribution) {
      return;
    }

    if (recommendedInvestment === null) {
      setMonthlyContribution('');
      return;
    }

    setMonthlyContribution(recommendedInvestment.toFixed(2));
  }, [recommendedInvestment, hasManualContribution]);

  const distribution = useMemo(() => {
    const income = parseNumber(monthlyIncome);

    if (!Number.isFinite(income) || income <= 0) {
      return [];
    }

    const baseValue = income;
    return [
      { label: 'Essenciais', percentage: 50, amount: baseValue * 0.5 },
      { label: 'Qualidade de vida', percentage: 30, amount: baseValue * 0.3 },
      { label: 'Investimentos', percentage: 20, amount: baseValue * 0.2 },
    ];
  }, [monthlyIncome]);

  const investmentProjection = useMemo(() => {
    const baseRate = cdiData?.annualRate;
    const initial = parseNumber(initialInvestment);
    const cdiPercent = parseNumber(cdiPercentage);
    const years = parseNumber(investmentYears);
    const monthly = parseNumber(monthlyContribution);

    if (
      baseRate === undefined ||
      !Number.isFinite(baseRate) ||
      !Number.isFinite(initial) ||
      !Number.isFinite(cdiPercent) ||
      !Number.isFinite(years) ||
      !Number.isFinite(monthly) ||
      years <= 0 ||
      cdiPercent <= 0
    ) {
      return null;
    }

    const effectiveAnnualRate = baseRate * (cdiPercent / 100);
    const annualRateDecimal = effectiveAnnualRate / 100;
    const totalMonths = Math.round(years * 12);

    const monthlyRate = Math.pow(1 + annualRateDecimal, 1 / 12) - 1;

    const principal = initial > 0 ? initial : 0;
    const contribution = monthly > 0 ? monthly : 0;
    const totalInvested = principal + contribution * totalMonths;

    let futureValueFromPrincipal = principal;
    let futureValueFromContributions = contribution * totalMonths;

    if (monthlyRate > 0) {
      const growthFactor = Math.pow(1 + monthlyRate, totalMonths);
      futureValueFromPrincipal = principal * growthFactor;
      futureValueFromContributions = contribution * ((growthFactor - 1) / monthlyRate);
    } else {
      futureValueFromPrincipal = principal;
      futureValueFromContributions = contribution * totalMonths;
    }

    const finalAmount = futureValueFromPrincipal + futureValueFromContributions;
    const profit = finalAmount - totalInvested;

    return {
      effectiveAnnualRate,
      monthlyRate,
      totalInvested,
      finalAmount,
      profit,
      totalMonths,
    };
  }, [cdiData, initialInvestment, cdiPercentage, investmentYears, monthlyContribution]);

  return (
    <section className="investment-planner" aria-labelledby="investment-planner-heading">
      <div className="container investment-planner__container">
        <header className="investment-planner__header">
          <h2 id="investment-planner-heading">Planeje seu investimento atrelado ao CDI</h2>
          <p>
            Utilize a taxa oficial do CDI para estimar o crescimento dos seus aportes ao longo do tempo e alinhe os valores
            mensais com a reserva sugerida pela regra 50/30/20.
          </p>
        </header>

        <div className="investment-planner__grid">
          <article className="investment-card" aria-labelledby="budget-heading">
            <div className="investment-card__header">
              <h4 id="budget-heading">Distribuição 50/30/20</h4>
              <p>Descubra quanto destinar a cada categoria com base em sua renda mensal.</p>
            </div>

            <form className="investment-card__form" onSubmit={(event) => event.preventDefault()}>
              <label className="investment-field">
                <span>Renda mensal (R$)</span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={monthlyIncome}
                  onChange={(event) => {
                    setMonthlyIncome(event.target.value);
                    setHasManualContribution(false);
                  }}
                  inputMode="decimal"
                />
              </label>
            </form>

            <ul className="distribution-list">
              {distribution.length === 0 ? (
                <li className="distribution-list__empty">Preencha a renda mensal para visualizar a distribuição 50/30/20.</li>
              ) : (
                distribution.map((item) => (
                  <li key={item.label}>
                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.percentage}%</span>
                    </div>
                    <span>{currencyFormatter.format(item.amount)}</span>
                  </li>
                ))
              )}
            </ul>

            {recommendedInvestment !== null && (
              <p className="investment-card__note">
                Reserve {currencyFormatter.format(recommendedInvestment)} por mês para investimentos segundo a regra 50/30/20.
              </p>
            )}
          </article>

          <article className="investment-card" aria-labelledby="projection-heading">
            <div className="investment-card__header">
              <h4 id="projection-heading">Simulação com CDI</h4>
              {isLoadingCdi ? (
                <span className="investment-card__status" role="status">
                  Carregando taxa do CDI...
                </span>
              ) : cdiError ? (
                <span className="investment-card__status investment-card__status--error" role="alert">
                  {cdiError}
                </span>
              ) : cdiData ? (
                <span className="investment-card__status">
                  CDI de {cdiData.date} · {percentFormatter.format(cdiData.annualRate / 100)} ao ano
                </span>
              ) : null}
            </div>

            <form className="investment-card__form" onSubmit={(event) => event.preventDefault()}>
              <label className="investment-field">
                <span>Aporte inicial (R$)</span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={initialInvestment}
                  onChange={(event) => setInitialInvestment(event.target.value)}
                  inputMode="decimal"
                />
              </label>

              <label className="investment-field">
                <span>Percentual do CDI contratado (%)</span>
                <input
                  type="number"
                  min={10}
                  max={200}
                  step={5}
                  value={cdiPercentage}
                  onChange={(event) => setCdiPercentage(event.target.value)}
                  inputMode="decimal"
                />
              </label>

              <label className="investment-field">
                <span>Período do investimento (anos)</span>
                <input
                  type="number"
                  min={1}
                  max={40}
                  step={1}
                  value={investmentYears}
                  onChange={(event) => setInvestmentYears(event.target.value)}
                  inputMode="decimal"
                />
              </label>

              <label className="investment-field">
                <span>Aporte mensal (R$)</span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={monthlyContribution}
                  onChange={(event) => {
                    setMonthlyContribution(event.target.value);
                    setHasManualContribution(true);
                  }}
                  inputMode="decimal"
                />
              </label>

              {recommendedInvestment !== null && hasManualContribution && (
                <button
                  type="button"
                  className="investment-card__action"
                  onClick={() => {
                    setHasManualContribution(false);
                  }}
                >
                  Usar valor sugerido pela regra 50/30/20
                </button>
              )}
            </form>

            <dl className="projection-results">
              {investmentProjection ? (
                <>
                  <div>
                    <dt>Rentabilidade anual estimada</dt>
                    <dd>{percentFormatter.format(investmentProjection.effectiveAnnualRate / 100)}</dd>
                  </div>
                  <div>
                    <dt>Rentabilidade mensal equivalente</dt>
                    <dd>{percentFormatter.format(investmentProjection.monthlyRate)}</dd>
                  </div>
                  <div>
                    <dt>Valor total investido</dt>
                    <dd>{currencyFormatter.format(investmentProjection.totalInvested)}</dd>
                  </div>
                  <div>
                    <dt>Valor final estimado</dt>
                    <dd>{currencyFormatter.format(investmentProjection.finalAmount)}</dd>
                  </div>
                  <div>
                    <dt>Lucro projetado</dt>
                    <dd>{currencyFormatter.format(investmentProjection.profit)}</dd>
                  </div>
                </>
              ) : (
                <div className="projection-results__empty">
                  Informe os valores para visualizar a projeção do investimento.
                </div>
              )}
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
};

export default InvestmentPlanner;
