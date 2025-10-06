import type { NextFunction, Request, Response } from 'express';
import { userService } from '../services/userService';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = req.header('x-user-id');

  if (!userId) {
    res.status(401).json({ message: 'The "x-user-id" header is required to authenticate the request.' });
    return;
  }

  const user = userService.findById(userId);

  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }

  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Video upload is restricted to administrator profiles.' });
    return;
  }

  res.locals.authenticatedUser = user;
  next();
}
