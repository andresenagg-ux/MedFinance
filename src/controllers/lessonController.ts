import { Request, Response } from 'express';
import { createLesson } from '../services/lessonService';

export async function handleCreateLesson(req: Request, res: Response) {
  try {
    const { moduleId, title, videoUrl, duration, order } = req.body;

    if (!moduleId || !title || !videoUrl || typeof duration !== 'number') {
      return res.status(400).json({ message: 'moduleId, title, videoUrl and duration are required' });
    }

    const lesson = await createLesson({ moduleId, title, videoUrl, duration, order });
    return res.status(201).json(lesson);
  } catch (error) {
    console.error('Error creating lesson', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
