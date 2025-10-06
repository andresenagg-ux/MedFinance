import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import FinancialDashboard from './components/FinancialDashboard';
import CoursesPage from './components/CoursesPage';

function App() {
  return (
    <div className="app">
      <Hero />
      <FeatureGrid />
      <FinancialDashboard />
      <CoursesPage />
    </div>
  );
}

export default App;
