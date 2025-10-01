import express from 'express';
import { UserService } from './services/UserService';

const app = express();
app.use(express.json());

app.get('/healthcheck', (_req, res) => {
  res.json({ status: 'ok' });
});

// Example of wiring the service in the future
const userService = new UserService({
  async findById() {
    return null;
  },
  async list() {
    return [];
  }
});

app.set('userService', userService);

export { app };
