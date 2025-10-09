import cors, { CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { logger } from './config/logger';
import { swaggerDocument } from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import { requestLogger } from './middlewares/requestLogger';
import { router as userRouter } from './routes/users';
import { router as investmentRouter } from './routes/investments';
import { router as videoRouter } from './routes/videos';
import { handleFinancialSimulation, router as financeRouter } from './routes/finance';
import { router as integrationRouter } from './routes/integrations';

export function createApp() {
  const app = express();

  const allowedOrigins = env.CORS_ALLOWED_ORIGINS;

  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const shouldAllowAllOrigins = allowedOrigins.includes('*');

      if (shouldAllowAllOrigins || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      logger.warn('Blocked request from disallowed origin', { origin });

      return callback(null, false);
    },
    optionsSuccessStatus: 204,
  };

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(requestLogger);

  const swaggerUiMiddleware = swaggerUi.serve as unknown as express.RequestHandler[];
  const swaggerUiHandler = swaggerUi.setup(swaggerDocument, { explorer: true }) as unknown as express.RequestHandler;

  app.use('/docs', ...swaggerUiMiddleware);
  app.get('/docs', swaggerUiHandler);
  app.get('/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });

  app.get('/healthcheck', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/users', userRouter);
  app.use('/investments', investmentRouter);
  app.use('/videos', videoRouter);
  app.use('/finance', financeRouter);
  app.use('/integrations', integrationRouter);
  app.post('/api/simulator', handleFinancialSimulation);

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
