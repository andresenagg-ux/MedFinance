import { useMemo, useState } from 'react';

const numberFormatter = new Intl.NumberFormat('pt-BR');

type TrackId = 'all' | 'financas-clinicas' | 'investimentos-medicos' | 'gestao-carreira';

type Track = {
  id: TrackId;
  title: string;
  description: string;
  badge?: string;
};

type Course = {
  id: string;
  title: string;
  description: string;
  category: TrackId;
  level: string;
  duration: string;
  format: string;
  badge?: string;
  rating: number;
  students: number;
  nextClass: string;
  investment: string;
  highlights: string[];
};

const tracks = [
  {
    id: 'all',
    title: 'Visão completa',
    description: 'Combine trilhas para acelerar sua evolução financeira.'
  },
  {
    id: 'financas-clinicas',
    title: 'Finanças para clínicas',
    description: 'Gestão de fluxo de caixa, precificação e indicadores.',
    badge: 'Mais procurado'
  },
  {
    id: 'investimentos-medicos',
    title: 'Investimentos médicos',
    description: 'Construção de patrimônio e proteção da renda.',
    badge: 'Premium'
  },
  {
    id: 'gestao-carreira',
    title: 'Gestão de carreira',
    description: 'Branding pessoal, posicionamento digital e agenda cheia.',
    badge: 'Novo'
  }
] satisfies Track[];

const courses = [
  {
    id: 'financial-strategy',
    title: 'Estratégias financeiras para clínicas e consultórios',
    description:
      'Organize o fluxo de caixa, monitore indicadores essenciais e desenvolva planos de crescimento sustentáveis.',
    category: 'financas-clinicas',
    level: 'Intermediário',
    duration: '6 semanas · 24h',
    format: 'Ao vivo + laboratório prático',
    badge: 'Mais procurado',
    rating: 4.9,
    students: 482,
    nextClass: 'Novembro/2024',
    investment: '12x de R$ 189',
    highlights: ['Mentorias quinzenais com CFO convidado', 'Planilhas prontas para clínicas', 'Painel de indicadores no Notion']
  },
  {
    id: 'tax-planning',
    title: 'Planejamento tributário para profissionais da saúde',
    description:
      'Escolha o regime ideal, reduza a carga tributária legalmente e garanta conformidade fiscal sem surpresas.',
    category: 'financas-clinicas',
    level: 'Avançado',
    duration: '4 semanas · 16h',
    format: 'On-demand + sessões ao vivo',
    rating: 4.8,
    students: 291,
    nextClass: 'Janeiro/2025',
    investment: '10x de R$ 149',
    highlights: ['Simulador tributário exclusivo', 'Checklist fiscal atualizado', 'Suporte com time contábil parceiro']
  },
  {
    id: 'wealth-protection',
    title: 'Investimentos e proteção de patrimônio médico',
    description:
      'Construa portfólio global, diversifique renda passiva e aprenda estratégias de blindagem patrimonial.',
    category: 'investimentos-medicos',
    level: 'Intermediário',
    duration: '8 semanas · 32h',
    format: 'Ao vivo + comunidade fechada',
    badge: 'Certificação incluída',
    rating: 5,
    students: 358,
    nextClass: 'Dezembro/2024',
    investment: '12x de R$ 249',
    highlights: ['Carteira modelo atualizada mensalmente', 'Aulas com especialistas convidados', 'Análise personalizada de riscos']
  },
  {
    id: 'career-labs',
    title: 'Growth e posicionamento para carreira médica',
    description:
      'Construa autoridade digital, otimize agenda de atendimentos e transforme pacientes em promotores da marca.',
    category: 'gestao-carreira',
    level: 'Intermediário',
    duration: '5 semanas · 20h',
    format: 'Híbrido · estudos de caso reais',
    rating: 4.7,
    students: 214,
    nextClass: 'Fevereiro/2025',
    investment: '12x de R$ 169',
    highlights: ['Laboratório de conteúdo semanal', 'Diagnóstico de presença digital', 'Kit de playbooks prontos para ação']
  },
  {
    id: 'financial-foundations',
    title: 'Fundamentos de finanças pessoais para residentes',
    description:
      'Construa hábitos financeiros sólidos desde o início da carreira com métodos ágeis e práticos.',
    category: 'investimentos-medicos',
    level: 'Iniciante',
    duration: '3 semanas · 12h',
    format: 'On-demand + desafios guiados',
    rating: 4.95,
    students: 624,
    nextClass: 'Turmas contínuas',
    investment: '6x de R$ 79',
    highlights: ['Trilha guiada de 21 dias', 'Templates de controle mensal', 'Feedback assíncrono do time']
  }
] satisfies Course[];

