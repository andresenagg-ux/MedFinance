import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { userService } from '../services/userService';

export function listUsers(_req: Request, res: Response) {
  const result = userService.list();
  logger.debug('Listing users', { total: result.length });
  res.json({ users: result });
}
