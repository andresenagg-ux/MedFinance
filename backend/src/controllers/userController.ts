import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { userService } from '../services/userService';

export async function listUsers(_req: Request, res: Response) {
  try {
    const result = await userService.list();
    logger.debug('Listing users', { total: result.length });
    res.json({ users: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while fetching users';
    logger.error('Failed to list users', { message });
    res.status(500).json({ message: 'Unable to load users at the moment.' });
  }
}
