const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const createAuthMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

const authMiddleware = createAuthMiddleware();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/courses', authMiddleware, (req, res) => {
  res.json({
    data: [
      { id: 1, title: 'Planejamento Financeiro para Médicos' },
      { id: 2, title: 'Investimentos para Profissionais de Saúde' },
    ],
  });
});

app.get('/finance-tools', authMiddleware, (req, res) => {
  res.json({
    data: [
      { id: 'budget', name: 'Calculadora de Orçamento' },
      { id: 'retirement', name: 'Simulador de Aposentadoria' },
    ],
  });
});

app.get('/community', authMiddleware, (req, res) => {
  res.json({
    message: 'Bem-vindo à comunidade MedFinance!'
  });
});

app.get('/admin', authMiddleware, (req, res) => {
  res.json({
    message: 'Área administrativa MedFinance.'
  });
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({ error: 'Token inválido ou ausente.' });
  }

  console.error(err);
  return res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor.' });
});

module.exports = app;
