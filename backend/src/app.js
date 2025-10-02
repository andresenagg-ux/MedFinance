import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import coursesRouter from './routes/courses.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/courses', coursesRouter);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor', detail: err.message });
});

export default app;
