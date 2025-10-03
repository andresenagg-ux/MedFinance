import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

type SimulatorPayload = {
  monthlyIncome: number;
  fixedExpenses: number;
  variableExpenses: number;
};

type SimulatorResponse = {
  finalBalance: number;
};

type DistributionItem = {
  label: string;
  percentage: number;
  amount: number;
  color: string;
};

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const FinanceSimulator: React.FC = () => {
  const [formValues, setFormValues] = useState<SimulatorPayload>({
    monthlyIncome: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulatorResponse | null>(null);

  const chartRef = useRef<SVGSVGElement | null>(null);

  const distribution = useMemo<DistributionItem[]>(() => {
    const { monthlyIncome } = formValues;

    if (!monthlyIncome || Number.isNaN(monthlyIncome)) {
      return [];
    }

    const baseValue = Math.max(monthlyIncome, 0);
    const items: Array<Omit<DistributionItem, "amount">> = [
      { label: "Essenciais", percentage: 50, color: "#2563EB" },
      { label: "Qualidade de Vida", percentage: 30, color: "#10B981" },
      { label: "Investimentos", percentage: 20, color: "#F59E0B" },
    ];

    return items.map((item) => ({
      ...item,
      amount: (item.percentage / 100) * baseValue,
    }));
  }, [formValues]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormValues((previous) => ({
        ...previous,
        [name]: Number(value) || 0,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/finance/simulator", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        });

        if (!response.ok) {
          throw new Error("Não foi possível calcular. Tente novamente.");
        }

        const data: SimulatorResponse = await response.json();
        setResult(data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Ocorreu um erro inesperado."
        );
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    },
    [formValues]
  );

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    if (!distribution.length) {
      return;
    }

    const width = 320;
    const height = 240;
    const radius = Math.min(width, height) / 2;

    const group = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "w-full h-auto")
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<DistributionItem>()
      .value((d) => d.percentage)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<DistributionItem>>()
      .innerRadius(0)
      .outerRadius(radius - 10);

    const arcs = group.selectAll("path").data(pie(distribution)).enter();

    arcs
      .append("path")
      .attr("d", arc as any)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    const labelArc = d3
      .arc<d3.PieArcDatum<DistributionItem>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("class", "text-xs fill-slate-50 font-semibold")
      .text((d) => `${d.data.percentage}%`);
  }, [distribution]);

  const netBalance = useMemo(() => {
    const { monthlyIncome, fixedExpenses, variableExpenses } = formValues;
    return monthlyIncome - fixedExpenses - variableExpenses;
  }, [formValues]);

  return (
    <div className="flex flex-col gap-8 rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/70 ring-1 ring-slate-100 max-w-4xl mx-auto">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Simulador Financeiro</h1>
        <p className="text-sm text-slate-500">
          Explore como sua renda mensal se distribui e descubra oportunidades
          de investimento seguindo a regra 50/30/20.
        </p>
      </header>

      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-600">
            Renda mensal (R$)
          </span>
          <input
            type="number"
            name="monthlyIncome"
            min={0}
            step={100}
            value={formValues.monthlyIncome}
            onChange={handleChange}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-600">
            Gastos fixos (R$)
          </span>
          <input
            type="number"
            name="fixedExpenses"
            min={0}
            step={50}
            value={formValues.fixedExpenses}
            onChange={handleChange}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-600">
            Gastos variáveis (R$)
          </span>
          <input
            type="number"
            name="variableExpenses"
            min={0}
            step={50}
            value={formValues.variableExpenses}
            onChange={handleChange}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </label>

        <div className="md:col-span-3 flex flex-col md:flex-row md:items-end gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={isLoading}
          >
            {isLoading ? "Calculando..." : "Calcular"}
          </button>
          <span className="text-sm text-slate-400">
            Saldo previsto: <strong className="text-slate-700">{formatter.format(netBalance)}</strong>
          </span>
        </div>
      </form>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Resultados</h2>
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Saldo final</span>
              <span className="text-xl font-bold text-slate-900">
                {formatter.format(result?.finalBalance ?? netBalance)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2 font-medium">Categoria</th>
                    <th className="px-3 py-2 font-medium text-right">Percentual</th>
                    <th className="px-3 py-2 font-medium text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {distribution.map((item) => (
                    <tr key={item.label} className="text-sm text-slate-600">
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.label}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-slate-500">
                        {item.percentage}%
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-slate-700">
                        {formatter.format(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Distribuição visual</h2>
          <div className="flex h-full items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-4">
            {distribution.length ? (
              <svg ref={chartRef} className="max-w-full" />
            ) : (
              <p className="text-sm text-slate-400 text-center">
                Preencha a renda mensal para visualizar a distribuição 50/30/20.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinanceSimulator;
