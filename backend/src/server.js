import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = process.env.APP_PORT || 3001;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor iniciado na porta ${port}`);
});
