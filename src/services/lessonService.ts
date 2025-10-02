import { prisma } from '../utils/prisma';

export interface CreateLessonInput {
  moduleId: string;
  title: string;
  videoUrl: string;
  duration: number;
  order?: number;
}

export async function createLesson(data: CreateLessonInput) {
  const nextOrder = await resolveLessonOrder(data.moduleId, data.order);

  return prisma.lesson.create({
    data: {
      title: data.title,
      moduleId: data.moduleId,
      videoUrl: data.videoUrl,
      duration: data.duration,
      order: nextOrder,
    },
  });
}

async function resolveLessonOrder(moduleId: string, requestedOrder?: number) {
  if (typeof requestedOrder === 'number') {
    return requestedOrder;
  }

  const lastLesson = await prisma.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: 'desc' },
  });

  return lastLesson ? lastLesson.order + 1 : 1;
}
