import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import type { NumberValue } from 'd3-scale';
import type { Selection } from 'd3-selection';

type FinancialDatum = {
  month: string;
  revenue: number;
  expenses: number;
};

const dashboardData: FinancialDatum[] = [
  { month: 'Jan', revenue: 14500, expenses: 8300 },
  { month: 'Fev', revenue: 15200, expenses: 9100 },
  { month: 'Mar', revenue: 16300, expenses: 9400 },
  { month: 'Abr', revenue: 15800, expenses: 9900 },
  { month: 'Mai', revenue: 17150, expenses: 10200 },
  { month: 'Jun', revenue: 18500, expenses: 10800 }
];

const chartDimensions = {
  width: 720,
  height: 360,
  margin: { top: 32, right: 32, bottom: 56, left: 72 }
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const FinancialDashboard = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const data = dashboardData;

  const totals = useMemo(() => {
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
    const profit = totalRevenue - totalExpenses;
    const savingsRate = totalRevenue === 0 ? 0 : profit / totalRevenue;
    const bestMonth = data.reduce((prev, current) =>
      current.revenue - current.expenses > prev.revenue - prev.expenses ? current : prev
    );

    return {
      totalRevenue,
      totalExpenses,
      profit,
      savingsRate,
      bestMonth
    };
  }, [data]);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const { width, height, margin } = chartDimensions;
    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    svg.attr('preserveAspectRatio', 'xMidYMid meet');

    const x = d3
      .scalePoint<string>()
      .domain(data.map((item: FinancialDatum) => item.month))
      .range([margin.left, width - margin.right]);

    const yMax =
      d3.max<FinancialDatum, number>(data, (item: FinancialDatum) => Math.max(item.revenue, item.expenses)) ?? 0;

    const y = d3
      .scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const grid = svg.append('g').attr('class', 'dashboard__grid');

    grid
      .selectAll<SVGLineElement, number>('line')
      .data(y.ticks())
      .join('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', (d: number) => y(d))
      .attr('y2', (d: number) => y(d));

    const axisBottom = d3.axisBottom(x).tickSizeOuter(0);

    svg
      .append<SVGGElement>('g')
      .attr('class', 'dashboard__axis dashboard__axis--x')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(axisBottom);

    const axisLeft = d3
      .axisLeft(y)
      .ticks(5)
      .tickFormat((value: NumberValue) => currencyFormatter.format(Number(value)));

    const yAxisGroup = svg
      .append<SVGGElement>('g')
      .attr('class', 'dashboard__axis dashboard__axis--y')
      .attr('transform', `translate(${margin.left}, 0)`);

    const typedYAxisGroup = yAxisGroup as Selection<SVGGElement, unknown, null, undefined>;
    typedYAxisGroup.call(axisLeft);
    typedYAxisGroup.select('.domain').remove();

    const lineGenerator = (accessor: (datum: FinancialDatum) => number) =>
      d3
        .line<FinancialDatum>()
        .defined((datum) => Number.isFinite(accessor(datum)))
        .x((datum) => x(datum.month) ?? margin.left)
        .y((datum) => y(accessor(datum)))
        .curve(d3.curveMonotoneX);

    const incomeLine = lineGenerator((datum) => datum.revenue);
    const expenseLine = lineGenerator((datum) => datum.expenses);

    svg
      .append('path')
      .datum(data)
      .attr('class', 'dashboard__line dashboard__line--revenue')
      .attr('d', incomeLine);

    svg
      .append('path')
      .datum(data)
      .attr('class', 'dashboard__line dashboard__line--expenses')
      .attr('d', expenseLine);

    const createPoints = (
      accessor: (datum: FinancialDatum) => number,
      className: string
    ) =>
      svg
        .append<SVGGElement>('g')
        .attr('class', className)
        .selectAll<SVGCircleElement, FinancialDatum>('circle')
        .data(data)
        .join('circle')
        .attr('cx', (datum: FinancialDatum) => x(datum.month) ?? margin.left)
        .attr('cy', (datum: FinancialDatum) => y(accessor(datum)))
        .attr('r', 4);

    createPoints((datum) => datum.revenue, 'dashboard__point dashboard__point--revenue');
    createPoints((datum) => datum.expenses, 'dashboard__point dashboard__point--expenses');

    const legend = svg
      .append<SVGGElement>('g')
      .attr('class', 'dashboard__legend')
      .attr('transform', `translate(${margin.left}, ${margin.top / 1.5})`);

    const legendItems: Array<{ label: string; className: string }> = [
      { label: 'Receitas', className: 'dashboard__legend-item--revenue' },
      { label: 'Despesas', className: 'dashboard__legend-item--expenses' }
    ];

    const legendGroup = legend
      .selectAll<SVGGElement, { label: string; className: string }>('g')
      .data(legendItems)
      .join('g')
      .attr('class', (item: { label: string; className: string }) => `dashboard__legend-item ${item.className}`)
      .attr('transform', (_: { label: string; className: string }, index: number) => `translate(${index * 140}, 0)`);

    legendGroup
      .append<SVGRectElement>('rect')
      .attr('class', 'dashboard__legend-swatch')
      .attr('width', 16)
      .attr('height', 16)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('y', -8);

    legendGroup
      .append<SVGTextElement>('text')
      .attr('x', 24)
      .attr('dy', '0.32em')
      .attr('alignment-baseline', 'middle')
      .text((item: { label: string; className: string }) => item.label);
  }, [data]);

  return (
    <section className="dashboard" aria-labelledby="dashboard-heading">
      <div className="container">
        <div className="dashboard__header">
          <h2 id="dashboard-heading">Dashboard financeiro</h2>
          <p>
            Acompanhe a evolução das receitas e despesas médicas dos últimos seis meses e monitore a taxa de
            poupança mensal.
          </p>
        </div>
        <div className="dashboard__content">
          <figure>
            <svg ref={svgRef} role="img" aria-labelledby="dashboard-heading dashboard-description" />
            <figcaption id="dashboard-description">
              Evolução das receitas e despesas mensais em reais, com linhas destacando entradas e saídas.
            </figcaption>
          </figure>
          <dl className="dashboard__stats">
            <div>
              <dt>Receita acumulada</dt>
              <dd>{currencyFormatter.format(totals.totalRevenue)}</dd>
            </div>
            <div>
              <dt>Despesas acumuladas</dt>
              <dd>{currencyFormatter.format(totals.totalExpenses)}</dd>
            </div>
            <div>
              <dt>Lucro líquido</dt>
              <dd>{currencyFormatter.format(totals.profit)}</dd>
            </div>
            <div>
              <dt>Taxa de poupança</dt>
              <dd>{(totals.savingsRate * 100).toFixed(1)}%</dd>
            </div>
            <div>
              <dt>Melhor mês</dt>
              <dd>
                {totals.bestMonth.month} · {currencyFormatter.format(totals.bestMonth.revenue - totals.bestMonth.expenses)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default FinancialDashboard;
