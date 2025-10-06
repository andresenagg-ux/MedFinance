import { Router } from 'express';
import { requireAdmin } from '../middlewares/requireAdmin';
import type { User } from '../services/userService';
import { videoService } from '../services/videoService';

export const router = Router();

router.get('/', (_req, res) => {
  const videos = videoService.list();

  res.json({ videos });
});

router.post('/upload', requireAdmin, (req, res) => {
  const { title, description, url } = req.body ?? {};

  if (typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ message: 'The "title" field is required.' });
    return;
  }

  if (typeof url !== 'string' || url.trim() === '') {
    res.status(400).json({ message: 'The "url" field is required.' });
    return;
  }

  const authenticatedUser = res.locals.authenticatedUser as User;

  const video = videoService.create({
    title: title.trim(),
    description: typeof description === 'string' && description.trim() !== '' ? description.trim() : undefined,
    url: url.trim(),
    uploadedBy: authenticatedUser.id,
  });

  res.status(201).json({ video });
});
