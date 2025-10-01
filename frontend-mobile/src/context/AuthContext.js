import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    user: null,
  });

  useEffect(() => {
    if (authState.accessToken) {
      client.defaults.headers.common.Authorization = `Bearer ${authState.accessToken}`;
    } else {
      delete client.defaults.headers.common.Authorization;
    }
  }, [authState.accessToken]);

  const value = useMemo(
    () => ({
      authState,
      isAuthenticated: Boolean(authState.accessToken),
      setAuthState,
      logout: () => setAuthState({ accessToken: null, user: null }),
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
