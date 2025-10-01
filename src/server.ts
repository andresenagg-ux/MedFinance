import express from 'express';
import UserController from './controllers/UserController';

const app = express();

app.use(express.json());
app.use(UserController);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
