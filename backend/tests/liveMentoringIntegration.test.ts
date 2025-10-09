import request from 'supertest';
import { createApp } from '../src/app';
import { liveMentoringIntegrationService } from '../src/services/liveMentoringIntegrationService';

const app = createApp();

describe('Live mentoring integration API', () => {
  beforeEach(() => {
    liveMentoringIntegrationService.clearRegistrations();
  });

  it('exposes integration metadata and available sessions', async () => {
    const response = await request(app).get('/integrations/live-mentoring');

    expect(response.status).toBe(200);
    expect(response.body.integration).toEqual(
      expect.objectContaining({
        provider: 'MedFinance Mentoria Ao Vivo',
        documentationUrl: 'https://docs.medfinance.com/integrations/live-mentoring',
        supportEmail: 'mentorias@medfinance.com',
      }),
    );

    expect(Array.isArray(response.body.sessions)).toBe(true);
    expect(response.body.sessions[0]).toEqual(
      expect.objectContaining({
        id: 'sess-001',
        availableSpots: expect.any(Number),
      }),
    );
  });

  it('validates participant payload', async () => {
    const response = await request(app)
      .post('/integrations/live-mentoring/sessions/sess-001/register')
      .send({ name: '', email: 'invalid-email' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'The "name" field is required.' });
  });

  it('rejects invalid email address', async () => {
    const response = await request(app)
      .post('/integrations/live-mentoring/sessions/sess-001/register')
      .send({ name: 'Dra. Júlia', email: 'invalid-email' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Please provide a valid email address.' });
  });

  it('returns not found when session does not exist', async () => {
    const response = await request(app)
      .post('/integrations/live-mentoring/sessions/unknown/register')
      .send({ name: 'Dr. Pedro', email: 'pedro@example.com' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Live mentoring session not found.' });
  });

  it('registers participants and exposes join information', async () => {
    const response = await request(app)
      .post('/integrations/live-mentoring/sessions/sess-001/register')
      .send({ name: 'Dra. Fernanda', email: 'fernanda@example.com', professionalId: 'CRM-1234' });

    expect(response.status).toBe(201);
    expect(response.body.registration).toEqual(
      expect.objectContaining({
        sessionId: 'sess-001',
        participantName: 'Dra. Fernanda',
        participantEmail: 'fernanda@example.com',
        professionalId: 'CRM-1234',
        joinUrl: 'https://meet.medfinance.com/live/sess-001',
        mentor: 'Dra. Ana Souza',
      }),
    );

    const overviewResponse = await request(app).get('/integrations/live-mentoring');
    const updatedSession = overviewResponse.body.sessions.find((session: { id: string }) => session.id === 'sess-001');

    expect(updatedSession.availableSpots).toBeLessThan(updatedSession.capacity);
  });

  it('prevents duplicate registrations for the same session', async () => {
    await request(app)
      .post('/integrations/live-mentoring/sessions/sess-001/register')
      .send({ name: 'Dr. Rafael', email: 'rafael@example.com' });

    const response = await request(app)
      .post('/integrations/live-mentoring/sessions/sess-001/register')
      .send({ name: 'Dr. Rafael', email: 'rafael@example.com' });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'Participant already registered for this session.' });
  });

  it('blocks registrations when the session capacity is reached', async () => {
    liveMentoringIntegrationService.clearRegistrations();

    const overview = liveMentoringIntegrationService.getOverview();
    const session = overview.sessions.find((item: { id: string }) => item.id === 'sess-003');

    if (!session) {
      throw new Error('Fixture session sess-003 not found');
    }

    for (let i = 0; i < session.capacity; i += 1) {
      liveMentoringIntegrationService.registerParticipant({
        sessionId: 'sess-003',
        participantName: `Profissional ${i + 1}`,
        participantEmail: `prof${i + 1}@example.com`,
      });
    }

    const response = await request(app)
      .post('/integrations/live-mentoring/sessions/sess-003/register')
      .send({ name: 'Profissional Extra', email: 'overflow@example.com' });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'The selected session has no available spots.' });
  });
});
