const express = require('express');
const rateLimiter = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const financeRoutes = require('./routes/finance');

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Bem-vindo à API do MedFinance.' });
});

app.use('/auth', rateLimiter, authRoutes);
app.use('/courses', rateLimiter, coursesRoutes);
app.use('/finance', rateLimiter, financeRoutes);

module.exports = app;
