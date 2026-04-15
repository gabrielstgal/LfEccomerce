import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('lf-user');
    const token = localStorage.getItem('lf-token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // O backend retorna: token, id, name, email, roles
      const { token, roles, id, name } = response.data;
      
      const userData = { id, name, email, roles };
      
      localStorage.setItem('lf-token', token);
      localStorage.setItem('lf-user', JSON.stringify(userData));
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Erro no login", error);
      throw error.response?.data || "Ocorreu um erro no login.";
    }
  };

  const register = async (name, email, password, role) => {
    try {
      await api.post('/auth/register', { name, email, password, role });
      return true;
    } catch (error) {
      console.error("Erro no registro", error);
      throw error.response?.data || "Ocorreu um erro no registro.";
    }
  };

  const logout = () => {
    localStorage.removeItem('lf-token');
    localStorage.removeItem('lf-user');
    setUser(null);
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
