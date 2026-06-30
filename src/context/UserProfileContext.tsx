import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TipoProva = 'concurso_policial' | 'concurso_federal' | 'concurso_estadual' | 'enem' | 'vestibular' | 'oab' | 'outro';
export type NivelAtual = 'iniciante' | 'basico' | 'intermediario' | 'avancado';
export type Banca = 'CESPE/Cebraspe' | 'FCC' | 'FGV' | 'VUNESP' | 'IBFC' | 'Quadrix' | 'AOCP' | 'NC-UFPR' | 'não sei';

export interface UserProfile {
  onboardingCompleted: boolean;
  // Objetivo
  objetivo: string;
  tipoProva: TipoProva;
  nomeConcurso: string;
  banca: Banca;
  // Cronograma
  dataProva: string;
  horasDia: number;
  // Diagnóstico inicial
  nivelAtual: NivelAtual;
  materiasDificeis: string[];
  materiasFortes: string[];
  // Gerado pela Athena
  planoGeradoEm?: string;
  diasRestantes?: number;
  // Diagnóstico em tempo real
  errosPorMateria: Record<string, number>;
  acertosPorMateria: Record<string, number>;
}

const DEFAULT_PROFILE: UserProfile = {
  onboardingCompleted: false,
  objetivo: '',
  tipoProva: 'concurso_policial',
  nomeConcurso: '',
  banca: 'CESPE/Cebraspe',
  dataProva: '',
  horasDia: 4,
  nivelAtual: 'intermediario',
  materiasDificeis: [],
  materiasFortes: [],
  errosPorMateria: {},
  acertosPorMateria: {},
};

interface UserProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  registrarResultadoSimulado: (materia: string, acertos: number, total: number) => void;
  getDiagnostico: () => DiagnosticoData;
}

export interface DiagnosticoData {
  materiasCriticas: { nome: string; taxa: number }[];
  materiasFortes: { nome: string; taxa: number }[];
  recomendacoes: string[];
  alertas: string[];
  scorePorMateria: Record<string, number>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aprovaia_profile');
    return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
  });

  const save = (p: UserProfile) => {
    localStorage.setItem('aprovaia_profile', JSON.stringify(p));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      save(next);
      return next;
    });
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    const diasRestantes = data.dataProva
      ? Math.max(0, Math.ceil((new Date(data.dataProva).getTime() - Date.now()) / 86400000))
      : undefined;
    updateProfile({ ...data, onboardingCompleted: true, planoGeradoEm: new Date().toISOString(), diasRestantes });
  };

  const registrarResultadoSimulado = (materia: string, acertos: number, total: number) => {
    setProfile(prev => {
      const erros = total - acertos;
      const next = {
        ...prev,
        errosPorMateria: { ...prev.errosPorMateria, [materia]: (prev.errosPorMateria[materia] || 0) + erros },
        acertosPorMateria: { ...prev.acertosPorMateria, [materia]: (prev.acertosPorMateria[materia] || 0) + acertos },
      };
      save(next);
      return next;
    });
  };

  const getDiagnostico = (): DiagnosticoData => {
    const scorePorMateria: Record<string, number> = {};
    const todasMaterias = new Set([
      ...Object.keys(profile.acertosPorMateria),
      ...Object.keys(profile.errosPorMateria),
    ]);

    todasMaterias.forEach(m => {
      const a = profile.acertosPorMateria[m] || 0;
      const e = profile.errosPorMateria[m] || 0;
      const total = a + e;
      scorePorMateria[m] = total > 0 ? Math.round((a / total) * 100) : 50;
    });

    const sorted = Object.entries(scorePorMateria).sort((a, b) => a[1] - b[1]);
    const criticas = sorted.filter(([, s]) => s < 60).map(([n, taxa]) => ({ nome: n, taxa }));
    const fortes = sorted.filter(([, s]) => s >= 75).reverse().map(([n, taxa]) => ({ nome: n, taxa }));

    const recomendacoes: string[] = [];
    const alertas: string[] = [];

    criticas.slice(0, 3).forEach(m => {
      alertas.push(`Você está acertando apenas ${m.taxa}% em ${m.nome}. Revisão urgente necessária.`);
      recomendacoes.push(`Resolva 20 questões de ${m.nome} hoje antes de estudar qualquer outra matéria.`);
    });
    if (criticas.length === 0) recomendacoes.push('Parabéns! Nenhuma matéria crítica identificada. Mantenha o ritmo.');

    return { materiasCriticas: criticas, materiasFortes: fortes, recomendacoes, alertas, scorePorMateria };
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, completeOnboarding, registrarResultadoSimulado, getDiagnostico }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
}
