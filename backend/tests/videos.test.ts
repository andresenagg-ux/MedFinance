import request from 'supertest';
import { createApp } from '../src/app';
import { videoService } from '../src/services/videoService';
import { userService } from '../src/services/userService';

const app = createApp();
const [adminUser, studentUser] = userService.list();

describe('Video upload access control', () => {
  beforeEach(() => {
    videoService.clear();
  });

  it('rejects uploads without authentication header', async () => {
    const response = await request(app).post('/videos/upload').send({
      title: 'Educação Financeira',
      url: 'https://cdn.medfinance.com/videos/educacao-financeira.mp4',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'The "x-user-id" header is required to authenticate the request.',
    });
  });

  it('rejects uploads for unknown users', async () => {
    const response = await request(app)
      .post('/videos/upload')
      .set('x-user-id', '999')
      .send({
        title: 'Educação Financeira',
        url: 'https://cdn.medfinance.com/videos/educacao-financeira.mp4',
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'User not found.' });
  });

  it('blocks students from uploading videos', async () => {
    const response = await request(app)
      .post('/videos/upload')
      .set('x-user-id', studentUser.id)
      .send({
        title: 'Planejamento tributário',
        url: 'https://cdn.medfinance.com/videos/planejamento-tributario.mp4',
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Video upload is restricted to administrator profiles.' });
  });

  it('validates required payload fields', async () => {
    const response = await request(app)
      .post('/videos/upload')
      .set('x-user-id', adminUser.id)
      .send({ description: 'Material sem título ou URL' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'The "title" field is required.' });
  });

  it('allows administrators to upload videos and list them', async () => {
    const payload = {
      title: 'Gestão de clínicas de alta performance',
      description: 'Estratégias para estruturar processos financeiros e operacionais.',
      url: 'https://cdn.medfinance.com/videos/gestao-clinicas.mp4',
    };

    const uploadResponse = await request(app)
      .post('/videos/upload')
      .set('x-user-id', adminUser.id)
      .send(payload);

    expect(uploadResponse.status).toBe(201);
    expect(uploadResponse.body.video).toEqual(
      expect.objectContaining({
        title: payload.title,
        description: payload.description,
        url: payload.url,
        uploadedBy: adminUser.id,
      })
    );

    const listResponse = await request(app).get('/videos');

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.videos[0]).toMatchObject({
      title: payload.title,
      description: payload.description,
      url: payload.url,
      uploadedBy: adminUser.id,
    });
  });
});
