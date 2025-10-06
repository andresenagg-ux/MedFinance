import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import FinancialDashboard from './components/FinancialDashboard';
import InvestmentPlanner from './components/InvestmentPlanner';

function App() {
  return (
    <div className="app">
      <Hero />
      <FeatureGrid />
      <FinancialDashboard />
      <InvestmentPlanner />
    </div>
  );
}

export default App;