const benefits = [
  {
    icon: '🎯',
    title: 'Trilhas orientadas a resultados',
    description:
      'Cada curso termina com um plano de ação validado por especialistas para implementação imediata.'
  },
  {
    icon: '🤝',
    title: 'Comunidade de mentores',
    description: 'Encontros quinzenais e networking com profissionais que lideram operações de saúde pelo Brasil.'
  },
  {
    icon: '📊',
    title: 'Ferramentas exclusivas',
    description: 'Dashboards financeiros, calculadoras e modelos prontos para acelerar a tomada de decisão.'
  }
] as const;

const journey = [
  {
    step: '1. Imersão ao vivo',
    description: 'Aulas síncronas com especialistas e estudos de caso de clínicas reais.'
  },
  {
    step: '2. Laboratórios guiados',
    description: 'Aplicação prática com feedback individual do time MedFinance.'
  },
  {
    step: '3. Implementação assistida',
    description: 'Mentorias e acompanhamentos pós-curso para garantir resultados sustentáveis.'
  }
] as const;

const faqs = [
  {
    question: 'Os cursos possuem certificado reconhecido?',
    answer:
      'Sim. Todos os cursos oferecem certificado digital validado pela MedFinance e aceito em programas de educação continuada.'
  },
  {
    question: 'Como funcionam as mentorias ao vivo?',
    answer:
      'As mentorias acontecem em grupos reduzidos a cada quinze dias, com espaço para discutir indicadores, dúvidas fiscais e estratégias personalizadas.'
  },
  {
    question: 'Consigo acessar os materiais após o término?',
    answer:
      'O acesso às aulas gravadas, planilhas e atualizações permanece disponível por 12 meses após a conclusão da turma.'
  }
] as const;

