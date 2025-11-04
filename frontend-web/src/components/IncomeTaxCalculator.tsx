import { useMemo, useState } from 'react';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const percentageFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

const DEPENDENT_DEDUCTION = 189.59;
const SIMPLIFIED_DISCOUNT_LIMIT = 528;

const TAX_BRACKETS = [
  { limit: 2259.2, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 169.44 },
  { limit: 3751.05, rate: 0.15, deduction: 381.44 },
  { limit: 4664.68, rate: 0.225, deduction: 662.77 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.275, deduction: 896 }
] as const;

type TaxComputation = {
  taxableBase: number;
  taxDue: number;
  effectiveRate: number;
  bracketRate: number;
  deduction: number;
  netIncome: number;
};

const computeBracket = (taxableBase: number) => {
  for (const bracket of TAX_BRACKETS) {
    if (taxableBase <= bracket.limit) {
      return bracket;
    }
  }

  return TAX_BRACKETS[TAX_BRACKETS.length - 1];
};

const calculateTax = (grossIncome: number, taxableBase: number, additionalDiscount = 0): TaxComputation => {
  const bracket = computeBracket(taxableBase);
  const taxBeforeAdjustment = taxableBase * bracket.rate - bracket.deduction;
  const taxDue = Math.max(0, taxBeforeAdjustment - additionalDiscount);
  const netIncome = Math.max(0, grossIncome - taxDue);
  const effectiveRate = grossIncome > 0 ? taxDue / grossIncome : 0;

  return {
    taxableBase,
    taxDue,
    effectiveRate,
    bracketRate: bracket.rate,
    deduction: bracket.deduction,
    netIncome
  };
};

const parseNumber = (value: string) => {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};

