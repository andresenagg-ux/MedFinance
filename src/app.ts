import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import courseRoutes from './routes/courseRoutes';
import moduleRoutes from './routes/moduleRoutes';
import lessonRoutes from './routes/lessonRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/courses', courseRoutes);
app.use('/modules', moduleRoutes);
app.use('/lessons', lessonRoutes);

export default app;
