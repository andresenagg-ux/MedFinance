export type FeatureCardProps = {
  title: string;
  description: string;
};

const FeatureCard = ({ title, description }: FeatureCardProps) => (
  <article className="feature-card">
    <h3>{title}</h3>
    <p>{description}</p>
  </article>
);

export default FeatureCard;
