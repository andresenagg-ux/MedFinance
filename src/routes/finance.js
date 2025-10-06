const express = require('express');

const router = express.Router();

router.get('/dashboard', (_req, res) => {
  res.json({ revenue: 12000, expenses: 5000, balance: 7000 });
});

router.post('/transactions', (req, res) => {
  res.status(201).json({ message: 'Transação registrada com sucesso.' });
});

module.exports = router;
