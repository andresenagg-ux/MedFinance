import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { env } from './config/env';
import { router as financeRouter } from './routes/finance';
import { router as userRouter } from './routes/users';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan(env.LOG_LEVEL === 'debug' ? 'dev' : 'tiny'));

  app.get('/healthcheck', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/users', userRouter);
  app.use('/finance', financeRouter);

  app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
  });

  return app;
}

export type AppInstance = ReturnType<typeof createApp>;
