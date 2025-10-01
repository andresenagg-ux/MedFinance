import { useEffect, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { saveUserProfile, fetchUserProfile } from './api/client';
import ProfileSelector from './components/ProfileSelector';
import './styles/App.css';

const profileLabels: Record<string, string> = {
  STUDENT: 'estudante',
  RECENT_GRAD: 'recém-formado(a)',
  SPECIALIST: 'especialista',
};

type UserProfile = keyof typeof profileLabels;

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.sub;

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    (async () => {
      try {
        const response = await fetchUserProfile(userId);
        setProfile(response?.profile ?? null);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [userId]);

  const greeting = useMemo(() => {
    if (!profile || !user?.given_name) return null;
    const label = profileLabels[profile];
    return `Bem-vindo(a), ${user.given_name}! Perfil: ${label}`;
  }, [profile, user?.given_name]);

  const handleProfileSelect = async (selectedProfile: UserProfile) => {
    if (!userId) return;

    try {
      setIsSaving(true);
      setError(null);
      const { profile: savedProfile } = await saveUserProfile(userId, selectedProfile);
      setProfile(savedProfile);
    } catch (err) {
      console.error(err);
      setError('Não foi possível salvar seu perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="app-container">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <h1>MedFinance</h1>
        <p>Faça login para acessar os conteúdos personalizados.</p>
        <button onClick={() => loginWithRedirect()}>Entrar</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>MedFinance</h1>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Sair
        </button>
      </header>

      {!profile ? (
        <section>
          <h2>Qual é o seu momento profissional?</h2>
          <p>Escolha o perfil que melhor representa sua jornada atual.</p>
          <ProfileSelector
            disabled={isSaving}
            onSelect={handleProfileSelect}
            selectedProfile={profile}
          />
          {error && <p className="error-message">{error}</p>}
        </section>
      ) : (
        <section>
          {greeting ? <h2>{greeting}</h2> : <h2>Bem-vindo(a) ao MedFinance!</h2>}
          <p>
            Explore os conteúdos e ferramentas pensados especialmente para o seu estágio como
            {` ${profileLabels[profile]}`}.
          </p>
          <button className="change-profile" onClick={() => setProfile(null)}>
            Alterar perfil
          </button>
        </section>
      )}
    </div>
  );
}

export default App;
