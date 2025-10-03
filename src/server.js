import express from 'express';

const app = express();

app.use(express.json());

const validateNumericFields = (req, res, next) => {
  const requiredFields = ['income', 'fixed', 'variable'];
  const parsedValues = {};

  for (const field of requiredFields) {
    if (!(field in req.body)) {
      return res.status(400).json({
        error: `Campo '${field}' é obrigatório e deve ser numérico.`
      });
    }

    const rawValue = req.body[field];
    let value;

    if (typeof rawValue === 'number') {
      value = rawValue;
    } else if (typeof rawValue === 'string') {
      const trimmed = rawValue.trim();
      value = trimmed === '' ? NaN : Number(trimmed);
    } else {
      value = NaN;
    }

    if (!Number.isFinite(value)) {
      return res.status(400).json({
        error: `Campo '${field}' é obrigatório e deve ser numérico.`
      });
    }

    parsedValues[field] = value;
  }

  req.financeInputs = parsedValues;
  return next();
};

app.post('/finance/simulator', validateNumericFields, (req, res) => {
  const { income, fixed, variable } = req.financeInputs;

  const totalExpenses = fixed + variable;
  const saldo = income - totalExpenses;

  const distribuicao = {
    necessidades: income * 0.5,
    desejos: income * 0.3,
    investimentos: income * 0.2
  };

  return res.json({
    income,
    fixed,
    variable,
    saldo,
    distribuicao
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor MedFinance iniciado na porta ${PORT}`);
});

export default app;
