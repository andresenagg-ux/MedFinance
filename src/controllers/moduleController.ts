import { Request, Response } from 'express';
import { createModule } from '../services/moduleService';

export async function handleCreateModule(req: Request, res: Response) {
  try {
    const { courseId, title, order } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ message: 'courseId and title are required' });
    }

    const module = await createModule({ courseId, title, order });
    return res.status(201).json(module);
  } catch (error) {
    console.error('Error creating module', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