const CoursesPage = () => {
  const [selectedTrack, setSelectedTrack] = useState<TrackId>('all');

  const filteredCourses = useMemo(() => {
    if (selectedTrack === 'all') {
      return courses;
    }

    return courses.filter((course) => course.category === selectedTrack);
  }, [selectedTrack]);

  return (
    <div className="courses-page">
      <header className="courses-hero">
        <div className="container courses-hero__container">
          <div className="courses-hero__content">
            <span className="courses-hero__badge">Nova temporada 2024/2025</span>
            <h1>Cursos MedFinance</h1>
            <p>
              Transforme sua relação com finanças, investimentos e gestão de carreira médica com programas intensivos
              conduzidos por especialistas de mercado.
            </p>
            <div className="courses-hero__actions">
              <a className="courses-hero__cta" href="#cursos">
                Ver trilhas disponíveis
              </a>
              <a className="courses-hero__ghost" href="#mentorias">
                Falar com um especialista
              </a>
            </div>
            <dl className="courses-hero__stats">
              <div>
                <dt>+4.500</dt>
                <dd>profissionais formados</dd>
              </div>
              <div>
                <dt>96%</dt>
                <dd>aplicação em até 60 dias</dd>
              </div>
              <div>
                <dt>9.6/10</dt>
                <dd>satisfação média das turmas</dd>
              </div>
            </dl>
          </div>
          <aside className="courses-hero__highlight" aria-label="Destaque dos cursos">
            <h2>Experiência imersiva</h2>
            <ul>
              <li>
                <strong>Agenda adaptada</strong>
                <span>Encontros noturnos e gravações disponíveis no dia seguinte.</span>
              </li>
              <li>
                <strong>Material premium</strong>
                <span>Planilhas, templates de contratos e calculadoras financeiras prontas.</span>
              </li>
              <li>
                <strong>Suporte dedicado</strong>
                <span>Equipe multiespecialista acompanhando sua evolução semanal.</span>
              </li>
            </ul>
          </aside>
        </div>
      </header>

      <section className="courses-tracks" aria-label="Trilhas de especialização">
        <div className="container">
          <div className="courses-tracks__intro">
            <h2>Escolha a trilha que combina com sua fase</h2>
            <p>
              Alterne entre as trilhas para visualizar cursos, formatos e diferenciais pensados para desafios específicos
              da carreira médica.
            </p>
          </div>
          <div className="courses-tracks__options" role="tablist">
            {tracks.map((track) => {
              const isActive = selectedTrack === track.id;

              return (
                <button
                  key={track.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="cursos"
                  className={`courses-tracks__option${isActive ? ' courses-tracks__option--active' : ''}`}
                  onClick={() => setSelectedTrack(track.id)}
                >
                  {track.badge ? <span className="courses-tracks__badge">{track.badge}</span> : null}
                  <span className="courses-tracks__title">{track.title}</span>
                  <span className="courses-tracks__description">{track.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="cursos"
        className="courses-list"
        aria-live="polite"
        aria-labelledby="courses-list-heading"
      >
        <div className="container">
          <div className="courses-list__header">
            <h2 id="courses-list-heading">Cursos em destaque</h2>
            <p>
              {selectedTrack === 'all'
                ? 'Veja os programas mais procurados para acelerar seus resultados financeiros.'
                : 'Explore os cursos selecionados para essa trilha e descubra o próximo passo da sua evolução.'}
            </p>
          </div>
          <div className="courses-list__grid">
            {filteredCourses.map((course) => {
              const titleId = `${course.id}-title`;

              return (
                <article key={course.id} className="course-card" aria-labelledby={titleId}>
                  {course.badge ? <span className="course-card__badge">{course.badge}</span> : null}
                  <header className="course-card__header">
                    <h3 id={titleId}>{course.title}</h3>
                    <p>{course.description}</p>
                  </header>
                  <dl className="course-card__meta">
                    <div>
                      <dt>Nível</dt>
                      <dd>{course.level}</dd>
                    </div>
                    <div>
                      <dt>Duração</dt>
                      <dd>{course.duration}</dd>
                    </div>
                    <div>
                      <dt>Formato</dt>
                      <dd>{course.format}</dd>
                    </div>
                  </dl>
                  <ul className="course-card__highlights">
                    {course.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="course-card__stats" aria-label="Avaliação do curso">
                    <span>
                      {course.rating.toFixed(1)} ★ · {numberFormatter.format(course.students)} alunos
                    </span>
                  </div>
                  <footer className="course-card__footer">
                    <div>
                      <span>Próxima turma</span>
                      <strong>{course.nextClass}</strong>
                    </div>
                    <div>
                      <span>Investimento</span>
                      <strong>{course.investment}</strong>
                    </div>
                    <a className="course-card__cta" href="#mentorias">
                      Ver detalhes
                    </a>
                  </footer>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="courses-benefits" aria-labelledby="benefits-heading">
        <div className="container">
          <header className="courses-benefits__header">
            <h2 id="benefits-heading">O que torna a experiência MedFinance única?</h2>
            <p>Uma jornada desenhada para médicos, gestores de clínica e equipes que buscam escala sustentável.</p>
          </header>
          <div className="courses-benefits__grid">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="benefit-card">
                <span className="benefit-card__icon" role="img" aria-hidden="true">
                  {benefit.icon}
                </span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="mentorias" className="courses-journey" aria-labelledby="journey-heading">
        <div className="container">
          <header className="courses-journey__header">
            <h2 id="journey-heading">Sua jornada de transformação</h2>
            <p>
              Mais do que aulas, você recebe acompanhamento contínuo para implementar estratégias financeiras com confiança.
            </p>
          </header>
          <ol className="courses-journey__timeline">
            {journey.map((item) => (
              <li key={item.step}>
                <h3>{item.step}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="courses-faq" aria-labelledby="faq-heading">
        <div className="container">
          <header className="courses-faq__header">
            <h2 id="faq-heading">Perguntas frequentes</h2>
            <p>Transparência total para você decidir com tranquilidade.</p>
          </header>
          <dl className="courses-faq__list">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
