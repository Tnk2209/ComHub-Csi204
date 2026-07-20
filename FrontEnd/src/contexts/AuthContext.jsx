import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setAuthToken } from '../services/apiClient.js';
import * as authService from '../services/authService.js';

const AuthContext = createContext();

const TOKEN_KEY = 'comhub_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthToken(token);
    authService.me()
      .then(u => setUser(u))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { token, user: u } = await authService.login({ email, password });
    localStorage.setItem(TOKEN_KEY, token);
    setAuthToken(token);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async ({ email, password, first_name, last_name }) => {
    const { token, user: u } = await authService.register({ email, password, first_name, last_name });
    localStorage.setItem(TOKEN_KEY, token);
    setAuthToken(token);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
