import request from 'supertest';
import { app } from '../src/app';

describe('GET /healthcheck', () => {
  it('returns ok status for readiness probe', async () => {
    const response = await request(app).get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
