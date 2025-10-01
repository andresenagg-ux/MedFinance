import request from 'supertest';
import { createApp } from '../src/app';

describe('MedFinance API', () => {
  const app = createApp();

  it('returns ok on /healthcheck', async () => {
    const response = await request(app).get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
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
});
