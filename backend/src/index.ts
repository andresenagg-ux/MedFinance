import { createServer } from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';

const app = createApp();
const server = createServer(app);

server.listen(env.PORT, () => {
  logger.info('API server started', {
    url: `http://localhost:${env.PORT}`,
    environment: env.NODE_ENV,
  });
});
