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
      }),
    });
  });
});
