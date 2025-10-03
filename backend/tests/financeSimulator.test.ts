import request from 'supertest';
import { createApp } from '../src/app';

describe('Finance simulator endpoint', () => {
  const app = createApp();

  it('returns an amortization schedule for valid input', async () => {
    const response = await request(app).post('/finance/simulator').send({
      loanAmount: 100000,
      annualInterestRate: 6,
      loanTermMonths: 360,
      extraPayment: 100,
    });

    expect(response.status).toBe(200);
    expect(response.body.monthlyPayment).toBeCloseTo(599.55, 2);
    expect(response.body.totalInterestPaid).toBeCloseTo(75937.97, 2);
    expect(response.body.totalAmountPaid).toBeCloseTo(175937.97, 2);
    expect(response.body.payoffMonths).toBe(252);

    const firstInstallment = response.body.schedule[0];
    expect(firstInstallment.month).toBe(1);
    expect(firstInstallment.payment).toBeCloseTo(699.55, 2);
    expect(firstInstallment.principal).toBeCloseTo(199.55, 2);
    expect(firstInstallment.interest).toBeCloseTo(500, 2);
    expect(firstInstallment.remainingBalance).toBeCloseTo(99800.45, 2);
  });

  it('returns 400 when payload is invalid', async () => {
    const response = await request(app).post('/finance/simulator').send({
      loanAmount: -1000,
      annualInterestRate: 'five',
      loanTermMonths: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Invalid request data',
        errors: expect.arrayContaining([
          'loanAmount must be a positive number',
          'annualInterestRate must be a non-negative number',
          'loanTermMonths must be a positive number',
        ]),
      }),
    );
  });
});
