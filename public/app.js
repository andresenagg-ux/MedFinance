async function loadFinanceSummary() {
  try {
    const response = await fetch('/finance/summary');
    if (!response.ok) {
      throw new Error('Não foi possível carregar os dados financeiros.');
    }

    const summary = await response.json();
    renderTotals(summary.totals);
    renderPieChart(summary.budgetDistribution);
    renderLineChart(summary.balanceTimeline);
  } catch (error) {
    console.error(error);
    const main = document.querySelector('main');
    const message = document.createElement('p');
    message.textContent = 'Erro ao carregar o dashboard. Tente novamente mais tarde.';
    message.classList.add('error');
    main.appendChild(message);
  }
}

function renderTotals(totals) {
  const totalsContainer = document.getElementById('totals');
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  Object.entries(totals).forEach(([key, value]) => {
    const card = document.createElement('article');
    card.classList.add('card');

    const title = document.createElement('h3');
    title.textContent = key.charAt(0).toUpperCase() + key.slice(1);

    const amount = document.createElement('strong');
    amount.textContent = formatter.format(value);

    card.appendChild(title);
    card.appendChild(amount);
    totalsContainer.appendChild(card);
  });
}

function renderPieChart(data) {
  const svg = d3.select('#pie-chart svg');
  const width = parseInt(svg.style('width'));
  const height = parseInt(svg.style('height'));
  const radius = Math.min(width, height) / 2 - 20;

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.category))
    .range(['#38bdf8', '#818cf8', '#f472b6']);

  const pie = d3.pie().value((d) => d.percentage);
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius);

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  const g = svg
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  g.selectAll('path')
    .data(pie(data))
    .join('path')
    .attr('d', arc)
    .attr('fill', (d) => color(d.data.category))
    .attr('stroke', '#0f172a')
    .attr('stroke-width', '2px')
    .on('mouseover', function (event, d) {
      d3.select(this).transition().duration(200).attr('transform', 'scale(1.05)');
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0.95);
      tooltip
        .html(`<strong>${d.data.category}</strong><br/>${d.data.percentage}% do orçamento`)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 28}px`);
    })
    .on('mousemove', function (event) {
      tooltip.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY - 28}px`);
    })
    .on('mouseout', function () {
      d3.select(this).transition().duration(200).attr('transform', 'scale(1)');
      tooltip.transition().duration(200).style('opacity', 0);
    });

  const legend = svg
    .append('g')
    .attr('transform', `translate(${width - 150}, 20)`);

  legend
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', 0)
    .attr('y', (_, i) => i * 24)
    .attr('width', 14)
    .attr('height', 14)
    .attr('rx', 3)
    .attr('fill', (d) => color(d.category));

  legend
    .selectAll('text')
    .data(data)
    .join('text')
    .attr('x', 24)
    .attr('y', (_, i) => i * 24 + 12)
    .attr('alignment-baseline', 'middle')
    .attr('fill', '#e2e8f0')
    .attr('font-size', 12)
    .text((d) => `${d.category}`);
}

function renderLineChart(data) {
  const svg = d3.select('#line-chart svg');
  const width = parseInt(svg.style('width'));
  const height = parseInt(svg.style('height'));
  const margins = { top: 20, right: 30, bottom: 40, left: 60 };

  const x = d3
    .scalePoint()
    .domain(data.map((d) => d.month))
    .range([margins.left, width - margins.right]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.balance) * 1.1])
    .range([height - margins.bottom, margins.top]);

  svg.attr('viewBox', `0 0 ${width} ${height}`);

  const line = d3
    .line()
    .x((d) => x(d.month))
    .y((d) => y(d.balance))
    .curve(d3.curveMonotoneX);

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#38bdf8')
    .attr('stroke-width', 3)
    .attr('d', line);

  svg
    .append('g')
    .attr('transform', `translate(0, ${height - margins.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('fill', '#cbd5f5');

  svg
    .append('g')
    .attr('transform', `translate(${margins.left}, 0)`)
    .call(d3.axisLeft(y).ticks(6).tickFormat((d) => `R$ ${d / 1000}k`))
    .selectAll('text')
    .attr('fill', '#cbd5f5');

  svg
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', (d) => x(d.month))
    .attr('cy', (d) => y(d.balance))
    .attr('r', 5)
    .attr('fill', '#f472b6')
    .attr('stroke', '#0f172a')
    .attr('stroke-width', 2)
    .append('title')
    .text((d) => `${d.month}: R$ ${d.balance.toLocaleString('pt-BR')}`);
}

loadFinanceSummary();
