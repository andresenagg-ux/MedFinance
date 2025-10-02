import { Request, Response } from 'express';
import { contentService } from '../services/contentService';
import { UserRole } from '../services/userService';

const validProfiles: UserRole[] = ['admin', 'student'];

type ListContentQuery = {
  profile?: UserRole;
};

export function listContent(req: Request<unknown, unknown, unknown, ListContentQuery>, res: Response) {
  const { profile } = req.query;

  if (profile && !validProfiles.includes(profile)) {
    return res.status(400).json({ message: `Invalid profile: ${profile}` });
  }

  const items = contentService.list(profile);

  return res.json({ items });
}
