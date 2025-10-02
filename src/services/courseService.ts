import { prisma } from '../utils/prisma';

export interface CreateCourseInput {
  title: string;
  description?: string;
}

export async function createCourse(data: CreateCourseInput) {
  return prisma.course.create({
    data: {
      title: data.title,
      description: data.description ?? null,
    },
  });
}

export async function getCourseWithStructure(courseId: string) {
  return prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });
}
