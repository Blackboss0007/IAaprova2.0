import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: '1',
  name: 'Rafael Ximenes',
  email: 'rafael@aprovaia.com',
  objetivo: 'Delegado de Polícia Civil - SP',
  horasDisponiveis: 6,
  concurso: 'PC-SP 2025',
  dataProva: '2025-08-15',
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('aprovaia_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, _password: string): Promise<{ error?: string }> => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    if (email.includes('@')) {
      const u = { ...MOCK_USER, email };
      setUser(u);
      localStorage.setItem('aprovaia_user', JSON.stringify(u));
      setLoading(false);
      return {};
    }
    setLoading(false);
    return { error: 'Email ou senha inválidos.' };
  };

  const signUp = async (name: string, email: string, _password: string): Promise<{ error?: string }> => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    const u: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      createdAt: new Date().toISOString(),
    };
    setUser(u);
    localStorage.setItem('aprovaia_user', JSON.stringify(u));
    setLoading(false);
    return {};
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('aprovaia_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('aprovaia_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
