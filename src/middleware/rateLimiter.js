const rateLimit = require('express-rate-limit');

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;

const rateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_IN_MS,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message:
        'Você excedeu o limite de 100 requisições em 15 minutos. Aguarde e tente novamente mais tarde.'
    });
  }
});

module.exports = rateLimiter;
