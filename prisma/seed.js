const { PrismaClient, UserRole } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.lessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const [student, recentGrad, specialist] = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: 'Laura Castro',
        email: 'laura.castros@example.com',
        role: UserRole.STUDENT,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Pedro Nogueira',
        email: 'pedro.nogueira@example.com',
        role: UserRole.RECENT_GRAD,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dra. Fernanda Teixeira',
        email: 'fernanda.teixeira@example.com',
        role: UserRole.SPECIALIST,
      },
    }),
  ]);

  const course = await prisma.course.create({
    data: {
      title: 'Fundamentos Financeiros para Médicos',
      description:
        'Curso introdutório cobrindo desde o controle financeiro pessoal até estratégias de investimento para profissionais de saúde.',
      modules: {
        create: [
          {
            title: 'Organização Financeira Pessoal',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Mapeando receitas e despesas',
                  description: 'Aprenda a diagnosticar o fluxo de caixa pessoal para tomar melhores decisões.',
                  order: 1,
                },
                {
                  title: 'Construindo um orçamento inteligente',
                  description: 'Ferramentas e práticas para planejar gastos e definir prioridades.',
                  order: 2,
                },
                {
                  title: 'Reservas de emergência para médicos',
                  description: 'Como dimensionar e manter um fundo de segurança adequado à realidade médica.',
                  order: 3,
                },
              ],
            },
          },
          {
            title: 'Planejamento de Carreira e Investimentos',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'Estratégias para recém-formados',
                  description: 'Organize dívidas estudantis e primeiros investimentos.',
                  order: 1,
                },
                {
                  title: 'Investimentos de médio e longo prazo',
                  description: 'Entenda os principais produtos financeiros para acumular patrimônio.',
                  order: 2,
                },
                {
                  title: 'Proteção patrimonial e seguros',
                  description: 'A importância de seguros e previdência privada para especialistas.',
                  order: 3,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  });

  const studentLessons = course.modules
    .flatMap((module) => module.lessons)
    .sort((a, b) => a.order - b.order);

  await prisma.lessonProgress.createMany({
    data: [
      {
        userId: student.id,
        lessonId: studentLessons[0].id,
        completed: true,
        completedAt: new Date(),
      },
      {
        userId: student.id,
        lessonId: studentLessons[1].id,
        completed: true,
        completedAt: new Date(),
      },
      {
        userId: student.id,
        lessonId: studentLessons[3].id,
        completed: false,
      },
    ],
  });

  console.log('Seed executada com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
