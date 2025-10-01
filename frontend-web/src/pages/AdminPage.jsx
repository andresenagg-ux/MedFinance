import { useAuth0 } from '@auth0/auth0-react';

const AdminPage = () => {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    return (
      <section className="rounded-lg bg-white p-8 shadow">
        <h2 className="text-xl font-semibold text-slate-800">Área restrita</h2>
        <p className="mt-4 text-slate-600">Você precisa estar autenticado para acessar o painel administrativo.</p>
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
    <section className="rounded-lg bg-white p-8 shadow">
      <h2 className="text-xl font-semibold text-slate-800">Administração</h2>
      <p className="mt-4 text-slate-600">
        Bem-vindo(a), {user?.name || user?.email}. Gerencie usuários, permissões e configurações do sistema.
      </p>
      <ul className="mt-6 space-y-3">
        <li className="rounded border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800">Gestão de Usuários</h3>
          <p className="text-sm text-slate-600">Convide novos membros e defina papéis de acesso.</p>
        </li>
        <li className="rounded border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800">Configurações de Segurança</h3>
          <p className="text-sm text-slate-600">Atualize políticas de autenticação, MFA e auditoria.</p>
        </li>
        <li className="rounded border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800">Relatórios</h3>
          <p className="text-sm text-slate-600">Visualize relatórios financeiros avançados e exporte dados.</p>
        </li>
      </ul>
    </section>
  );
};

export default AdminPage;
