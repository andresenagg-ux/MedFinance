import AppShell from './components/AppShell';
import FeatureGrid from './components/FeatureGrid';
import Hero from './components/Hero';

const user = {
  name: 'Ana Silva',
  role: 'admin' as const,
};

function App() {
  return (
    <AppShell user={user}>
      <Hero />
      <FeatureGrid />
    </AppShell>
  );
}

export default App;
