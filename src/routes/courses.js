const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ courses: ['Planejamento Financeiro', 'Investimentos para Médicos'] });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Curso criado com sucesso.' });
});

module.exports = router;
