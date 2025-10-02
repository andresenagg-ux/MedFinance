import { Router } from 'express';
import { handleCreateCourse, handleGetCourse } from '../controllers/courseController';

const router = Router();

router.get('/:id', handleGetCourse);
router.post('/', handleCreateCourse);

export default router;
