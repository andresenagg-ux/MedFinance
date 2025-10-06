import request from 'supertest';
import { createApp } from '../src/app';
import { cdiService } from '../src/services/cdiService';

jest.mock('../src/services/cdiService', () => ({
  cdiService: {
    getLatestRate: jest.fn(),
  },
}));

describe('MedFinance API', () => {
  const app = createApp();
  const mockedCdiService = cdiService as jest.Mocked<typeof cdiService>;

  beforeEach(() => {
    mockedCdiService.getLatestRate.mockReset();
  });

  it('returns ok on /healthcheck', async () => {
    const response = await request(app).get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('applies security headers using helmet', async () => {
    const response = await request(app).get('/healthcheck');

    expect(response.headers['x-dns-prefetch-control']).toBe('off');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('allows requests from configured origins using CORS', async () => {
    const response = await request(app).get('/healthcheck').set('Origin', 'http://localhost:3000');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  it('blocks requests from origins not in the allowed list', async () => {
    const response = await request(app).get('/healthcheck').set('Origin', 'https://malicious.example.com');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('lists demo users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: expect.any(String), email: expect.any(String) }),
      ]),
    );
  });

  it('exposes the OpenAPI documentation', async () => {
    const response = await request(app).get('/docs.json');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toMatchObject({
      openapi: '3.1.0',
      info: expect.objectContaining({ title: 'MedFinance API' }),
      paths: expect.objectContaining({
        '/users': expect.any(Object),
        '/healthcheck': expect.any(Object),
        '/investments/cdi': expect.any(Object),
        '/videos': expect.any(Object),
        '/videos/upload': expect.any(Object),
      }),
    });
  });

  it('provides the latest CDI rate and investment projection', async () => {
    mockedCdiService.getLatestRate.mockResolvedValue({ date: '2025-10-03', rate: 13.65 });

    const response = await request(app).get('/investments/cdi').query({ amount: 10000 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      date: '2025-10-03',
      annualRate: 13.65,
      investmentProjection: {
        principal: 10000,
        profitAfterOneYear: 1365,
        finalAmountAfterOneYear: 11365,
      },
    });
    expect(mockedCdiService.getLatestRate).toHaveBeenCalledTimes(1);
  });

  it('validates the investment amount parameter', async () => {
    const response = await request(app).get('/investments/cdi').query({ amount: '-50' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'The "amount" query parameter must be a positive number.',
    });
    expect(mockedCdiService.getLatestRate).not.toHaveBeenCalled();
  });
});
