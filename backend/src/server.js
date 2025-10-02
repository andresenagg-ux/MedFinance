import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const contentByProfile = {
  estudante: [
    {
      id: 'budgeting-basics',
      title: 'Orçamento Pessoal para Estudantes de Medicina',
      description: 'Aprenda a controlar despesas durante a graduação usando ferramentas simples.',
      duration: '2h'
    },
    {
      id: 'intro-investments',
      title: 'Introdução a Investimentos de Baixo Risco',
      description: 'Conceitos essenciais para iniciar uma carteira de investimentos ainda na faculdade.',
      duration: '3h'
    }
  ],
  'recem-formado': [
    {
      id: 'first-job-finances',
      title: 'Finanças do Primeiro Emprego',
      description: 'Planejamento financeiro para transição da residência para o mercado.',
      duration: '2h30'
    }
  ],
  especialista: [
    {
      id: 'advanced-investments',
      title: 'Investimentos Avançados para Especialistas',
      description: 'Estratégias de diversificação e aposentadoria para médicos especialistas.',
      duration: '4h'
    }
  ]
};

function normalizeProfile(profileParam) {
  if (!profileParam) return '';

  const normalized = profileParam
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/[^a-z-]/g, '-');

  return normalized;
}

app.get('/contents/:profile', (req, res) => {
  const normalizedProfile = normalizeProfile(req.params.profile);
  const courses = contentByProfile[normalizedProfile];

  if (!courses) {
    return res.status(404).json({
      message: 'Perfil não encontrado.',
      availableProfiles: Object.keys(contentByProfile)
    });
  }

  return res.json({
    profile: normalizedProfile,
    courses
  });
});

app.get('/', (_req, res) => {
  res.json({
    message: 'MedFinance API',
    endpoints: ['/contents/:profile']
  });
});

app.listen(PORT, () => {
  console.log(`MedFinance API is running on port ${PORT}`);
});

export default app;
