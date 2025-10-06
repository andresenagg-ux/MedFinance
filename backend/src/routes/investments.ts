import { Router } from 'express';
import { getCdiQuote } from '../controllers/investmentController';

export const router = Router();

router.get('/cdi', getCdiQuote);
