import { Router } from 'express';
import { getCdiQuote, getRealtimeCdiQuote } from '../controllers/investmentController';

export const router = Router();

router.get('/cdi', getCdiQuote);
router.get('/cdi/realtime', getRealtimeCdiQuote);
