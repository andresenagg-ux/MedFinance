import { useEffect, useState } from 'react';
import FeatureCard from './FeatureCard';

type Profile = 'student' | 'admin';

type ContentResponse = {
  items: Array<{
    id: string;
    title: string;
    description: string;
  }>;
};

const profiles: Array<{ value: Profile; label: string }> = [
  { value: 'student', label: 'Residente ou estudante' },
  { value: 'admin', label: 'Gestor ou proprietário' }
];

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const FeatureGrid = () => {
  const [profile, setProfile] = useState<Profile>('student');
  const [items, setItems] = useState<ContentResponse['items']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadContent() {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/content?profile=${profile}`);
        if (!response.ok) {
          throw new Error('Falha ao carregar conteúdo');
        }
        const data: ContentResponse = await response.json();
        if (active) {
          setItems(data.items);
          setError(null);
        }
      } catch (_error) {
        if (active) {
          setError('Não foi possível carregar o conteúdo agora. Tente novamente.');
          setItems([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      active = false;
    };
  }, [profile]);

  return (
    <section className="features" id="features">
      <div className="container">
        <div className="feature-header">
          <h2>Conteúdos recomendados para o seu momento</h2>
          <label className="profile-selector">
            <span>Perfil:</span>
            <select value={profile} onChange={(event) => setProfile(event.target.value as Profile)}>
              {profiles.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {isLoading && <p className="status-message">Carregando recomendações...</p>}
        {error && !isLoading && <p className="status-message error">{error}</p>}
        {!isLoading && !error && (
          <div className="grid">
            {items.map((item) => (
              <FeatureCard key={item.id} title={item.title} description={item.description} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureGrid;
