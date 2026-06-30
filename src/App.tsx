import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { UserProfileProvider, useUserProfile } from './context/UserProfileContext';

import { Sidebar } from './components/layout/Sidebar';

import { LoginPage }          from './pages/LoginPage';
import { RegisterPage }       from './pages/RegisterPage';
import { OnboardingPage }     from './pages/OnboardingPage';
import { DashboardPage }      from './pages/DashboardPage';
import { MentorPage }         from './pages/MentorPage';
import { CronogramaPage }     from './pages/CronogramaPage';
import { SimuladosPage }      from './pages/SimuladosPage';
import { PomodoroPage }       from './pages/PomodoroPage';
import { MapaAprovacaoPage }  from './pages/MapaAprovacaoPage';
import { SalaDeGuerraPage }   from './pages/SalaDeGuerraPage';
import { TemplatesPage }      from './pages/TemplatesPage';
import { DiagnosticoPage }    from './pages/DiagnosticoPage';
import { PerfilPage }         from './pages/PerfilPage';
import { ConfiguracoesPage }  from './pages/ConfiguracoesPage';

function AppInner() {
  const { user, loading } = useAuth();
  const { profile } = useUserProfile();
  const { page, navigate } = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <span className="text-white font-bold">A</span>
          </div>
          <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Auth guard
  if (!user) {
    if (page === 'register') return <RegisterPage />;
    return <LoginPage />;
  }

  // Onboarding guard
  if (!profile.onboardingCompleted && page !== 'onboarding') {
    return <OnboardingPage />;
  }
  if (page === 'onboarding') return <OnboardingPage />;

  // App shell
  const PAGES: Record<string, React.ReactNode> = {
    dashboard:       <DashboardPage />,
    mentor:          <MentorPage />,
    cronograma:      <CronogramaPage />,
    simulados:       <SimuladosPage />,
    pomodoro:        <PomodoroPage />,
    'mapa-aprovacao':<MapaAprovacaoPage />,
    'sala-de-guerra':<SalaDeGuerraPage />,
    templates:       <TemplatesPage />,
    diagnostico:     <DiagnosticoPage />,
    perfil:          <PerfilPage />,
    configuracoes:   <ConfiguracoesPage />,
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      {PAGES[page] ?? <DashboardPage />}
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <UserProfileProvider>
          <AppInner />
        </UserProfileProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
