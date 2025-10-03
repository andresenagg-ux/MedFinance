import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { logger } from './config/logger';
import { requestLogger } from './middlewares/requestLogger';
import { router as userRouter } from './routes/users';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/healthcheck', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/users', userRouter);

  app.use((req, res) => {
    const message = `Route ${req.method} ${req.path} not found`;
    logger.warn(message, { method: req.method, path: req.path });
    res.status(404).json({ message });
  });

  app.use((error: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('Unhandled error while processing request', {
      method: req.method,
      path: req.path,
      error: {
        name: error.name,
        message: error.message,
        stack: env.NODE_ENV !== 'production' ? error.stack : undefined,
      },
    });

    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}

export type AppInstance = ReturnType<typeof createApp>;
