import { Router } from 'express';
import { listUsers } from '../controllers/userController';

export const router = Router();

router.get('/', listUsers);
