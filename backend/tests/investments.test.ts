import request from 'supertest';
import { createApp } from '../src/app';
import { cdiService } from '../src/services/cdiService';

jest.mock('../src/services/cdiService', () => ({
  cdiService: {
    getLatestRate: jest.fn(),
  },
}));

const app = createApp();
const mockGetLatestRate = jest.mocked(cdiService.getLatestRate);

describe('GET /investments/cdi', () => {
  beforeEach(() => {
    mockGetLatestRate.mockReset();
  });

  it('returns the latest CDI quote without investment projection when no amount is provided', async () => {
    mockGetLatestRate.mockResolvedValue({ date: '2024-07-01', rate: 13.65 });

    const response = await request(app).get('/investments/cdi');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      date: '2024-07-01',
      annualRate: 13.65,
    });
    expect(mockGetLatestRate).toHaveBeenCalledTimes(1);
  });

  it('returns an investment projection when a valid amount is provided', async () => {
    mockGetLatestRate.mockResolvedValue({ date: '2024-07-15', rate: 10 });

    const response = await request(app).get('/investments/cdi').query({ amount: '5000' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      date: '2024-07-15',
      annualRate: 10,
      investmentProjection: {
        principal: 5000,
        profitAfterOneYear: 500,
        finalAmountAfterOneYear: 5500,
      },
    });
    expect(mockGetLatestRate).toHaveBeenCalledTimes(1);
  });

  it('validates that the amount must be a positive number', async () => {
    const response = await request(app).get('/investments/cdi').query({ amount: '-100' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'The "amount" query parameter must be a positive number.',
    });
    expect(mockGetLatestRate).not.toHaveBeenCalled();
  });

  it('returns a 502 error when the CDI service is unavailable', async () => {
    mockGetLatestRate.mockRejectedValue(new Error('network error'));

    const response = await request(app).get('/investments/cdi');

    expect(response.status).toBe(502);
    expect(response.body).toEqual({
      message: 'Unable to retrieve CDI rate from Banco Central do Brasil.',
    });
    expect(mockGetLatestRate).toHaveBeenCalledTimes(1);
  });
});
