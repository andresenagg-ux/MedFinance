import { UserRole } from './userService';

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  profiles: UserRole[];
};

const contentLibrary: ContentItem[] = [
  {
    id: 'budget-roadmap',
    title: 'Roteiro de orçamento pessoal',
    description:
      'Passo a passo para organizar receitas e despesas da carreira médica sem comprometer a qualidade de vida.',
    profiles: ['student', 'admin']
  },
  {
    id: 'residency-investments',
    title: 'Investimentos para residentes',
    description: 'Estratégias de renda fixa e fundos imobiliários para quem está começando na residência.',
    profiles: ['student']
  },
  {
    id: 'clinic-cashflow',
    title: 'Fluxo de caixa do consultório',
    description: 'Checklist com previsões de despesas, repasses e metas de faturamento para clínicas em crescimento.',
    profiles: ['admin']
  },
  {
    id: 'tax-essentials',
    title: 'Essenciais de tributação médica',
    description: 'Entenda o impacto de regimes tributários como Lucro Presumido e Simples Nacional na rotina médica.',
    profiles: ['student', 'admin']
  },
  {
    id: 'team-performance',
    title: 'Performance da equipe assistencial',
    description: 'Métricas para acompanhar a produtividade do time e alinhar metas financeiras com qualidade assistencial.',
    profiles: ['admin']
  }
];

export class ContentService {
  list(profile?: UserRole): Omit<ContentItem, 'profiles'>[] {
    const items = profile
      ? contentLibrary.filter((item) => item.profiles.includes(profile))
      : contentLibrary;

    return items.map(({ profiles, ...rest }) => rest);
  }
}

export const contentService = new ContentService();
