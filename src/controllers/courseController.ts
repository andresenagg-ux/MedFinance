import { Request, Response } from 'express';
import { createCourse, getCourseWithStructure } from '../services/courseService';

export async function handleCreateCourse(req: Request, res: Response) {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'title is required' });
    }

    const course = await createCourse({ title, description });
    return res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function handleGetCourse(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'course id is required' });
    }

    const course = await getCourseWithStructure(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.json(course);
  } catch (error) {
    console.error('Error fetching course', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
