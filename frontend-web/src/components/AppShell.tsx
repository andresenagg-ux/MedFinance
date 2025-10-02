import { ReactNode, useEffect, useMemo, useState } from 'react';
import './AppShell.css';

type NavigationItem = {
  label: string;
  href: string;
};

type User = {
  name: string;
  role: 'user' | 'admin';
};

type AppShellProps = {
  children: ReactNode;
  user: User;
};

const NAVIGATION: NavigationItem[] = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Cursos', href: '#courses' },
  { label: 'Comunidade', href: '#community' },
  { label: 'Financeiro', href: '#finance' },
];

const ADMIN_ITEM: NavigationItem = { label: 'Admin', href: '#admin' };

export default function AppShell({ children, user }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkTheme) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [isDarkTheme]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsSidebarOpen(false);
      }
    };

    if (mediaQuery.matches) {
      setIsSidebarOpen(false);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const navigation = useMemo(() => {
    if (user.role === 'admin') {
      return [...NAVIGATION, ADMIN_ITEM];
    }

    return NAVIGATION;
  }, [user.role]);

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <header className="app-shell__header" role="banner">
        <button
          type="button"
          className="icon-button app-shell__menu-button"
          aria-label={isSidebarOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          aria-expanded={isSidebarOpen}
          aria-controls="app-sidebar"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <span aria-hidden="true">☰</span>
        </button>

        <div className="app-shell__logo" aria-label="MedFinance">
          <span aria-hidden="true">💊</span>
          <span>MedFinance</span>
        </div>

        <form
          className="app-shell__search"
          role="search"
          aria-label="Buscar cursos e conteúdos"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="global-search" className="sr-only">
            Buscar
          </label>
          <input
            id="global-search"
            type="search"
            placeholder="Buscar..."
            aria-label="Buscar"
          />
        </form>

        <div className="app-shell__actions" role="group" aria-label="Ações do usuário">
          <button
            type="button"
            className="icon-button"
            aria-pressed={isDarkTheme}
            aria-label={isDarkTheme ? 'Ativar tema claro' : 'Ativar tema escuro'}
            onClick={() => setIsDarkTheme((prev) => !prev)}
          >
            <span aria-hidden="true">{isDarkTheme ? '🌙' : '☀️'}</span>
          </button>
          <button type="button" className="app-shell__avatar" aria-label={`Abrir menu do usuário ${user.name}`}>
            <span aria-hidden="true">{getInitials(user.name)}</span>
          </button>
        </div>
      </header>

      <div className="app-shell__body">
        <aside
          id="app-sidebar"
          className={`app-shell__sidebar ${isSidebarOpen ? 'app-shell__sidebar--open' : ''}`}
          aria-label="Navegação principal"
        >
          <nav>
            <ul>
              {navigation.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {isSidebarOpen && (
          <div
            className="app-shell__overlay"
            role="presentation"
            aria-hidden="true"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main id="main" tabIndex={-1} className="app-shell__content" aria-label="Conteúdo principal">
          {children}
        </main>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}
