import { useAuth0 } from '@auth0/auth0-react';

const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();

  return (
    <section className="rounded-lg bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold text-slate-800">Bem-vindo ao MedFinance</h1>
      <p className="mt-4 text-slate-600">
        {isAuthenticated
          ? `Você está autenticado como ${user?.name || user?.email}.`
          : 'Faça login para acessar o painel financeiro e os recursos administrativos.'}
      </p>
      {!isAuthenticated && (
        <button
          onClick={() => loginWithRedirect()}
          className="mt-6 rounded bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700"
        >
          Entrar com Auth0
        </button>
      )}
    </section>
  );
};

export default LoginPage;
