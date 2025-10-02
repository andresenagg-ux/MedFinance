import express from 'express';
import cors from 'cors';
import { markLessonCompletion, getProgressByUser, getCoursesWithLessons } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/courses', async (_req, res) => {
  try {
    const courses = await getCoursesWithLessons();
    res.json(courses);
  } catch (error) {
    console.error('Failed to fetch courses', error);
    res.status(500).json({ message: 'Erro ao carregar cursos.' });
  }
});

app.post('/progress', async (req, res) => {
  const { userId, lessonId, completed = true } = req.body || {};

  if (typeof userId !== 'number' || typeof lessonId !== 'number') {
    return res.status(400).json({ message: 'userId e lessonId devem ser numéricos.' });
  }

  try {
    await markLessonCompletion({ userId, lessonId, completed: Boolean(completed) });
    const progress = await getProgressByUser(userId);
    res.status(201).json({ message: 'Progresso atualizado com sucesso.', progress });
  } catch (error) {
    console.error('Failed to update progress', error);
    res.status(500).json({ message: 'Erro ao atualizar progresso.' });
  }
});

app.get('/progress/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: 'userId inválido.' });
  }

  try {
    const progress = await getProgressByUser(userId);
    res.json(progress);
  } catch (error) {
    console.error('Failed to load progress', error);
    res.status(500).json({ message: 'Erro ao carregar progresso.' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`MedFinance API disponível na porta ${port}`);
});
