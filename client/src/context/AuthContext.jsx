import PropTypes from 'prop-types';
import { createContext, useContext, useMemo, useState } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext(undefined);

const persistSession = (token, user) => {
  if (token) {
    window.localStorage.setItem('hms_access_token', token);
  } else {
    window.localStorage.removeItem('hms_access_token');
  }
  if (user) {
    window.localStorage.setItem('hms_user', JSON.stringify(user));
  } else {
    window.localStorage.removeItem('hms_user');
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => window.localStorage.getItem('hms_access_token'));
  const [user, setUser] = useState(() => {
    const raw = window.localStorage.getItem('hms_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
  const { data } = await apiClient.post('/v1/auth/login', credentials);
      setToken(data.token);
      setUser(data.user);
      persistSession(data.token, data.user);
      return data.user;
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to sign in.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    persistSession(null, null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      loading,
      error,
      isAuthenticated: Boolean(token)
    }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
