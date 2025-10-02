import { prisma } from '../utils/prisma';

export interface CreateModuleInput {
  courseId: string;
  title: string;
  order?: number;
}

export async function createModule(data: CreateModuleInput) {
  const nextOrder = await resolveModuleOrder(data.courseId, data.order);

  return prisma.module.create({
    data: {
      title: data.title,
      courseId: data.courseId,
      order: nextOrder,
    },
  });
}

async function resolveModuleOrder(courseId: string, requestedOrder?: number) {
  if (typeof requestedOrder === 'number') {
    return requestedOrder;
  }

  const lastModule = await prisma.module.findFirst({
    where: { courseId },
    orderBy: { order: 'desc' },
  });

  return lastModule ? lastModule.order + 1 : 1;
}
