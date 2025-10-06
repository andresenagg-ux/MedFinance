const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ message: 'Autenticação processada com sucesso.' });
});

router.post('/logout', (_req, res) => {
  res.json({ message: 'Logout realizado com sucesso.' });
});

module.exports = router;
