const request = require('supertest');
const app = require('../../src/app');
const { findUserByEmail } = require('../../src/db');

jest.mock('../../src/services/auth0', () => ({
  authenticate: jest.fn(),
}));

const auth0Client = require('../../src/services/auth0');

describe('Auth integration flow', () => {
  beforeEach(() => {
    auth0Client.authenticate.mockReset();
  });

  it('registers a user and persists to the database', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'medic@example.com',
        password: 'safePass123',
        name: 'Dr. Finance',
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({
      email: 'medic@example.com',
      name: 'Dr. Finance',
    });

    const storedUser = await findUserByEmail('medic@example.com');
    expect(storedUser).toBeDefined();
    expect(storedUser.email).toBe('medic@example.com');
  });

  it('logs in a user through mocked Auth0 and returns JWT token', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        email: 'login@example.com',
        password: 'loginPass',
        name: 'Login User',
      });

    auth0Client.authenticate.mockResolvedValue({
      accessToken: 'auth0-token',
      idToken: 'auth0-id',
      user: {
        email: 'login@example.com',
      },
    });

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@example.com',
        password: 'loginPass',
      });

    expect(response.status).toBe(200);
    expect(auth0Client.authenticate).toHaveBeenCalledWith('login@example.com', 'loginPass');
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toMatchObject({
      email: 'login@example.com',
      name: 'Login User',
    });
  });

  it('fetches the correct user by email', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        email: 'lookup@example.com',
        password: 'lookupPass',
        name: 'Lookup User',
      });

    const response = await request(app).get('/auth/lookup@example.com');

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({
      email: 'lookup@example.com',
      name: 'Lookup User',
    });
  });
});
