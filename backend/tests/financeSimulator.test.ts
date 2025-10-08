import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Finance simulator API', () => {
  it('rejects payloads without monthly income', async () => {
    const response = await request(app).post('/finance/simulator').send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'The "monthlyIncome" field is required.' });
  });

  it('validates non-negative numeric fields', async () => {
    const response = await request(app).post('/finance/simulator').send({
      monthlyIncome: 12000,
      monthlyExpenses: -10,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'The "monthlyExpenses" field must be a non-negative number.',
    });
  });

  it('calculates distribution, savings and investment return using fixed and variable expenses', async () => {
    const payload = {
      monthlyIncome: 18000,
      fixedExpenses: 7000,
      variableExpenses: 2500,
      investmentRate: 0.12,
    };

    const response = await request(app).post('/finance/simulator').send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      finalBalance: 8500,
      monthlySavings: 8500,
      annualSavings: 102000,
      investmentReturn: 12240,
      distribution: {
        needs: 9000,
        wants: 5400,
        savings: 3600,
      },
    });
  });

  it('accepts consolidated monthly expenses and exposes the alias route', async () => {
    const payload = {
      monthlyIncome: 25000,
      monthlyExpenses: 16350,
      investmentRate: 0.08,
    };

    const response = await request(app).post('/api/simulator').send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      finalBalance: 8650,
      monthlySavings: 8650,
      annualSavings: 103800,
      investmentReturn: 8304,
      distribution: {
        needs: 12500,
        wants: 7500,
        savings: 5000,
      },
    });
  });
});
