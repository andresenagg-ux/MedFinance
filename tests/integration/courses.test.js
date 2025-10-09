const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/services/auth0', () => ({
  authenticate: jest.fn(),
}));

const auth0Client = require('../../src/services/auth0');

describe('Protected courses route', () => {
  beforeEach(() => {
    auth0Client.authenticate.mockReset();
  });

  async function registerAndLogin() {
    await request(app)
      .post('/auth/register')
      .send({
        email: 'course@example.com',
        password: 'coursePass',
        name: 'Course User',
      });

    auth0Client.authenticate.mockResolvedValue({
      accessToken: 'auth0-token',
      idToken: 'auth0-id',
      user: { email: 'course@example.com' },
    });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'course@example.com',
        password: 'coursePass',
      });

    return loginResponse.body.token;
  }

  it('allows access with a valid JWT token', async () => {
    const token = await registerAndLogin();

    const response = await request(app)
      .get('/courses')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.courses).toBeInstanceOf(Array);
    expect(response.body.courses).toHaveLength(2);
  });

  it('denies access without a token', async () => {
    const response = await request(app).get('/courses');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Unauthorized' });
  });

  it('denies access with an invalid token', async () => {
    const response = await request(app)
      .get('/courses')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Unauthorized' });
  });
});
