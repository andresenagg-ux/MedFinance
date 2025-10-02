import { Router } from 'express';
import { handleCreateLesson } from '../controllers/lessonController';

const router = Router();

router.post('/', handleCreateLesson);

export default router;
