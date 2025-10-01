const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: 'Finanças Médicas API' });
});
app.listen(port, () => {
  process.stdout.write(`Servidor rodando na porta ${port}`);
});
