const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

router.get('/', authenticateToken, (req, res) => {
  return res.json({
    courses: [
      { id: 1, title: 'Planejamento Financeiro Médico', level: 'iniciante' },
      { id: 2, title: 'Investimentos para Profissionais da Saúde', level: 'intermediário' },
    ],
    user: req.user,
  });
});

module.exports = router;