const IncomeTaxCalculator = () => {
  const [grossIncome, setGrossIncome] = useState('18000');
  const [inss, setInss] = useState('2200');
  const [dependents, setDependents] = useState('0');
  const [otherDeductions, setOtherDeductions] = useState('450');

  const calculations = useMemo(() => {
    const grossIncomeValue = parseNumber(grossIncome);
    const inssValue = Math.min(parseNumber(inss), grossIncomeValue);
    const dependentsValue = Math.max(0, Math.floor(parseNumber(dependents)));
    const otherDeductionsValue = Math.max(0, parseNumber(otherDeductions));

    const baseAfterInss = Math.max(0, grossIncomeValue - inssValue);

    const completeBase = Math.max(
      0,
      baseAfterInss - otherDeductionsValue - dependentsValue * DEPENDENT_DEDUCTION
    );

    const simplifiedDiscount = Math.min(baseAfterInss * 0.25, SIMPLIFIED_DISCOUNT_LIMIT);
    const simplifiedBase = Math.max(0, baseAfterInss - simplifiedDiscount);

    const completeCalculation = calculateTax(grossIncomeValue, completeBase);
    const simplifiedCalculation = calculateTax(grossIncomeValue, simplifiedBase);

    return {
      grossIncome: grossIncomeValue,
      inss: inssValue,
      dependents: dependentsValue,
      otherDeductions: otherDeductionsValue,
      dependentDiscountTotal: dependentsValue * DEPENDENT_DEDUCTION,
      complete: {
        ...completeCalculation,
        netIncome: Math.max(0, grossIncomeValue - inssValue - completeCalculation.taxDue)
      },
      simplified: {
        ...simplifiedCalculation,
        netIncome: Math.max(0, grossIncomeValue - inssValue - simplifiedCalculation.taxDue)
      },
      simplifiedDiscount
    };
  }, [grossIncome, inss, dependents, otherDeductions]);

  return (
    <section className="tax-calculator" aria-label="Calculadora de Imposto de Renda">
      <div className="tax-calculator__card">
        <header className="tax-calculator__header">
          <h3>Simule seu Imposto de Renda mensal</h3>
          <p>
            Ajuste os valores abaixo e visualize instantaneamente a diferença entre o modelo completo e o desconto
            simplificado oferecido pela Receita Federal.
          </p>
        </header>

        <form className="tax-calculator__grid">
          <label htmlFor="gross-income">
            Renda bruta mensal
            <input
              id="gross-income"
              name="gross-income"
              type="number"
              min="0"
              step="100"
              value={grossIncome}
              onChange={(event) => setGrossIncome(event.target.value)}
              inputMode="decimal"
            />
          </label>
          <label htmlFor="inss">
            Contribuição ao INSS
            <input
              id="inss"
              name="inss"
              type="number"
              min="0"
              step="50"
              value={inss}
              onChange={(event) => setInss(event.target.value)}
              inputMode="decimal"
            />
          </label>
          <label htmlFor="dependents">
            Número de dependentes
            <input
              id="dependents"
              name="dependents"
              type="number"
              min="0"
              step="1"
              value={dependents}
              onChange={(event) => setDependents(event.target.value)}
              inputMode="numeric"
            />
          </label>
          <label htmlFor="other-deductions">
            Outras deduções mensais
            <input
              id="other-deductions"
              name="other-deductions"
              type="number"
              min="0"
              step="50"
              value={otherDeductions}
              onChange={(event) => setOtherDeductions(event.target.value)}
              inputMode="decimal"
            />
          </label>
        </form>

        <div className="tax-calculator__results">
          <article className="tax-calculator__result" aria-live="polite">
            <header>
              <h4>Modelo completo</h4>
              <span>Deduz INSS, dependentes e outras despesas permitidas</span>
            </header>
            <dl>
              <div>
                <dt>Base tributável</dt>
                <dd>{currencyFormatter.format(calculations.complete.taxableBase)}</dd>
              </div>
              <div>
                <dt>Imposto devido</dt>
                <dd>{currencyFormatter.format(calculations.complete.taxDue)}</dd>
              </div>
              <div>
                <dt>Alíquota efetiva</dt>
                <dd>{percentageFormatter.format(calculations.complete.effectiveRate)}</dd>
              </div>
              <div>
                <dt>Salário líquido (após IR)</dt>
                <dd>{currencyFormatter.format(calculations.complete.netIncome)}</dd>
              </div>
            </dl>
            <footer>
              <p>
                Alíquota nominal de {percentageFormatter.format(calculations.complete.bracketRate)} com parcela dedutível de{' '}
                {currencyFormatter.format(calculations.complete.deduction)}.
              </p>
              {calculations.dependents > 0 ? (
                <p>
                  Desconto total por dependentes: {currencyFormatter.format(calculations.dependentDiscountTotal)}.
                </p>
              ) : null}
            </footer>
          </article>

          <article className="tax-calculator__result tax-calculator__result--highlight" aria-live="polite">
            <header>
              <h4>Desconto simplificado</h4>
              <span>Abate automático de até {currencyFormatter.format(SIMPLIFIED_DISCOUNT_LIMIT)} por mês</span>
            </header>
            <dl>
              <div>
                <dt>Base tributável</dt>
                <dd>{currencyFormatter.format(calculations.simplified.taxableBase)}</dd>
              </div>
              <div>
                <dt>Imposto devido</dt>
                <dd>{currencyFormatter.format(calculations.simplified.taxDue)}</dd>
              </div>
              <div>
                <dt>Alíquota efetiva</dt>
                <dd>{percentageFormatter.format(calculations.simplified.effectiveRate)}</dd>
              </div>
              <div>
                <dt>Salário líquido (após IR)</dt>
                <dd>{currencyFormatter.format(calculations.simplified.netIncome)}</dd>
              </div>
            </dl>
            <footer>
              <p>
                Desconto aplicado: {currencyFormatter.format(calculations.simplifiedDiscount)} sobre a base após INSS.
              </p>
              <p>
                Ideal para quem não possui deduções adicionais relevantes no mês.
              </p>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
};

export default IncomeTaxCalculator;
