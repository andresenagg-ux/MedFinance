import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const linkClasses = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
    isActive ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-blue-500 hover:text-white'
  }`;

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <nav className="bg-blue-700 text-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="text-lg font-semibold">MedFinance</div>
        <div className="flex items-center gap-4">
          <NavLink to="/" className={linkClasses} end>
            Login
          </NavLink>
          <NavLink to="/dashboard" className={linkClasses}>
            Dashboard
          </NavLink>
          <NavLink to="/admin" className={linkClasses}>
            Admin
          </NavLink>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <span className="text-sm text-slate-200">{user?.name}</span>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="rounded bg-white px-3 py-2 text-sm font-medium text-blue-700 shadow hover:bg-slate-100"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="rounded bg-white px-3 py-2 text-sm font-medium text-blue-700 shadow hover:bg-slate-100"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
