require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(process.env.MORGAN_FORMAT || 'combined'));

const createPlaceholderRouter = (name) => {
  const router = express.Router();

  router.use((_req, res) => {
    res.status(501).json({ error: `${name} route not implemented` });
  });

  return router;
};

app.use('/auth', createPlaceholderRouter('auth'));
app.use('/courses', createPlaceholderRouter('courses'));
app.use('/finance-tools', createPlaceholderRouter('finance tools'));
app.use('/community', createPlaceholderRouter('community'));
app.use('/admin', createPlaceholderRouter('admin'));

app.get('/healthcheck', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
