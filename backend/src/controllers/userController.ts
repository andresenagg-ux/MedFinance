import { Request, Response } from 'express';
import { userService } from '../services/userService';

export function listUsers(_req: Request, res: Response) {
  const result = userService.list();
  res.json({ users: result });
}
