const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    name: 'MedFinance API',
    documentation: '/docs',
  });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`MedFinance API running on port ${PORT}`);
});

module.exports = app;
