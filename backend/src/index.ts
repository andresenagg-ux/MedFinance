import { createServer } from 'http';
import { createApp } from './app';
import { env } from './config/env';

const app = createApp();
const server = createServer(app);

server.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 API running on http://localhost:${env.PORT}`);
});
