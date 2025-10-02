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

  it('returns learning content filtered by profile', async () => {
    const response = await request(app).get('/content').query({ profile: 'student' });

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: expect.any(String), title: expect.any(String), description: expect.any(String) }),
      ]),
    );
    expect(response.body.items).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'clinic-cashflow' }),
      ]),
    );
  });

  it('validates unknown profiles on content route', async () => {
    const response = await request(app).get('/content').query({ profile: 'guest' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid profile: guest' });
  });
});
