import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vm_eduvera_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify user from stored token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('vm_eduvera_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('vm_eduvera_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed.');
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('vm_eduvera_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed.');
  };

  const logout = () => {
    localStorage.removeItem('vm_eduvera_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  // 1-Click Demo Login
  const demoLogin = async (role = 'student') => {
    if (role === 'tutor' || role === 'admin') {
      return login('tutor@vmeduvera.com', 'admin123');
    } else if (role === 'student2') {
      return login('ananya.iyer@example.com', 'student123');
    } else {
      return login('student@vmeduvera.com', 'student123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        demoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
