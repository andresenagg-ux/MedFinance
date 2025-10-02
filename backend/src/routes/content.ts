import { Router } from 'express';
import { listContent } from '../controllers/contentController';

export const router = Router();

router.get('/', listContent);
