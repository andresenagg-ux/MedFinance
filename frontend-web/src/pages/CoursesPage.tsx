import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

const numberFormatter = new Intl.NumberFormat('pt-BR');

type TrackId = 'all' | 'financas-clinicas' | 'investimentos-medicos' | 'gestao-carreira';
type FlowTrackId = Exclude<TrackId, 'all'>;

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

type FlowSection = {
  id: string;
  title: string;
  summary: string;
  description: string;
  outcomes: string[];
  focusCourses: Course['id'][];
};

type FlowBlueprint = {
  title: string;
  subtitle: string;
  sections: FlowSection[];
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

const flows = {
  'financas-clinicas': {
    title: 'Domine a gestão financeira da sua clínica',
    subtitle:
      'Uma jornada completa para diagnosticar, planejar e escalar as finanças de operações em saúde com segurança.',
    sections: [
      {
        id: 'diagnostico',
        title: '1. Diagnóstico e clareza de indicadores',
        summary: 'Mapeie entradas, saídas e os principais gargalos da operação.',
        description:
          'Comece estruturando o fluxo de caixa, interpretando dashboards e definindo metas financeiras realistas para a equipe.',
        outcomes: [
          'Organize centros de custo e visão consolidada de receita',
          'Implemente painéis com indicadores acionáveis',
          'Defina metas de crescimento alinhadas ao planejamento estratégico'
        ],
        focusCourses: ['financial-strategy']
      },
      {
        id: 'governanca',
        title: '2. Governança tributária e compliance',
        summary: 'Prepare-se para reduzir carga tributária com segurança jurídica.',
        description:
          'Aprofunde-se em regimes fiscais, modelos societários e rotinas de conformidade para manter a clínica blindada e eficiente.',
        outcomes: [
          'Simulações comparativas entre regimes tributários',
          'Checklist fiscal atualizado para o setor da saúde',
          'Protocolos de auditoria e revisão periódica'
        ],
        focusCourses: ['tax-planning']
      },
      {
        id: 'crescimento',
        title: '3. Escala sustentável e reinvestimento',
        summary: 'Construa planos de expansão com previsibilidade e margem saudável.',
        description:
          'Desenvolva cenários de crescimento, defina indicadores de performance e crie mecanismos de reinvestimento para acelerar resultados.',
        outcomes: [
          'Modelos financeiros para expansão de serviços',
          'Playbooks para reinvestimento e reservas técnicas',
          'Rotina de acompanhamento mensal com time executivo'
        ],
        focusCourses: ['financial-strategy', 'tax-planning']
      }
    ]
  },
  'investimentos-medicos': {
    title: 'Estruture seu patrimônio com visão global',
    subtitle:
      'Da construção da reserva de emergência à proteção internacional do patrimônio médico, com acompanhamento contínuo.',
    sections: [
      {
        id: 'fundamentos',
        title: '1. Fundamentos e organização pessoal',
        summary: 'Crie base sólida de hábitos financeiros mesmo em agendas cheias.',
        description:
          'Implemente o plano de 21 dias para residentes e médicos que desejam sair do ciclo de plantões sem controle financeiro.',
        outcomes: [
          'Sistema de controle mensal simplificado',
          'Distribuição estratégica entre curto, médio e longo prazo',
          'Checklist de blindagem para emergências'
        ],
        focusCourses: ['financial-foundations']
      },
      {
        id: 'portfolio',
        title: '2. Construção de portfólio e diversificação',
        summary: 'Monte carteira global equilibrada com visão de risco personalizada.',
        description:
          'Aprenda a combinar renda fixa, variável, produtos internacionais e seguros patrimoniais desenhados para médicos.',
        outcomes: [
          'Carteira modelo atualizada mensalmente',
          'Matriz de risco personalizada por momento de carreira',
          'Protocolos para rebalanceamento trimestral'
        ],
        focusCourses: ['wealth-protection']
      },
      {
        id: 'blindagem',
        title: '3. Blindagem e sucessão',
        summary: 'Proteja ganhos e antecipe sucessão com governança familiar.',
        description:
          'Desenhe estruturas societárias, seguros e estratégias sucessórias para garantir legado e continuidade do patrimônio.',
        outcomes: [
          'Políticas de blindagem patrimonial alinhadas ao jurídico',
          'Mapeamento de seguros e holdings compatíveis',
          'Rituais de revisão anual com especialistas parceiros'
        ],
        focusCourses: ['wealth-protection']
      }
    ]
  },
  'gestao-carreira': {
    title: 'Construa autoridade e agenda previsível',
    subtitle:
      'Potencialize posicionamento, relacionamento com pacientes e expansão de serviços premium.',
    sections: [
      {
        id: 'posicionamento',
        title: '1. Identidade e posicionamento digital',
        summary: 'Defina narrativa única para destacar sua expertise no mercado.',
        description:
          'Trabalhe presença digital, reputação e storytelling para transformar seguidores em oportunidades reais.',
        outcomes: [
          'Diagnóstico completo da presença digital',
          'Biblioteca de conteúdo semanal com roteiros guiados',
          'Métricas de autoridade para monitoramento contínuo'
        ],
        focusCourses: ['career-labs']
      },
      {
        id: 'operacao',
        title: '2. Jornada de paciente e operação comercial',
        summary: 'Construa experiência memorável em cada ponto de contato.',
        description:
          'Aprenda a combinar marketing, atendimento e follow-up para manter agendas cheias sem depender de anúncios agressivos.',
        outcomes: [
          'Playbooks de atendimento humanizado',
          'Scripts comerciais para equipe de suporte',
          'Ferramentas de CRM adaptadas à rotina médica'
        ],
        focusCourses: ['career-labs']
      },
      {
        id: 'expansao',
        title: '3. Expansão de serviços e produtos premium',
        summary: 'Estruture ofertas de alto valor com previsibilidade de receita.',
        description:
          'Desenvolva programas de recorrência, mentorias e parcerias estratégicas para elevar ticket médio com consistência.',
        outcomes: [
          'Framework de lançamento recorrente',
          'Planilha de precificação orientada a valor',
          'Calendário de campanhas e eventos de relacionamento'
        ],
        focusCourses: ['career-labs']
      }
    ]
  }
} satisfies Record<FlowTrackId, FlowBlueprint>;

const CoursesPage = () => {
  const [selectedTrack, setSelectedTrack] = useState<TrackId>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeFlowTrack, setActiveFlowTrack] = useState<FlowTrackId>('financas-clinicas');
  const [activeFlowSection, setActiveFlowSection] = useState<string>(flows['financas-clinicas'].sections[0].id);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const coursesListRef = useRef<HTMLElement | null>(null);
  const flowSectionRef = useRef<HTMLElement | null>(null);

  const filteredCourses = useMemo(() => {
    if (selectedTrack === 'all') {
      return courses;
    }

    return courses.filter((course) => course.category === selectedTrack);
  }, [selectedTrack]);

  const currentFlow = flows[activeFlowTrack];
  const currentSection = useMemo(
    () => currentFlow.sections.find((section) => section.id === activeFlowSection) ?? currentFlow.sections[0],
    [activeFlowSection, currentFlow.sections]
  );

  const sectionCourses = useMemo(
    () => currentSection.focusCourses.map((courseId) => courses.find((course) => course.id === courseId)).filter(Boolean) as Course[],
    [currentSection]
  );

  useEffect(() => {
    const flowSections = flows[activeFlowTrack].sections;
    const hasCurrentSection = flowSections.some((section) => section.id === activeFlowSection);

    if (!hasCurrentSection) {
      const [firstSection] = flowSections;
      if (firstSection) {
        setActiveFlowSection(firstSection.id);
      }
    }
  }, [activeFlowTrack, activeFlowSection]);

  useEffect(() => {
    if (!selectedCourseId) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const anchorId = `course-${selectedCourseId}`;
    const anchorElement = document.getElementById(anchorId);

    if (anchorElement) {
      window.requestAnimationFrame(() => {
        anchorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    } else if (coursesListRef.current) {
      coursesListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCourseId]);

  const handleNavigateToCourse = (courseId: string) => {
    const course = courses.find((item) => item.id === courseId);

    if (!course) {
      return;
    }

    setSelectedTrack(course.category);
    setSelectedCourseId(course.id);

    if (course.category !== 'all') {
      const flow = flows[course.category];
      const focusSection = flow.sections.find((section) => section.focusCourses.includes(course.id));

      setActiveFlowTrack(course.category);

      if (focusSection) {
        setActiveFlowSection(focusSection.id);
      }
    }

    if (typeof window !== 'undefined' && flowSectionRef.current) {
      window.requestAnimationFrame(() => {
        flowSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const handleVideoUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      courseId: selectedCourseId ?? sectionCourses[0]?.id ?? null,
      sectionId: currentSection.id,
      title: uploadTitle,
      description: uploadDescription,
      vimeoUrl: uploadUrl
    };

    setUploadStatus('loading');
    setUploadMessage('Iniciando preparação do upload no Vimeo...');

    try {
      const response = await fetch('/api/integrations/vimeo/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com o serviço de vídeos');
      }

      setUploadStatus('success');
      setUploadMessage('Upload configurado com sucesso. Acompanhe o processamento na área de mídia da plataforma.');
      setUploadTitle('');
      setUploadDescription('');
      setUploadUrl('');
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
      setUploadMessage('Não foi possível iniciar o upload. Revise os dados e tente novamente.');
    }
  };

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
        ref={coursesListRef}
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
              const isActiveCourse = selectedCourseId === course.id;

              return (
                <article
                  key={course.id}
                  id={`course-${course.id}`}
                  className={`course-card${isActiveCourse ? ' course-card--active' : ''}`}
                  aria-labelledby={titleId}
                >
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
                    <button
                      type="button"
                      className="course-card__cta"
                      onClick={() => handleNavigateToCourse(course.id)}
                    >
                      Ver detalhes do fluxo
                    </button>
                  </footer>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="courses-flow" aria-labelledby="flow-heading" ref={flowSectionRef}>
        <div className="container">
          <header className="courses-flow__header">
            <h2 id="flow-heading">Construa a jornada completa até seu próximo curso</h2>
            <p>
              Explore as fases de cada trilha, entenda os resultados esperados e conecte-se diretamente com o curso que
              responde aos desafios da sua rotina.
            </p>
          </header>
          <div className="courses-flow__layout">
            <nav className="courses-flow__tracks" aria-label="Trilhas disponíveis">
              {(Object.keys(flows) as FlowTrackId[]).map((track) => {
                const flow = flows[track];
                const isActive = activeFlowTrack === track;

                return (
                  <button
                    key={track}
                    type="button"
                    className={`courses-flow__track${isActive ? ' courses-flow__track--active' : ''}`}
                    onClick={() => setActiveFlowTrack(track)}
                  >
                    <span className="courses-flow__track-title">{flow.title}</span>
                    <span className="courses-flow__track-subtitle">{flow.subtitle}</span>
                  </button>
                );
              })}
            </nav>
            <div className="courses-flow__content">
              <div className="courses-flow__sections" role="tablist" aria-label="Fases da trilha selecionada">
                {currentFlow.sections.map((section) => {
                  const isActive = section.id === currentSection.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`courses-flow__section${isActive ? ' courses-flow__section--active' : ''}`}
                      onClick={() => setActiveFlowSection(section.id)}
                    >
                      <span className="courses-flow__section-title">{section.title}</span>
                      <span className="courses-flow__section-summary">{section.summary}</span>
                    </button>
                  );
                })}
              </div>
              <article className="courses-flow__panel" aria-live="polite">
                <header>
                  <h3>{currentSection.title}</h3>
                  <p>{currentSection.description}</p>
                </header>
                <ul className="courses-flow__outcomes">
                  {currentSection.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
                <div className="courses-flow__courses" aria-label="Cursos relacionados">
                  {sectionCourses.map((course) => (
                    <div key={course.id} className="courses-flow__course">
                      <div>
                        <h4>{course.title}</h4>
                        <p>{course.description}</p>
                        <dl>
                          <div>
                            <dt>Formato</dt>
                            <dd>{course.format}</dd>
                          </div>
                          <div>
                            <dt>Nível</dt>
                            <dd>{course.level}</dd>
                          </div>
                        </dl>
                      </div>
                      <button type="button" onClick={() => handleNavigateToCourse(course.id)}>
                        Acessar curso
                      </button>
                    </div>
                  ))}
                </div>
                <div className="video-upload">
                  <h4>Upload de aulas para o Vimeo</h4>
                  <p>
                    Centralize os vídeos desta fase e envie para a biblioteca da MedFinance com a integração oficial do
                    Vimeo.
                  </p>
                  <form onSubmit={handleVideoUpload}>
                    <div className="video-upload__grid">
                      <label htmlFor="upload-title">
                        Título do vídeo
                        <input
                          id="upload-title"
                          name="upload-title"
                          type="text"
                          value={uploadTitle}
                          onChange={(event) => setUploadTitle(event.target.value)}
                          placeholder="Ex.: Aula 02 · Simulador de fluxo de caixa"
                          required
                        />
                      </label>
                      <label htmlFor="upload-url">
                        URL do vídeo no Vimeo (opcional)
                        <input
                          id="upload-url"
                          name="upload-url"
                          type="url"
                          value={uploadUrl}
                          onChange={(event) => setUploadUrl(event.target.value)}
                          placeholder="https://vimeo.com/..."
                        />
                      </label>
                    </div>
                    <label htmlFor="upload-description" className="video-upload__full">
                      Descrição e materiais de apoio
                      <textarea
                        id="upload-description"
                        name="upload-description"
                        value={uploadDescription}
                        onChange={(event) => setUploadDescription(event.target.value)}
                        placeholder="Inclua materiais mencionados na aula, links e observações para o time de edição."
                        rows={4}
                      />
                    </label>
                    <div className="video-upload__actions">
                      <button type="submit" disabled={uploadStatus === 'loading'}>
                        {uploadStatus === 'loading' ? 'Enviando dados…' : 'Enviar para o Vimeo'}
                      </button>
                      {uploadMessage ? (
                        <span
                          className={`video-upload__feedback${
                            uploadStatus === 'error'
                              ? ' video-upload__feedback--error'
                              : uploadStatus === 'success'
                                ? ' video-upload__feedback--success'
                                : ''
                          }`}
                          role="status"
                        >
                          {uploadMessage}
                        </span>
                      ) : null}
                    </div>
                  </form>
                </div>
              </article>
            </div>
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
