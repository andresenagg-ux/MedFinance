import { useMemo } from 'react';

function App() {
  const tips = useMemo(
    () => [
      'Organize seu orçamento mensal',
      'Planeje investimentos de longo prazo',
      'Mantenha uma reserva de emergência'
    ],
    []
  );

  return (
    <main>
      <h1>MedFinance</h1>
      <p>Educação financeira para profissionais da saúde.</p>
      <ul>
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;
