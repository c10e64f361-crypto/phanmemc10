// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // ĐÃ KHAI BÁO setUser

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = (userData) => {
    const fullUser = {
      ...userData,
      role: userData.cccd === '000000000000' ? 'admin' : 'user' // Admin CCCD
    };
    setUser(fullUser); // ĐÃ DÙNG setUser
    localStorage.setItem('user', JSON.stringify(fullUser));
  };

  const register = (userData) => {
    const fullUser = {
      ...userData,
      role: 'user'
    };
    setUser(fullUser);
    localStorage.setItem('user', JSON.stringify(fullUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = { user, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};