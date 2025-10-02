const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const financeSummary = {
  totals: {
    income: 18000,
    expenses: 9000,
    savings: 6000,
    investments: 3000
  },
  budgetDistribution: [
    { category: 'Essenciais (50%)', percentage: 50 },
    { category: 'Qualidade de Vida (30%)', percentage: 30 },
    { category: 'Investimentos (20%)', percentage: 20 }
  ],
  balanceTimeline: [
    { month: 'Jan', balance: 8000 },
    { month: 'Fev', balance: 8200 },
    { month: 'Mar', balance: 7800 },
    { month: 'Abr', balance: 8400 },
    { month: 'Mai', balance: 9000 },
    { month: 'Jun', balance: 9500 },
    { month: 'Jul', balance: 9800 },
    { month: 'Ago', balance: 10200 },
    { month: 'Set', balance: 11000 },
    { month: 'Out', balance: 11500 },
    { month: 'Nov', balance: 11800 },
    { month: 'Dez', balance: 12500 }
  ]
};

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/finance/summary', (req, res) => {
  res.json(financeSummary);
});

app.listen(PORT, () => {
  console.log(`Servidor MedFinance ouvindo na porta ${PORT}`);
});
