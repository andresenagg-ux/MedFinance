import type { FC } from 'react';

const courseHighlights = [
  { label: 'Horas de conteúdo', value: '120h +' },
  { label: 'Planilhas e modelos', value: '30 ferramentas' },
  { label: 'Mentorias coletivas', value: '2x por mês' }
];

const learningPaths = [
  {
    title: 'Fundamentos financeiros',
    description:
      'Entenda os pilares da organização financeira pessoal, fluxo de caixa e criação de metas para profissionais da saúde.',
    focus: ['Orçamento inteligente', 'Reserva de emergência', 'Hábitos financeiros']
  },
  {
    title: 'Investimentos para médicos',
    description:
      'Construa uma carteira diversificada com foco em renda passiva e proteção patrimonial para diferentes estágios da carreira.',
    focus: ['Renda fixa e variável', 'Previdência privada', 'Planejamento sucessório']
  },
  {
    title: 'Gestão de consultório',
    description:
      'Otimize receitas, controle custos e aprenda a precificar procedimentos de forma sustentável.',
    focus: ['Precificação', 'Fluxo de caixa', 'Indicadores de performance']
  }
];

const courseCatalog = [
  {
    title: 'Planejamento Financeiro 360°',
    description:
      'Crie um plano financeiro completo que equilibra qualidade de vida, investimentos e expansão do consultório.',
    duration: '6 semanas',
    level: 'Intermediário',
    format: 'Trilha guiada',
    topics: ['Mapa de metas', 'Análise de gastos', 'Projeções personalizadas']
  },
  {
    title: 'Investimentos em Saúde',
    description:
      'Aprenda a investir com segurança utilizando estratégias alinhadas às metas da carreira médica.',
    duration: '4 semanas',
    level: 'Avançado',
    format: 'Curso imersivo',
    topics: ['Perfil de risco', 'Carteira antifrágil', 'Proteção patrimonial']
  },
  {
    title: 'Consultório Rentável',
    description:
      'Implemente uma operação enxuta, com indicadores que te ajudam a tomar decisões rápidas e baseadas em dados.',
    duration: '8 semanas',
    level: 'Intermediário',
    format: 'Programa híbrido',
    topics: ['Diagnóstico financeiro', 'Fluxo operacional', 'KPIs essenciais']
  }
];

const mentors = [
  {
    name: 'Dra. Ana Luísa Prado',
    role: 'Médica e educadora financeira',
    bio: 'Especialista em orientar profissionais da saúde em transições de carreira com foco em finanças pessoais.'
  },
  {
    name: 'Ricardo Fernandes',
    role: 'Planejador financeiro CFP®',
    bio: 'Mais de 12 anos construindo estratégias patrimoniais para clínicas e consultórios de alto padrão.'
  },
  {
    name: 'Larissa Monteiro',
    role: 'Analista de investimentos',
    bio: 'Responsável por curadoria de carteiras e análises de risco para profissionais da saúde autônomos.'
  }
];

const CoursesPage: FC = () => (
  <main className="courses">
    <section className="courses__hero">
      <div className="container">
        <div className="courses__hero-content">
          <span className="courses__eyebrow">Trilhas especializadas</span>
          <h1>Conquiste segurança financeira com cursos pensados para sua rotina médica</h1>
          <p>
            Conecte-se a um ecossistema de aprendizado contínuo, com aulas ao vivo, simuladores interativos e modelos
            prontos para aplicar no seu consultório.
          </p>
          <form className="courses__search" role="search">
            <label className="sr-only" htmlFor="search-courses">
              Buscar cursos
            </label>
            <input id="search-courses" type="search" placeholder="Buscar módulos, temas ou mentores" />
            <button type="submit">Explorar trilhas</button>
          </form>
          <dl className="courses__highlights">
            {courseHighlights.map((highlight) => (
              <div key={highlight.label}>
                <dt>{highlight.value}</dt>
                <dd>{highlight.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>

    <section className="courses__section" aria-labelledby="paths-heading">
      <div className="container">
        <div className="courses__section-header">
          <div>
            <h2 id="paths-heading">Escolha a trilha ideal para o seu momento</h2>
            <p>
              Selecione o foco que melhor se adapta à sua jornada profissional. Combine trilhas, participe de mentorias
              coletivas e acesse planos de ação personalizados.
            </p>
          </div>
          <a className="courses__link" href="#catalogo">
            Ver calendário completo
          </a>
        </div>
        <div className="courses__paths">
          {learningPaths.map((path) => (
            <article key={path.title} className="courses__path-card">
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <ul>
                {path.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="courses__section" aria-labelledby="catalog-heading" id="catalogo">
      <div className="container">
        <div className="courses__section-header">
          <div>
            <h2 id="catalog-heading">Catálogo de cursos</h2>
            <p>
              Conteúdos modulares, com certificado de conclusão e acompanhamento direto do nosso time de especialistas.
            </p>
          </div>
          <div className="courses__filters">
            <button type="button">Todos os níveis</button>
            <button type="button">Ao vivo</button>
            <button type="button">On-demand</button>
          </div>
        </div>
        <div className="courses__grid">
          {courseCatalog.map((course) => (
            <article key={course.title} className="course-card">
              <header>
                <span className="course-card__badge">{course.format}</span>
                <span className="course-card__level">{course.level}</span>
              </header>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <ul>
                {course.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
              <footer>
                <span>{course.duration}</span>
                <button type="button">Detalhes do curso</button>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="courses__section courses__section--alt" aria-labelledby="mentors-heading">
      <div className="container">
        <div className="courses__section-header">
          <div>
            <h2 id="mentors-heading">Mentores que conhecem a realidade da saúde</h2>
            <p>
              Encontros ao vivo, feedback contínuo e acompanhamento individualizado para acelerar os resultados do seu
              planejamento financeiro.
            </p>
          </div>
          <a className="courses__link" href="#">
            Conheça todos os mentores
          </a>
        </div>
        <div className="courses__mentors">
          {mentors.map((mentor) => (
            <article key={mentor.name} className="courses__mentor-card">
              <div>
                <strong>{mentor.name}</strong>
                <span>{mentor.role}</span>
              </div>
              <p>{mentor.bio}</p>
              <button type="button">Agendar conversa</button>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="courses__cta" aria-labelledby="cta-heading">
      <div className="container">
        <div className="courses__cta-content">
          <h2 id="cta-heading">Pronto para assumir o controle das suas finanças?</h2>
          <p>
            Garanta acesso imediato às trilhas, participe da comunidade exclusiva e receba o mapa financeiro adaptado à
            sua realidade.
          </p>
          <div className="courses__cta-actions">
            <button type="button" className="courses__cta-primary">
              Começar agora
            </button>
            <button type="button" className="courses__cta-secondary">
              Conversar com um especialista
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default CoursesPage;
