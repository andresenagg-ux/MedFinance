const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Disable the X-Powered-By header to avoid leaking implementation details
app.disable('x-powered-by');

// Apply Helmet globally to secure HTTP headers
app.use(helmet());

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000', // Local web frontend
  'http://localhost:19006', // Local mobile frontend (Expo default)
  'https://frontend-web.medfinance.com',
  'https://frontend-mobile.medfinance.com'
];

const allowedOrigins = [
  process.env.FRONTEND_WEB_URL,
  process.env.FRONTEND_MOBILE_URL,
  process.env.FRONTEND_WEB_PROD_URL,
  process.env.FRONTEND_MOBILE_PROD_URL,
  ...DEFAULT_ALLOWED_ORIGINS
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Requests like mobile native fetch may not include an origin header
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`MedFinance API listening on port ${PORT}`);
});
