import { useThemeMode } from '../theme/useThemeMode';

const Header = () => {
  const { theme, toggleTheme } = useThemeMode();
  const isDark = theme === 'dark';

  return (
    <header className="site-header">
      <div className="container header-content">
        <span className="logo">MedFinance</span>
        <button
          type="button"
          className="theme-toggle"
          aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
          title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
          onClick={toggleTheme}
        >
          <span className="visually-hidden">Alternar tema</span>
          <span aria-hidden="true" className="theme-toggle__icon">
            {isDark ? '🌙' : '☀️'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
