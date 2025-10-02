import { Router } from 'express';
import { handleCreateModule } from '../controllers/moduleController';

const router = Router();

router.post('/', handleCreateModule);

export default router;
