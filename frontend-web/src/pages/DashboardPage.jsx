import { useEffect, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import * as d3 from 'd3';
import { healthcheck } from '../services/api';

const DashboardPage = () => {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const [status, setStatus] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let active = true;
    const fetchHealthcheck = async () => {
      try {
        const data = await healthcheck();
        if (active) {
          setStatus({ loading: false, data, error: null });
        }
      } catch (error) {
        if (active) {
          setStatus({ loading: false, data: null, error: error.message });
        }
      }
    };

    fetchHealthcheck();

    return () => {
      active = false;
    };
  }, []);

  const chartData = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, 4])
        .ticks(5)
        .map((value, index) => ({
          label: `Q${index + 1}`,
          value: d3.randomInt(10, 100)()
        })),
    []
  );

  if (!isAuthenticated) {
    return (
      <section className="rounded-lg bg-white p-8 shadow">
        <h2 className="text-xl font-semibold text-slate-800">Autenticação necessária</h2>
        <p className="mt-4 text-slate-600">
          Faça login para visualizar o dashboard com os indicadores financeiros.
        </p>
        <button
          onClick={() => loginWithRedirect()}
          className="mt-6 rounded bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700"
        >
          Entrar com Auth0
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-lg bg-white p-8 shadow">
        <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
        <p className="mt-2 text-slate-600">Olá, {user?.name || user?.email}! Aqui estão seus indicadores.</p>
        <div className="mt-6">
          {status.loading && <p className="text-sm text-slate-500">Carregando status do backend...</p>}
          {status.error && (
            <p className="text-sm text-red-600">Erro ao conectar: {status.error}</p>
          )}
          {status.data && (
            <div className="rounded border border-green-200 bg-green-50 p-4 text-green-700">
              <h3 className="font-medium">Status do backend</h3>
              <pre className="mt-2 whitespace-pre-wrap text-sm">{JSON.stringify(status.data, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-white p-8 shadow">
        <h3 className="text-lg font-semibold text-slate-800">Indicadores trimestrais</h3>
        <p className="mt-2 text-sm text-slate-600">Valores aleatórios gerados para demonstração.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {chartData.map((item) => (
            <div key={item.label} className="rounded bg-blue-100 p-4 text-center">
              <p className="text-sm font-medium text-blue-700">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-blue-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
