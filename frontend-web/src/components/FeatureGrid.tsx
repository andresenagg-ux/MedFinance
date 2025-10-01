import FeatureCard from './FeatureCard';

const features = [
  {
    title: 'Planejamento financeiro',
    description: 'Modelos de orçamento adaptados à rotina da medicina para potencializar seus investimentos.'
  },
  {
    title: 'Comunidade exclusiva',
    description: 'Mentorias e encontros ao vivo com especialistas em finanças para profissionais da saúde.'
  },
  {
    title: 'Ferramentas práticas',
    description: 'Calculadoras e relatórios interativos para tomada de decisões com segurança.'
  }
];

const FeatureGrid = () => (
  <section className="features" id="features">
    <div className="container">
      <h2>Por que escolher a MedFinance?</h2>
      <div className="grid">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  </section>
);

export default FeatureGrid;
