# MedFinance

Ferramenta educacional para apoiar profissionais médicos em suas decisões
financeiras. Este repositório inclui um simulador que permite projetar renda,
despesas, reserva de emergência, evolução de investimentos e endividamento ao
longo dos anos.

## Simulador financeiro

O módulo `simulador_financeiro.py` oferece uma API em Python e um utilitário de
linha de comando. Ele pode ser usado com um cenário padrão ou com um arquivo
JSON que descreve fontes de renda, despesas e configuração de investimentos.

### Executando o cenário padrão

```bash
python simulador_financeiro.py --years 10 --show-yearly
```

### Utilizando um arquivo de configuração

Crie um arquivo `plano.json` seguindo o formato abaixo e forneça-o via `--config`:

```json
{
  "incomes": [
    {"name": "Consultas", "monthly_amount": 18000, "annual_growth": 0.04},
    {"name": "Procedimentos", "monthly_amount": 6000, "annual_growth": 0.05}
  ],
  "expenses": [
    {"name": "Estrutura", "monthly_amount": 9000, "annual_growth": 0.03},
    {"name": "Equipe", "monthly_amount": 4500, "annual_growth": 0.04},
    {"name": "Estudos", "monthly_amount": 1600, "annual_growth": 0.02}
  ],
  "investment_plan": {
    "name": "Renda fixa",
    "monthly_contribution": 5000,
    "expected_return": 0.07,
    "initial_balance": 30000
  },
  "emergency_reserve_months": 6,
  "debt_interest": 0.15,
  "initial_debt": 10000
}
```

Em seguida execute:

```bash
python simulador_financeiro.py --config plano.json --years 8 --show-yearly
```

O simulador imprimirá um resumo consolidado e, opcionalmente, a evolução anual
dos principais indicadores.

## Testes

Os testes automatizados utilizam a biblioteca padrão `unittest`.

```bash
python -m unittest discover -s tests
```
