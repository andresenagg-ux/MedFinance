import express from 'express';
import cors from 'cors';
import { PrismaClient, Profile } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 3333;

const allowedProfiles: Record<string, Profile> = {
  student: Profile.STUDENT,
  'recem-formado': Profile.RECENT_GRAD,
  'recent-graduate': Profile.RECENT_GRAD,
  especialista: Profile.SPECIALIST,
  specialist: Profile.SPECIALIST,
};

app.post('/users/profile', async (req, res) => {
  const { userId, profile } = req.body ?? {};

  if (typeof userId !== 'string' || userId.trim().length === 0) {
    return res.status(400).json({ message: 'userId obrigatório.' });
  }

  if (typeof profile !== 'string') {
    return res.status(400).json({ message: 'profile deve ser uma string.' });
  }

  const normalizedProfileKey = profile.trim().toLowerCase();
  const normalizedProfile = allowedProfiles[normalizedProfileKey];

  if (!normalizedProfile) {
    return res.status(400).json({
      message: 'Perfil inválido. Use student, recem-formado ou specialist.',
    });
  }

  try {
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { profile: normalizedProfile },
      create: { id: userId, profile: normalizedProfile },
    });

    return res.json({ userId: user.id, profile: user.profile });
  } catch (error) {
    console.error('Erro ao salvar perfil do usuário', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

app.get('/users/profile/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'userId é obrigatório.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user?.profile) {
      return res.status(404).json({ message: 'Perfil não encontrado.' });
    }

    return res.json({ userId: user.id, profile: user.profile });
  } catch (error) {
    console.error('Erro ao consultar perfil do usuário', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 API pronta na porta ${PORT}`);
});
