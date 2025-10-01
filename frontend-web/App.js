import { useState } from 'react';
import './src/styles/global.css';
function App() {
  const [saldo, setSaldo] = useState(0);
  const atualizarSaldo = valor => {
    setSaldo(prev => prev + valor);
  };
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Finanças Médicas</h1>
        <p>Saldo atual: R${saldo.toFixed(2)}</p>
      </header>
      <main className="app-content">
        <button onClick={() => atualizarSaldo(100)}>Adicionar R$100</button>
        <button onClick={() => atualizarSaldo(-50)}>Remover R$50</button>
      </main>
    </div>
  );
}
export default App;
